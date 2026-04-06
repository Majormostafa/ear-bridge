import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextInputField } from '../components/TextInputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { OutlineButton } from '../components/OutlineButton';
import { colors } from '../theme/colors';
import { useAuth } from '../state/auth';

export function LoginScreen({ navigation }) {
  const { signIn, booting } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    try {
      await signIn({ email, password });
      navigation.replace('Permissions');
    } catch (e) {
      Alert.alert('Sign in failed', e?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.brand}>Ear Bridge</Text>
      <Text style={styles.headline}>Welcome back</Text>
      <Text style={styles.sub}>
        Sign In To Continue Receiving Important Alerts And Stay Connected.
      </Text>

      <View style={{ height: 22 }} />

      <TextInputField
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={{ height: 12 }} />

      <View style={styles.passwordRow}>
        <View style={{ flex: 1 }}>
          <TextInputField
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!showPwd}
          />
        </View>
        <Pressable onPress={() => setShowPwd((v) => !v)} style={styles.eyeBtn} accessibilityLabel="Toggle password visibility">
          <Ionicons name={showPwd ? 'eye-off' : 'eye'} size={22} color={colors.muted} />
        </Pressable>
      </View>

      <Pressable onPress={() => Alert.alert('Forgot password', 'Front-end only demo: no password reset.')} style={styles.forgot}>
        <Text style={styles.forgotText}>Forgot Your Password?</Text>
      </Pressable>

      <View style={{ height: 18 }} />

      <PrimaryButton title={loading ? 'Signing In...' : 'Sign In'} disabled={loading || !email || !password} onPress={handleSignIn} />

      <View style={{ height: 26 }} />

      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>Or Continue With</Text>
        <View style={styles.orLine} />
      </View>

      <View style={styles.socialRow}>
        <SocialIcon label="G" onPress={() => Alert.alert('Coming soon', 'No backend auth configured.')} />
        <SocialIcon label="f" onPress={() => Alert.alert('Coming soon', 'No backend auth configured.')} />
        <SocialIcon
          label=""
          onPress={() => Alert.alert('Coming soon', 'No backend auth configured.')}
        />
      </View>

      <View style={{ flex: 1 }} />

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Don’t Have An Account?</Text>
        <Pressable onPress={() => navigation.replace('Signup')}>
          <Text style={styles.link}>Sign Up</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

function SocialIcon({ label, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.socialBtn} accessibilityLabel="Social auth">
      <Text style={styles.socialTxt}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  brand: { color: colors.text, fontSize: 26, fontWeight: '800', marginTop: 10 },
  headline: { color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 18 },
  sub: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 8 },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  eyeBtn: {
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgot: { alignSelf: 'flex-end', marginTop: 10 },
  forgotText: { color: colors.muted, fontSize: 14 },
  orRow: { flexDirection: 'row', alignItems: 'center' },
  orLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.18)' },
  orText: { color: colors.muted, fontSize: 14, fontWeight: '600' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 8,
  },
  socialTxt: { color: colors.text, fontWeight: '800', fontSize: 18 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 6 },
  bottomText: { color: colors.muted, fontSize: 15 },
  link: { color: colors.primary, fontSize: 16, fontWeight: '800', textDecorationLine: 'underline' },
});

