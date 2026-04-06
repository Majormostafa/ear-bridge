import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextInputField } from '../components/TextInputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { OutlineButton } from '../components/OutlineButton';
import { colors } from '../theme/colors';
import { useAuth } from '../state/auth';

export function SignupScreen({ navigation }) {
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
      await signUp({ name, email, password });
      navigation.replace('Permissions');
    } catch (e) {
      Alert.alert('Sign up failed', e?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.brand}>Ear Bridge</Text>
      <Text style={styles.headline}>Create Account</Text>
      <Text style={styles.sub}>
        Create An Account To Start Receiving Important Sound Alerts And Stay Connected
      </Text>

      <View style={{ height: 22 }} />

      <TextInputField value={name} onChangeText={setName} placeholder="Name" />
      <View style={{ height: 12 }} />

      <View style={styles.passwordRow}>
        <View style={{ flex: 1 }}>
          <TextInputField value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
        </View>
      </View>
      <View style={{ height: 12 }} />

      <TextInputField value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
      <View style={{ height: 12 }} />

      <View style={styles.passwordRow}>
        <View style={{ flex: 1 }}>
          <TextInputField value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry={!showPwd} />
        </View>
        <Pressable onPress={() => setShowPwd((v) => !v)} style={styles.eyeBtn} accessibilityLabel="Toggle password visibility">
          <Ionicons name={showPwd ? 'eye-off' : 'eye'} size={22} color={colors.muted} />
        </Pressable>
      </View>
      <View style={{ height: 12 }} />

      <View style={styles.passwordRow}>
        <View style={{ flex: 1 }}>
          <TextInputField value={confirm} onChangeText={setConfirm} placeholder="Confirm Password" secureTextEntry={!showConfirm} />
        </View>
        <Pressable onPress={() => setShowConfirm((v) => !v)} style={styles.eyeBtn} accessibilityLabel="Toggle confirm password visibility">
          <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={22} color={colors.muted} />
        </Pressable>
      </View>

      <View style={{ height: 12 }} />

      <Pressable onPress={() => setAgree((v) => !v)} style={styles.checkRow} accessibilityLabel="Agree to terms">
        <View style={[styles.checkbox, agree ? { borderColor: colors.primary, backgroundColor: 'rgba(11,107,31,0.28)' } : null]}>
          {agree ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
        </View>
        <Text style={styles.checkText}>
          I agree to the <Text style={{ color: colors.primary, fontWeight: '800' }}>Terms & Privacy Policy</Text>
        </Text>
      </Pressable>

      <View style={{ height: 18 }} />

      <PrimaryButton title={loading ? 'Signing up...' : 'Sign up'} disabled={loading || !name || !email || !password || !confirm || !agree} onPress={handleSignUp} />

      <View style={{ flex: 1 }} />

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Already have an account?</Text>
        <Pressable onPress={() => navigation.replace('Login')}>
          <Text style={styles.link}>Login</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  brand: { color: colors.text, fontSize: 26, fontWeight: '800', marginTop: 10 },
  headline: { color: colors.text, fontSize: 22, fontWeight: '800', marginTop: 18 },
  sub: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 8 },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { width: 44, height: 48, alignItems: 'center', justifyContent: 'center' },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  checkbox: { width: 24, height: 24, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center' },
  checkText: { color: colors.text, fontSize: 15, marginLeft: 10, flexShrink: 1 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 6 },
  bottomText: { color: colors.muted, fontSize: 15 },
  link: { color: colors.primary, fontSize: 16, fontWeight: '800', textDecorationLine: 'underline' },
});

