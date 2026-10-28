/*
 * DictateButton.jsx
 *
 * A microphone button that types what you say into a text field, using the
 * browser's own speech recognition (Web Speech API: SpeechRecognition, or
 * webkitSpeechRecognition in Safari), in Argentine Spanish. Free, and the
 * app's servers never hear anything.
 *
 * Tap to start ("Escuchando..."), talk, and the words appear in the field
 * after what was already there, where they can be fixed before sending.
 * It stops after a pause, or with another tap. The first time, the browser
 * asks for the microphone.
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

export default function DictateButton({ value, onChange, onError }) {
  const [listening, setListening] = useState(false);
  const recognition = useRef(null);
  // Stop listening if the field goes away mid-sentence.
  useEffect(() => () => recognition.current?.abort(), []);

  if (!Recognition) return null;

  function start() {
    const r = new Recognition();
    r.lang = "es-AR";
    r.interimResults = true; // words appear while talking
    r.continuous = false; // ends after a pause
    const before = value.trim();
    r.onresult = (event) => {
      const said = Array.from(event.results, (result) => result[0].transcript).join("");
      onChange(before ? `${before} ${said}` : said);
    };
    r.onerror = (event) => {
      if (event.error === "no-speech" || event.error === "aborted") return;
      onError?.(
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? "Para dictar, permití el micrófono en el navegador."
          : "No se pudo usar el micrófono. Probá de nuevo o escribilo.",
      );
    };
    r.onend = () => setListening(false);
    recognition.current = r;
    onError?.("");
    setListening(true);
    r.start();
  }

  function stop() {
    recognition.current?.stop();
  }

  return (
    <button
      type="button"
      className={listening ? "icon-button dictate listening" : "icon-button dictate"}
      aria-label={listening ? "Dejar de dictar" : "Dictar"}
      aria-pressed={listening}
      onClick={listening ? stop : start}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d={MIC} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
