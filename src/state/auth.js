import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { getJson, setJson, removeKey } from './storage';

const AuthContext = createContext(null);

async function hashPassword(password, salt) {
  const input = `${salt}:${password}`;
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, input);
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function makeSalt() {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return bytesToHex(bytes);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await getJson('session', null);
      setUser(session?.user ?? null);
      setBooting(false);
    })();
  }, []);

  const api = useMemo(() => {
    return {
      user,
      booting,
      signUp: async ({ name, email, password }) => {
        const users = (await getJson('users', [])) ?? [];
        const exists = users.some((u) => (u.email ?? '').toLowerCase() === (email ?? '').toLowerCase());
        if (exists) {
          throw new Error('An account with this email already exists.');
        }

        const salt = await makeSalt();
        const passwordHash = await hashPassword(password, salt);

        const newUser = {
          id: `u_${Date.now()}_${Math.random().toString(16).slice(2)}`,
          name: name?.trim() || 'User',
          email: email?.trim(),
          salt,
          passwordHash,
          createdAt: Date.now(),
        };

        await setJson('users', [...users, newUser]);
        await setJson('session', { user: { id: newUser.id, name: newUser.name, email: newUser.email } });
        setUser({ id: newUser.id, name: newUser.name, email: newUser.email });
      },

      signIn: async ({ email, password }) => {
        const users = (await getJson('users', [])) ?? [];
        const found = users.find((u) => (u.email ?? '').toLowerCase() === (email ?? '').toLowerCase());
        if (!found) throw new Error('Invalid email or password.');

        const computed = await hashPassword(password, found.salt);
        if (computed !== found.passwordHash) throw new Error('Invalid email or password.');

        await setJson('session', { user: { id: found.id, name: found.name, email: found.email } });
        setUser({ id: found.id, name: found.name, email: found.email });
      },

      signOut: async () => {
        await removeKey('session');
        setUser(null);
      },
    };
  }, [user, booting]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

