"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

interface SpeakOptions {
  /**
   * When false, a request is ignored if speech is already in progress (the current utterance is
   * left to finish instead of being cut off). Defaults to true (cancel current, speak the new text).
   */
  interrupt?: boolean;
}

interface UseTextToSpeechResult {
  supported: boolean;
  speaking: boolean;
  speak: (text: string, options?: SpeakOptions) => void;
  cancel: () => void;
}

function subscribe() {
  return () => {};
}

function getClientSnapshot(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useTextToSpeech(): UseTextToSpeechResult {
  const supported = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  // Mirrors `speaking` synchronously so `speak` can decide whether to interrupt without depending
  // on render state (avoids stale closures and re-render churn in the caller).
  const speakingRef = useRef(false);

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    speakingRef.current = false;
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string, options?: SpeakOptions) => {
    if (!text.trim()) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    // Don't cut off a caption that's still being read when the caller asked not to interrupt.
    if (options?.interrupt === false && speakingRef.current) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => {
      if (utteranceRef.current === utterance) {
        speakingRef.current = false;
        setSpeaking(false);
        utteranceRef.current = null;
      }
    };
    utterance.onerror = () => {
      if (utteranceRef.current === utterance) {
        speakingRef.current = false;
        setSpeaking(false);
        utteranceRef.current = null;
      }
    };
    utteranceRef.current = utterance;
    speakingRef.current = true;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { supported, speaking, speak, cancel };
}
