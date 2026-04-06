import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getJson, setJson } from './storage';

const DEFAULT_SUBSCRIPTION = {
  trialEndsAt: null, // number (ms)
  unlocked: false,
  skipForNow: false,
};

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscriptionState] = useState(DEFAULT_SUBSCRIPTION);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await getJson('subscription', null);
      setSubscriptionState({ ...DEFAULT_SUBSCRIPTION, ...(saved ?? {}) });
      setBooting(false);
    })();
  }, []);

  const api = useMemo(() => {
    const now = Date.now();
    const trialActive = typeof subscription.trialEndsAt === 'number' && subscription.trialEndsAt > now;
    const accessGranted = !!subscription.unlocked || trialActive;

    return {
      subscription,
      booting,
      trialActive,
      accessGranted,
      startTrial: async () => {
        const ends = Date.now() + 7 * 24 * 60 * 60 * 1000;
        const next = { trialEndsAt: ends, unlocked: false, skipForNow: false };
        setSubscriptionState(next);
        await setJson('subscription', next);
      },
      unlockFullAccess: async () => {
        const next = { ...subscription, unlocked: true };
        setSubscriptionState(next);
        await setJson('subscription', next);
      },
      markSkipped: async () => {
        const next = { ...subscription, skipForNow: true };
        setSubscriptionState(next);
        await setJson('subscription', next);
      },
      clearSubscriptionForDemo: async () => {
        const next = { ...DEFAULT_SUBSCRIPTION };
        setSubscriptionState(next);
        await setJson('subscription', next);
      },
    };
  }, [subscription, booting]);

  return <SubscriptionContext.Provider value={api}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}

