import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { TextInputField } from '../components/TextInputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAppTheme } from '../state/appTheme';
import { useAuth } from '../state/auth';

const USERNAME_RE = /^[a-zA-Z0-9]{3,16}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function isUsernameValid(value) {
  return USERNAME_RE.test(value.trim());
}

function isEmailValid(value) {
  return EMAIL_RE.test(value.trim());
}

function isPasswordValid(value) {
  return PASSWORD_RE.test(value);
}

export function SignupScreen({ navigation }) {
  const { colors } = useAppTheme();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirm: false,
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        layout: {
          flex: 1,
          justifyContent: 'space-between',
        },
        scroll: {
          flex: 1,
          minHeight: 0,
        },
        scrollContent: {
          paddingTop: 4,
          paddingBottom: 12,
        },
        flex1: { flex: 1 },
        spacerSm: { height: 12 },
        spacerMd: { height: 18 },
        brand: {
          color: colors.text,
          fontSize: 26,
          fontWeight: '800',
          marginTop: 10,
          textAlign: 'center',
        },
        headline: {
          color: colors.text,
          fontSize: 22,
          fontWeight: '800',
          marginTop: 18,
          textAlign: 'center',
        },
        sub: {
          color: colors.muted,
          fontSize: 15,
          lineHeight: 22,
          marginTop: 8,
          textAlign: 'center',
        },
        passwordRow: { flexDirection: 'row', alignItems: 'center' },
        eyeBtn: { minWidth: 44, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
        checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
        checkbox: {
          width: 24,
          height: 24,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: colors.checkboxBorder,
          alignItems: 'center',
          justifyContent: 'center',
        },
        checkText: { color: colors.text, fontSize: 15, marginLeft: 10, flexShrink: 1 },
        footer: {
          width: '100%',
          paddingBottom: 6,
        },
        bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
        bottomText: { color: colors.muted, fontSize: 15 },
        link: {
          color: colors.primary,
          fontSize: 16,
          fontWeight: '800',
          textDecorationLine: 'underline',
          marginLeft: 6,
        },
      }),
    [colors],
  );

  const usernameError = useMemo(() => {
    if (!touched.username) return '';
    const t = name.trim();
    if (!t) return 'Enter a username (3–16 characters, alphanumeric only).';
    if (!USERNAME_RE.test(t)) return 'Use 3–16 letters and numbers only.';
    return '';
  }, [touched.username, name]);

  const emailError = useMemo(() => {
    if (!touched.email) return '';
    const t = email.trim();
    if (!t) return 'Enter your email address.';
    if (!EMAIL_RE.test(t)) return 'Enter a valid email address.';
    return '';
  }, [touched.email, email]);

  const passwordError = useMemo(() => {
    if (!touched.password) return '';
    if (!password) return 'Enter a password.';
    if (!PASSWORD_RE.test(password)) {
      return 'Minimum 8 characters with uppercase, lowercase, and a number.';
    }
    return '';
  }, [touched.password, password]);

  const confirmError = useMemo(() => {
    if (confirm.length > 0 && confirm !== password) return 'Passwords do not match.';
    if (!touched.confirm) return '';
    if (!confirm) return 'Confirm your password.';
    return '';
  }, [touched.confirm, confirm, password]);

  const formValid =
    isUsernameValid(name) &&
    isEmailValid(email) &&
    isPasswordValid(password) &&
    confirm.length > 0 &&
    confirm === password &&
    agree;

  async function handleSignUp() {
    if (!agree) {
      Alert.alert('Terms', 'Please agree to the Terms & Privacy Policy.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Passwords', 'Password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      await signUp({ name: name.trim(), email: email.trim(), password });
      navigation.replace('Permissions');
    } catch (e) {
      Alert.alert('Sign up failed', e?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.layout}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.brand}>Ear Bridge</Text>
          <Text style={styles.headline}>Create Account</Text>
          <Text style={styles.sub}>
            Create An Account To Start Receiving Important Sound Alerts And Stay Connected
          </Text>

          <View style={styles.spacerMd} />

          <TextInputField
            value={name}
            onChangeText={setName}
            placeholder="Username"
            autoCapitalize="none"
            error={usernameError}
            onBlur={() => setTouched((s) => ({ ...s, username: true }))}
          />
          <View style={styles.spacerSm} />

          <View style={styles.passwordRow}>
            <View style={styles.flex1}>
              <TextInputField value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
            </View>
          </View>
          <View style={styles.spacerSm} />

          <TextInputField
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            onBlur={() => setTouched((s) => ({ ...s, email: true }))}
          />
          <View style={styles.spacerSm} />

          <View style={styles.passwordRow}>
            <View style={styles.flex1}>
              <TextInputField
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!showPwd}
                error={passwordError}
                onBlur={() => setTouched((s) => ({ ...s, password: true }))}
              />
            </View>
            <Pressable
              onPress={() => setShowPwd((v) => !v)}
              style={styles.eyeBtn}
              accessibilityLabel="Toggle password visibility"
            >
              <Ionicons name={showPwd ? 'eye-off' : 'eye'} size={22} color={colors.muted} />
            </Pressable>
          </View>
          <View style={styles.spacerSm} />

          <View style={styles.passwordRow}>
            <View style={styles.flex1}>
              <TextInputField
                value={confirm}
                onChangeText={setConfirm}
                placeholder="Confirm Password"
                secureTextEntry={!showConfirm}
                error={confirmError}
                onBlur={() => setTouched((s) => ({ ...s, confirm: true }))}
              />
            </View>
            <Pressable
              onPress={() => setShowConfirm((v) => !v)}
              style={styles.eyeBtn}
              accessibilityLabel="Toggle confirm password visibility"
            >
              <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={22} color={colors.muted} />
            </Pressable>
          </View>

          <View style={styles.spacerSm} />

          <Pressable onPress={() => setAgree((v) => !v)} style={styles.checkRow} accessibilityLabel="Agree to terms">
            <View
              style={[
                styles.checkbox,
                agree
                  ? {
                      borderColor: colors.primary,
                      backgroundColor: 'rgba(46, 125, 50, 0.28)',
                    }
                  : null,
              ]}
            >
              {agree ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
            </View>
            <Text style={styles.checkText}>
              I agree to the <Text style={{ color: colors.primary, fontWeight: '800' }}>Terms & Privacy Policy</Text>
            </Text>
          </Pressable>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton title={loading ? 'Signing up...' : 'Sign up'} disabled={loading || !formValid} onPress={handleSignUp} />
          <View style={styles.spacerMd} />
          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Already have an account?</Text>
            <Pressable onPress={() => navigation.replace('Login')}>
              <Text style={styles.link}>Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
