import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getJson, setJson } from './storage';

const DEFAULT_PERMS = {
  microphone: false,
  camera: false,
  notifications: false,
  background: false,
};

const PermissionsContext = createContext(null);

export function PermissionsProvider({ children }) {
  const [permissions, setPermissionsState] = useState(DEFAULT_PERMS);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await getJson('permissions', null);
      setPermissionsState({ ...DEFAULT_PERMS, ...(saved ?? {}) });
      setBooting(false);
    })();
  }, []);

  const api = useMemo(() => {
    return {
      permissions,
      booting,
      setPermissionGranted: async (key, value) => {
        const next = { ...permissions, [key]: !!value };
        setPermissionsState(next);
        await setJson('permissions', next);
      },
      setAllPermissions: async (next) => {
        const merged = { ...DEFAULT_PERMS, ...(next ?? {}) };
        setPermissionsState(merged);
        await setJson('permissions', merged);
      },
      allCoreGranted: !!(permissions.microphone && permissions.notifications && permissions.camera),
    };
  }, [permissions, booting]);

  return <PermissionsContext.Provider value={api}>{children}</PermissionsContext.Provider>;
}

export function usePermissions() {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error('usePermissions must be used within PermissionsProvider');
  return ctx;
}

