import { useEffect, useRef, useState } from 'react';

const SIM_EVENTS = [
  { type: 'Normal Sound', label: 'Baby Crying', location: 'Bed Room' },
  { type: 'Normal Sound', label: 'Door Bell', location: 'Front Entrance' },
  { type: 'Emergency Sound', label: 'Fire Alarm', location: 'Kitchen' },
  { type: 'Normal Sound', label: 'Loud Noise', location: 'Living Room' },
  { type: 'Emergency Sound', label: 'Ambulance Nearby', location: 'Street' },
];

function pickEvent() {
  // Weight emergency slightly more so the UI demo triggers.
  const weighted = [
    ...SIM_EVENTS,
    ...SIM_EVENTS.filter((e) => e.type === 'Emergency Sound'),
  ];
  return weighted[Math.floor(Math.random() * weighted.length)];
}

export function useSoundDetection({ enabled, onNewAlert }) {
  const [listening, setListening] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [lastDetected, setLastDetected] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setListening(false);
      setConfidence(0);
      setLastDetected(null);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      return;
    }

    setListening(true);

    const loop = () => {
      // Front-end demo:
      // Replace this section with your real on-device / AI audio classification.
      // Expected output shape:
      //   { type: 'Emergency Sound' | 'Normal Sound', label: string, location?: string }
      // and a confidence number (0-100).
      const event = pickEvent();
      const conf = 80 + Math.floor(Math.random() * 20); // 80-99
      setConfidence(conf);
      setLastDetected({
        type: event.type,
        label: event.label,
        location: event.location,
        confidence: conf,
      });

      onNewAlert?.({
        type: event.type,
        label: event.label,
        location: event.location,
        confidence: conf,
      });

      // Schedule next detection.
      const nextInMs = 9000 + Math.random() * 12000; // 9-21s
      timerRef.current = setTimeout(loop, nextInMs);
    };

    // Kick off quickly for demo.
    const firstInMs = 3000 + Math.random() * 3000;
    timerRef.current = setTimeout(loop, firstInMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [enabled, onNewAlert]);

  return {
    listening,
    confidence,
    lastDetected,
  };
}

