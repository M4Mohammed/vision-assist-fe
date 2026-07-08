"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, FileVideo, Image as ImageIcon } from "lucide-react";
import { AuthGuard } from "@/components/layout/AuthGuard";
import {
  Segmented,
  SegmentedContent,
  SegmentedList,
  SegmentedTrigger,
} from "@/components/ui/SegmentedControl";
import { CameraFrame } from "@/components/caption/CameraFrame";
import { MediaUpload } from "@/components/caption/MediaUpload";
import { GeneratedCaptionPanel } from "@/components/caption/GeneratedCaptionPanel";
import {
  DialogClose,
  DialogContent,
  DialogRoot,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useCameraStream } from "@/lib/caption/useCameraStream";
import { useFrameCapture } from "@/lib/caption/useFrameCapture";
import { useTextToSpeech } from "@/lib/caption/useTextToSpeech";
import {
  CaptionSocket,
  type CaptionClassification,
  type CaptionLatency,
} from "@/lib/caption/CaptionSocket";
import { LatencyHud } from "@/components/caption/LatencyHud";
import {
  sampleImageCaption,
  sampleRecordedCaption,
} from "@/lib/mock/captions";
import { useToast } from "@/components/ui/Toast";

type CaptionTab = "image" | "recorded" | "live";

// How often we capture/send a live frame. Kept above ~1s so a spoken caption has time to finish
// before the next one arrives (text-to-speech of a sentence takes a couple of seconds); the
// non-interrupting auto-speak guard below is the backstop for captions that run longer than this.
const LIVE_CAPTURE_INTERVAL_MS = 3000;

interface CaptionState {
  text: string | null;
  classification: CaptionClassification | null;
}

const EMPTY: CaptionState = { text: null, classification: null };

export default function CaptionPage() {
  return (
    <AuthGuard>
      <CaptionExperience />
    </AuthGuard>
  );
}

