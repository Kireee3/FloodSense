# 🌊 FloodSense

A flood monitoring and emergency response mobile app built with **Expo + React Native + TypeScript**.

---

## 📱 Screens

| Screen | Description |
|--------|-------------|
| **Home** | Live flood data, water level widget, weather stats, evacuation map preview, recent alerts |
| **Map** | Full evacuation routes map with distance/ETA, safe zone navigation |
| **Guide** | Safety guidelines — Before, During, After a Flood |
| **Emergency** | SOS 911 button + quick-dial emergency contacts |

---

## 🚀 Setup

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npx expo start

# 3. Scan the QR code with Expo Go
```

---

## 🗂️ Project Structure

```
FloodSense/
├── app/
│   ├── _layout.tsx              # Root layout (Stack navigator)
│   └── (tabs)/
│       ├── _layout.tsx          # Tab bar layout
│       ├── index.tsx            # 🏠 Home screen
│       ├── map.tsx              # 🗺️  Map screen
│       ├── guide.tsx            # 📖 Guide screen
│       └── emergency.tsx        # 📞 Emergency screen
├── components/
│   └── AppHeader.tsx            # Shared top header
├── constants/
│   ├── theme.ts                 # Colors, fonts, spacing, radius
│   └── data.ts                  # Mock data (flood, alerts, contacts)
├── app.json                     # Expo config
├── babel.config.js
├── tsconfig.json
└── package.json
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Navy | `#0D3B5E` |
| Teal Accent | `#2EC4B6` |
| Warning Orange | `#FF6B35` |
| Emergency Red | `#C0392B` |
| Safe Green | `#27AE60` |

---

## 🔧 Next Steps / Integrations

- [ ] **Real sensor API** — Replace mock `floodData` in `constants/data.ts` with a live API call
- [ ] **expo-maps / react-native-maps** — Replace mock map with real MapView
- [ ] **Push notifications** — Use `expo-notifications` for flood alerts
- [ ] **Geolocation** — Use `expo-location` for real user position
- [ ] **AsyncStorage** — Persist alerts and user preferences
- [ ] **Auth** — Add barangay resident login

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based navigation |
| `expo-linear-gradient` | Gradient backgrounds & buttons |
| `expo-blur` | Blur effects |
| `@expo/vector-icons` | Feather icon set |
| `react-native-safe-area-context` | Safe area insets |
| `react-native-screens` | Native screen optimization |
