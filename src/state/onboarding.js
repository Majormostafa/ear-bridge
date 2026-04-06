import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getJson, setJson } from './storage';

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  const [onboardingDone, setOnboardingDoneState] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await getJson('onboarding', null);
      setOnboardingDoneState(!!saved?.done);
      setBooting(false);
    })();
  }, []);

  const api = useMemo(() => {
    return {
      onboardingDone,
      booting,
      setOnboardingDone: async () => {
        setOnboardingDoneState(true);
        await setJson('onboarding', { done: true });
      },
      skipOnboarding: async () => {
        setOnboardingDoneState(true);
        await setJson('onboarding', { done: true });
      },
    };
  }, [onboardingDone, booting]);

  return <OnboardingContext.Provider value={api}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}