function CaptionExperience() {
  const [activeTab, setActiveTab] = useState<CaptionTab>("live");
  const [imageCaption, setImageCaption] = useState<CaptionState>(EMPTY);
  const [recordedCaption, setRecordedCaption] =
    useState<CaptionState>(EMPTY);
  const [liveCaption, setLiveCaption] = useState<CaptionState>(EMPTY);
  const [liveLatency, setLiveLatency] = useState<CaptionLatency | null>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [recordedBusy, setRecordedBusy] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [denyDialogOpen, setDenyDialogOpen] = useState(false);

  const socketRef = useRef<CaptionSocket | null>(null);
  const { videoRef, status, errorMessage, start, stop } = useCameraStream();
  const tts = useTextToSpeech();
  const { toast } = useToast();

  // Surfacing the friendly camera-denied dialog when the hook reports denial.
  // This is the documented React hydration / external-state synchronization
  // pattern — the cascade is intentional and bounded.
  useEffect(() => {
    if (status === "denied") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDenyDialogOpen(true);
    }
  }, [status]);

  const captionByTab: Record<CaptionTab, CaptionState> = {
    image: imageCaption,
    recorded: recordedCaption,
    live: liveCaption,
  };
  const liveBusy = activeTab === "live" && status === "active";
  const busyByTab: Record<CaptionTab, boolean> = {
    image: imageBusy,
    recorded: recordedBusy,
    live: liveBusy,
  };
  const activeCaption = captionByTab[activeTab];
  const activeBusy = busyByTab[activeTab];

  const speakIfEnabled = useCallback(
    (text: string, classification?: CaptionClassification | null) => {
      if (autoSpeak && tts.supported) {
        // Danger captions preempt whatever is being read; a safe caption waits its turn so it
        // doesn't cut off the previous one mid-sentence.
        const dangerous = classification?.label?.toUpperCase() === "DANGEROUS";
        tts.speak(text, { interrupt: dangerous });
      }
    },
    [autoSpeak, tts],
  );

  // Connect a mock socket whenever Live is the active tab and the camera is on.
  useEffect(() => {
    if (activeTab !== "live" || status !== "active") {
      socketRef.current?.close();
      socketRef.current = null;
      return;
    }
    const socket = new CaptionSocket();
    socketRef.current = socket;
    const unsubscribe = socket.on((event) => {
      if (event.type === "caption") {
        setLiveCaption({
          text: event.caption.text,
          classification: event.caption.classification,
        });
        setLiveLatency(event.caption.latency);
        speakIfEnabled(event.caption.text, event.caption.classification);
      } else if (event.type === "error") {
        toast({
          title: "Live captioning error",
          description: event.message,
          tone: "error",
        });
      }
    });
    socket.connect();
    return () => {
      unsubscribe();
      socket.close();
      socketRef.current = null;
    };
  }, [activeTab, status, speakIfEnabled, toast]);

  useFrameCapture({
    videoRef,
    intervalMs: LIVE_CAPTURE_INTERVAL_MS,
    enabled: liveBusy,
    onFrame: (frame) => {
      socketRef.current?.sendFrame(frame);
    },
  });

  const handleTabChange = (value: string) => {
    const next = value as CaptionTab;
    if (next !== "live") {
      tts.cancel();
      stop();
    }
    setActiveTab(next);
  };

  const onImageLoaded = () => {
    setImageBusy(true);
    setImageCaption(EMPTY);
    setTimeout(() => {
      setImageCaption({
        text: sampleImageCaption.text,
        classification: null,
      });
      setImageBusy(false);
      speakIfEnabled(sampleImageCaption.text);
    }, 900);
  };

  const onRecordedLoaded = () => {
    setRecordedBusy(true);
    setRecordedCaption(EMPTY);
    setTimeout(() => {
      setRecordedCaption({
        text: sampleRecordedCaption.text,
        classification: null,
      });
      setRecordedBusy(false);
      speakIfEnabled(sampleRecordedCaption.text);
    }, 1200);
  };

  const onSpeakActive = () => {
    if (!activeCaption.text) return;
    if (tts.speaking) {
      tts.cancel();
      return;
    }
    tts.speak(activeCaption.text);
  };

  const onToggleAutoSpeak = (next: boolean) => {
    setAutoSpeak(next);
    if (next) {
      toast({
        title: "Reading captions aloud",
        description: "We'll speak each new caption as it arrives.",
        tone: "info",
      });
    } else {
      tts.cancel();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Real-Time Captioning
        </h1>
        <p className="text-base text-[var(--fg-secondary)]">
          Advanced visual analysis with live camera feed, recorded clips, or
          single images.
        </p>
      </header>

      <Segmented value={activeTab} onValueChange={handleTabChange}>
        <SegmentedList aria-label="Captioning input source">
          <SegmentedTrigger value="image">
            <ImageIcon aria-hidden="true" className="mr-2 size-4" />
            Image
          </SegmentedTrigger>
          <SegmentedTrigger value="recorded">
            <FileVideo aria-hidden="true" className="mr-2 size-4" />
            Recorded Video
          </SegmentedTrigger>
          <SegmentedTrigger value="live">
            <Camera aria-hidden="true" className="mr-2 size-4" />
            Live Video
          </SegmentedTrigger>
        </SegmentedList>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div>
            <SegmentedContent value="image" forceMount hidden={activeTab !== "image"}>
              <MediaUpload
                kind="image"
                onLoaded={onImageLoaded}
                onCleared={() => setImageCaption(EMPTY)}
              />
            </SegmentedContent>
            <SegmentedContent
              value="recorded"
              forceMount
              hidden={activeTab !== "recorded"}
            >
              <MediaUpload
                kind="video"
                onLoaded={onRecordedLoaded}
                onCleared={() => setRecordedCaption(EMPTY)}
              />
            </SegmentedContent>
            <SegmentedContent value="live" forceMount hidden={activeTab !== "live"}>
              <CameraFrame
                videoRef={videoRef}
                status={status}
                errorMessage={errorMessage}
                onStart={start}
                onStop={stop}
              />
            </SegmentedContent>
          </div>

          <div className="flex flex-col gap-4">
            <GeneratedCaptionPanel
              caption={activeCaption.text}
              classification={activeCaption.classification}
              speakSupported={tts.supported}
              autoSpeak={autoSpeak}
              onToggleAutoSpeak={onToggleAutoSpeak}
              onSpeak={onSpeakActive}
              speaking={tts.speaking}
              busy={activeBusy}
            />
            {activeTab === "live" ? <LatencyHud sample={liveLatency} /> : null}
          </div>
        </div>
      </Segmented>

      <DialogRoot
        open={denyDialogOpen}
        onOpenChange={(next) => setDenyDialogOpen(next)}
      >
        <DialogContent
          title="Camera access blocked"
          description="To stream your camera, allow CapIt to use it in your browser settings."
        >
          <div className="mt-2 flex flex-col gap-3 text-sm text-[var(--fg-secondary)]">
            <p>
              Open the address bar permission menu, switch the Camera setting to
              &ldquo;Allow,&rdquo; then reload the page.
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
            <Button
              onClick={() => {
                setDenyDialogOpen(false);
                void start();
              }}
            >
              Try again
            </Button>
          </div>
        </DialogContent>
      </DialogRoot>
    </div>
  );
}
