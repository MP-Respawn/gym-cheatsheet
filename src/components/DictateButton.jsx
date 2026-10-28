/*
 * DictateButton.jsx
 *
 * A microphone toggle that types what you say into a text field, using the
 * browser's own speech recognition (Web Speech API: SpeechRecognition, or
 * webkitSpeechRecognition in Safari), in Argentine Spanish. Free, and the
 * app's servers never hear anything.
 *
 * Tap once to start: the button turns into a red stop square and keeps
 * listening, pauses included, until you tap it again. The words appear in
 * the field after what was already there, where they can be fixed before
 * sending. The first time, the browser asks for the microphone.
 *
 * Browsers end a recognition at every pause, so while the toggle is on,
 * each one that ends starts the next, picking up from the text so far. (The
 * browsers' own "continuous" mode repeats words on Android.)
 *
 * Browsers without it (some installed iPhone apps) get no button; the
 * phone keyboard's own microphone still dictates there (`canDictate` in
 * src/utils/speech.js tells).
 *
 * value / onChange: the field's text. onError(message): a problem to show.
 */
import { useEffect, useRef, useState } from "react";
import { SpeechRecognition as Recognition } from "../utils/speech.js";

const MIC = "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7";
const STOP = "M7 7h10v10H7z";

const join = (before, said) => [before, said.trim()].filter(Boolean).join(" ");

export default function DictateButton({ value, onChange, onError }) {
  const [listening, setListening] = useState(false);
  const recognition = useRef(null);
  const wanted = useRef(false); // the toggle: keep listening until tapped again
  const text = useRef(""); // the field's text so far, dictation included

  // Stop listening if the field goes away mid-sentence.
  useEffect(
    () => () => {
      wanted.current = false;
      recognition.current?.abort();
    },
    [],
  );

  if (!Recognition) return null;

  // One recognition, until the browser ends it at a pause.
  function listen() {
    const r = new Recognition();
    r.lang = "es-AR";
    r.interimResults = true; // words appear while talking
    r.continuous = false;
    const before = text.current;
    r.onresult = (event) => {
      const said = Array.from(event.results, (result) => result[0].transcript).join("");
      text.current = join(before, said);
      onChange(text.current);
    };
    r.onerror = (event) => {
      if (event.error === "no-speech" || event.error === "aborted") return; // a silence: the next one starts
      wanted.current = false;
      onError?.(
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? "Para dictar, permití el micrófono en el navegador."
          : "No se pudo usar el micrófono. Probá de nuevo o escribilo.",
      );
    };
    r.onend = () => {
      if (!wanted.current) {
        setListening(false);
        return;
      }
      // Still on: a short breath, then keep listening.
      setTimeout(() => {
        if (!wanted.current) return setListening(false);
        try {
          listen();
        } catch {
          wanted.current = false;
          setListening(false);
        }
      }, 150);
    };
    recognition.current = r;
    r.start();
  }

  function start() {
    wanted.current = true;
    text.current = value.trim();
    onError?.("");
    setListening(true);
    try {
      listen();
    } catch {
      wanted.current = false;
      setListening(false);
      onError?.("No se pudo usar el micrófono. Probá de nuevo o escribilo.");
    }
  }

  function stop() {
    wanted.current = false;
    recognition.current?.stop(); // keeps what was already heard
  }

  return (
    <button
      type="button"
      className={listening ? "icon-button dictate listening" : "icon-button dictate"}
      aria-label={listening ? "Terminar de dictar" : "Dictar"}
      title={listening ? "Tocá para terminar" : "Tocá para dictar"}
      aria-pressed={listening}
      onClick={listening ? stop : start}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        {listening ? (
          <path d={STOP} fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        ) : (
          <path d={MIC} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}
