// Expo Go limitation:
// `expo-notifications` push (remote) support is removed in some SDKs.
// To keep the app running in Expo Go, we avoid importing expo-notifications here.
//
// Front-end behavior:
// - Notifications permission toggle is stored locally
// - Alerts are shown in-app via `Alert` instead of OS notifications

export async function ensureNotificationPermission() {
  // We can’t reliably request OS notification permission from Expo Go here.
  return false;
}

export async function showImmediateNotification() {
  // No-op in Expo Go. In-app alerts are used instead.
}

