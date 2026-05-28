"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

interface UseTextToSpeechResult {
  supported: boolean;
  speaking: boolean;
  speak: (text: string) => void;
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

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!text.trim()) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => {
      if (utteranceRef.current === utterance) {
        setSpeaking(false);
        utteranceRef.current = null;
      }
    };
    utterance.onerror = () => {
      if (utteranceRef.current === utterance) {
        setSpeaking(false);
        utteranceRef.current = null;
      }
    };
    utteranceRef.current = utterance;
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
