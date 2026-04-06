import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getJson, setJson } from './storage';

const PairingContext = createContext(null);

function normalizeDeviceLabel(label) {
  const trimmed = (label ?? '').trim();
  return trimmed.length ? trimmed : 'Paired device';
}

export function PairingProvider({ children }) {
  const [pairedDevices, setPairedDevices] = useState([]);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await getJson('pairedDevices', []);
      setPairedDevices(Array.isArray(saved) ? saved : []);
      setBooting(false);
    })();
  }, []);

  const api = useMemo(() => {
    return {
      pairedDevices,
      booting,
      addDevice: async ({ deviceId, name, connected = true }) => {
        const id = deviceId || `d_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        const nextDevice = {
          id,
          name: normalizeDeviceLabel(name),
          connected: !!connected,
          addedAt: Date.now(),
        };
        const next = [nextDevice, ...pairedDevices.filter((d) => d.id !== id)];
        setPairedDevices(next);
        await setJson('pairedDevices', next);
      },
      setConnected: async (id, connected) => {
        const next = pairedDevices.map((d) => (d.id === id ? { ...d, connected: !!connected } : d));
        setPairedDevices(next);
        await setJson('pairedDevices', next);
      },
      clearDevices: async () => {
        setPairedDevices([]);
        await setJson('pairedDevices', []);
      },
    };
  }, [pairedDevices, booting]);

  return <PairingContext.Provider value={api}>{children}</PairingContext.Provider>;
}

export function usePairing() {
  const ctx = useContext(PairingContext);
  if (!ctx) throw new Error('usePairing must be used within PairingProvider');
  return ctx;
}

