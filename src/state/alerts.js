import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getJson, setJson } from './storage';

const AlertsContext = createContext(null);

export function AlertsProvider({ children }) {
  const [alerts, setAlertsState] = useState([]);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await getJson('alerts', []);
      setAlertsState(Array.isArray(saved) ? saved : []);
      setBooting(false);
    })();
  }, []);

  const api = useMemo(() => {
    return {
      alerts,
      booting,
      addAlert: async ({ type, label, location, confidence }) => {
        const newAlert = {
          id: `a_${Date.now()}_${Math.random().toString(16).slice(2)}`,
          type: type ?? 'Unknown',
          label: label ?? 'Alert',
          location: location ?? '',
          createdAt: Date.now(),
          confidence: typeof confidence === 'number' ? confidence : undefined,
        };
        const next = [newAlert, ...alerts].slice(0, 50);
        setAlertsState(next);
        await setJson('alerts', next);
        return newAlert;
      },
      removeAlert: async (id) => {
        const next = alerts.filter((a) => a.id !== id);
        setAlertsState(next);
        await setJson('alerts', next);
      },
      clearAlerts: async () => {
        setAlertsState([]);
        await setJson('alerts', []);
      },
      markSeen: async () => {},
    };
  }, [alerts, booting]);

  return <AlertsContext.Provider value={api}>{children}</AlertsContext.Provider>;
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error('useAlerts must be used within AlertsProvider');
  return ctx;
}

export function formatRelativeTime(nowMs, createdAtMs) {
  const diff = Math.max(0, nowMs - createdAtMs);
  const minutes = Math.floor(diff / (60 * 1000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m Ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h Ago`;
  const days = Math.floor(hours / 24);
  return `${days}d Ago`;
}

