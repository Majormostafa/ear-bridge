import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { TextInputField } from '../components/TextInputField';
import { PrimaryButton } from '../components/PrimaryButton';
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
    <ScreenWrapper>
      <View style={styles.layout}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.brand}>Ear Bridge</Text>
          <Text style={styles.headline}>Welcome back</Text>
          <Text style={styles.sub}>
            Sign In To Continue Receiving Important Alerts And Stay Connected.
          </Text>

          <View style={styles.spacerMd} />

          <TextInputField
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.spacerSm} />

          <View style={styles.passwordRow}>
            <View style={styles.flex1}>
              <TextInputField
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!showPwd}
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

          <Pressable
            onPress={() => Alert.alert('Forgot password', 'Front-end only demo: no password reset.')}
            style={styles.forgot}
          >
            <Text style={styles.forgotText}>Forgot Your Password?</Text>
          </Pressable>

          <View style={styles.spacerLg} />

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>Or Continue With</Text>
            <View style={styles.orLine} />
          </View>

          <View style={styles.socialRow}>
            <SocialIcon label="G" onPress={() => Alert.alert('Coming soon', 'No backend auth configured.')} />
            <SocialIcon label="f" onPress={() => Alert.alert('Coming soon', 'No backend auth configured.')} />
            <SocialIcon label="" onPress={() => Alert.alert('Coming soon', 'No backend auth configured.')} />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton title={loading ? 'Signing In...' : 'Sign In'} disabled={loading || !email || !password} onPress={handleSignIn} />
          <View style={styles.spacerMd} />
          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Don’t Have An Account?</Text>
            <Pressable onPress={() => navigation.replace('Signup')}>
              <Text style={styles.link}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
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
  layout: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 12,
  },
  flex1: { flex: 1 },
  spacerSm: { height: 12 },
  spacerMd: { height: 22 },
  spacerLg: { height: 18 },
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
    fontWeight: '700',
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
  eyeBtn: {
    minWidth: 44,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgot: { alignSelf: 'center', marginTop: 10 },
  forgotText: { color: colors.muted, fontSize: 14 },
  orRow: { flexDirection: 'row', alignItems: 'center' },
  orLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.18)' },
  orText: { color: colors.muted, fontSize: 14, fontWeight: '600', paddingHorizontal: 10 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  socialBtn: {
    aspectRatio: 1,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 8,
  },
  socialTxt: { color: colors.text, fontWeight: '800', fontSize: 18 },
  footer: {
    width: '100%',
    paddingBottom: 6,
  },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
  bottomText: { color: colors.muted, fontSize: 15 },
  link: { color: colors.primary, fontSize: 16, fontWeight: '800', textDecorationLine: 'underline', marginLeft: 6 },
});
