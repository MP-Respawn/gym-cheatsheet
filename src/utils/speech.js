/*
 * speech.js: the browser's speech recognition, if it has one
 * (SpeechRecognition, or webkitSpeechRecognition in Safari). Used by
 * DictateButton.jsx; `canDictate` tells screens whether the microphone
 * button will show.
 */
export const SpeechRecognition =
  typeof window === "undefined" ? null : window.SpeechRecognition || window.webkitSpeechRecognition || null;

export const canDictate = Boolean(SpeechRecognition);
