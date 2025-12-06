# Sudoku Game App - Quick Reference Guide

## Project Overview at a Glance

**App**: Cross-platform Sudoku game (iOS + Android via React Native)
**Backend**: Firebase (Realtime DB + Cloud Functions)
**Auth**: Auto-login via App Store ID
**Target**: Both app stores, completely free
**Timeline**: 10 weeks to full MVP launch

---

## Core Features Checklist

### ✅ Single Player Mode
- [x] 4 difficulty levels (Easy, Medium, Hard, Expert)
- [x] Game options: Timer, Hints, Show Mistakes
- [x] Pause button
- [x] Statistics tracking
- [x] Full offline support
- [x] Dark mode

### ✅ Multiplayer Competitive Mode
- [x] Race to completion (first wins)
- [x] 3 matchmaking options: Random, Friends, Invite Code
- [x] Real-time sync with offline resilience
- [x] 30-second disconnect tolerance
- [x] Local timer authority (no cheating)
- [x] Win/loss based on local completion time

### ✅ Game Modes (Extensible)
1. Classic Sudoku (9×9)
2. Speed Mode (3-5 min timer, pre-filled)
3. Daily Challenge (same puzzle for all users)

### ✅ Social System
- [x] Friend requests & management
- [x] View opponent stats & head-to-head record
- [x] Match history (last 50 games)
- [x] Global leaderboard (all-time)
- [x] Weekly leaderboard
- [x] Friends leaderboard
- [x] Per-gamemode leaderboards

### ✅ User System
- [x] Auto-login (no manual auth)
- [x] Profiles with stats
- [x] Customizable display name
- [x] Win/loss tracking (overall + per mode)
- [x] Best time records
- [x] Achievements/badges
- [x] Settings (dark mode, notifications)

### ✅ Notifications
- [x] Friend request received
- [x] Invited to play
- [x] Match found in queue
- [x] Game result notification

---

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│        React Native UI Layer                │
│  (Screens, Components, Navigation)          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   Game Engine & State Management            │
│  (Sudoku logic, Zustand store, Timers)      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   Services Layer (Offline-First)            │
│  (Sync, Auth, Notifications, Analytics)     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   Local Storage (AsyncStorage)              │
│  (Game state, User profile, History)        │
└─────────────────────────────────────────────┘
                    ↓
        [Network Connection Check]
                    ↓
┌─────────────────────────────────────────────┐
│  Firebase Backend (us-east)                 │
│  (RTDB, Cloud Functions, Auth, FCM)         │
└─────────────────────────────────────────────┘
```

---

## Timer Sync Strategy (Critical for Fairness)

### Local Timer (Authority)
- Each device runs its own timer locally
- Timer continues even when offline
- User can't manipulate local timer (server validates)
- Example: Player A completes in 2:34, Player B in 3:10

### On Reconnection (30-second tolerance)
```
1. Player goes offline → Local timer runs
2. Player reconnects → Compare local elapsed time with server
3. Time drift > 30 seconds? → Use maximum elapsed time (prevents cheating)
4. Time drift < 30 seconds? → Accept local time as valid
5. Winner: First to complete (by local time, server-validated)
```

### Win/Loss Allocation
```
Player A (local time: 2:34, completed)
Player B (local time: 3:10, completed)
→ Player A wins (completed first)

Player A (local time: 5:00, ongoing, then disconnects for 35 seconds)
Player B (local time: 4:50, still playing, connected)
→ If A doesn't reconnect within 30 sec, A forfeits, B wins
→ If A reconnects at 45 sec, both continue (A's time is now 5:45)
```

---

## Game Mode Extension Pattern

### Adding a New Game Mode

```typescript
// src/services/gameEngine/modes/newMode.ts
export const newMode: GameMode = {
  id: 'new-mode',
  name: 'New Mode Name',
  description: 'Description',
  supported: 'both', // 'single' | 'multiplayer' | 'both'
  boardSize: 9,
  boardValidator: (board) => {
    // Custom validation logic
    return isValid;
  },
  boardGenerator: (difficulty) => {
    // Generate board based on difficulty
    return generatedBoard;
  },
  rulesDescription: 'How to play this mode',
};

// Register in: src/services/gameEngine/modes/index.ts
export const GAME_MODES = {
  CLASSIC: classicMode,
  SPEED: speedMode,
  DAILY: dailyMode,
  NEW_MODE: newMode,  // Add here
};
```

Future modes ready to implement:
- Mini Sudoku (4×4)
- Irregular Sudoku (6×6)
- Diagonal Sudoku
- Jigsaw Sudoku

---

## Key Technical Decisions

| Decision | Why | Trade-offs |
|----------|-----|-----------|
| React Native + Expo | Cross-platform, faster dev, JS | Less native control, slightly heavier app |
| Firebase Realtime DB | Real-time, free tier, auto-scaling | Vendor lock-in, limited query options |
| Zustand over Redux | Simpler, smaller bundle | Less ecosystem |
| AsyncStorage for offline | Proven, built-in to RN | Limited to ~10MB on some devices |
| App Store ID auth | Frictionless user request | App Store/Play dependency for auth |
| Local timer authority | Trust device clocks (server validates) | Requires backend validation logic |

---

## Data Privacy Compliance

### ✅ What We Store
- App Store ID (for account linking)
- Display name
- Game statistics (wins, losses, times)
- Friend relationships
- Game history (anonymized)
- User preferences (theme, notifications)

### ❌ What We Don't Store
- Location data
- PII beyond display name
- Detailed move-by-move data
- Personal identifiers
- Payment information (free app)

### Compliance
- **GDPR**: Users can delete account (deletes all data)
- **CCPA**: Privacy policy lists all data collected
- **App Store**: No IDFA tracking (no ads)
- **Google Play**: Transparent data collection

---

## Firebase Configuration (us-east)

### Realtime Database Rules
```javascript
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "friends": {".read": true}  // Can view friend lists
      }
    },
    "games": {
      "$gameId": {
        ".read": "root.child('games').child($gameId).child('players').child(auth.uid).exists()",
        ".write": "root.child('games').child($gameId).child('players').child(auth.uid).exists()"
      }
    },
    "leaderboards": {
      ".read": true  // Public
    },
    "gameResults": {
      ".read": true,
      ".write": "root.child('functions').validate(data)"
    }
  }
}
```

### Cloud Functions
1. `validateGameCompletion(gameId, userId, solution)` → boolean
2. `recordGameResult(gameId, results)` → void
3. `findMatchInQueue(userId, difficulty)` → gameId
4. `generateDailyChallenge()` → runs at 00:00 UTC
5. `updateLeaderboards()` → runs hourly

---

## Project File Structure

```
sudoku-app/
├── src/
│   ├── screens/          # All UI screens
│   ├── components/       # Reusable components
│   ├── services/         # Business logic (firebase, sync, gameEngine)
│   ├── store/            # State management (Zustand)
│   ├── styles/           # Themes, colors, spacing
│   ├── utils/            # Helpers, validators
│   ├── types/            # TypeScript interfaces
│   └── constants/        # App constants
├── firebase/
│   └── functions/        # Cloud Functions
├── __tests__/            # Unit & integration tests
├── docs/                 # Documentation
└── config/               # Configuration files
```

**Key Services to Build:**
- `src/services/gameEngine/` - Sudoku logic
- `src/services/firebase/` - Backend integration
- `src/services/sync/` - Offline sync & conflict resolution
- `src/services/notifications/` - Push notifications
- `src/services/auth/` - App Store ID auth

---

## Deployment Checklist

### Firebase (Week 1)
- [ ] Create Firebase project (us-east)
- [ ] Set up Realtime Database
- [ ] Deploy Cloud Functions
- [ ] Configure security rules
- [ ] Enable FCM for push notifications

### App Store (Week 9-10)
- [ ] Create developer account
- [ ] Generate certificates & provisioning profiles
- [ ] Build iOS app (ipa)
- [ ] Prepare screenshots & descriptions
- [ ] Submit for review (~3-5 days)

### Google Play (Week 9-10)
- [ ] Create developer account
- [ ] Create app signing key
- [ ] Build Android app (aab)
- [ ] Prepare screenshots & descriptions
- [ ] Submit for review (~24 hours typically)

---

## Success Metrics

### Technical
- ✅ App startup: < 2 seconds
- ✅ Game load: < 500ms
- ✅ Sync latency: < 1 second
- ✅ Crash rate: < 0.1%

### User Experience
- ✅ Intuitive UI
- ✅ Smooth animations
- ✅ Clear feedback
- ✅ Accessible menus

### Business
- ✅ Both app stores approved
- ✅ All features working
- ✅ No critical bugs
- ✅ Ready for beta testers

---

## Common Questions

**Q: Can users cheat with the local timer?**
A: Server validates completion times (must be within ±30s of reasonable bounds). Completing in 1 second would be rejected.

**Q: What if both players disconnect?**
A: Game stays open for 30 seconds. If neither reconnects, both get a loss. If one reconnects first, they can continue.

**Q: Can we add new game modes later?**
A: Yes! The architecture uses a game mode registry. New modes just need to implement the GameMode interface.

**Q: Will this work on old devices?**
A: We'll target iOS 13+ and Android 8+, covering ~95% of active devices.

**Q: How do we handle Firebase free tier limits?**
A: Set up billing alerts. For 10k users, we should stay well within free tier. Scale to paid if needed.

**Q: Can users play offline permanently?**
A: Single player yes, multiplayer requires internet. Single player games sync when back online.

---

## Quick Start Commands

```bash
# Initialize project
expo init sudoku-app --template

# Install dependencies
npm install

# Install Firebase
npm install firebase @react-native-firebase/app

# Start development
expo start

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

## Resources & Links

- **React Native Docs**: https://reactnative.dev/
- **Expo Docs**: https://docs.expo.dev/
- **Firebase Docs**: https://firebase.google.com/docs
- **React Navigation**: https://reactnavigation.org/
- **Zustand**: https://github.com/pmndrs/zustand
- **iOS App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Google Play Store Policies**: https://play.google.com/about/developer-content-policy/

---

## Contact & Support

Have questions about the plan? Review the full technical spec (`TECH_SPEC.md`) or ask for clarification on specific areas.

**Next Step**: Initialize the React Native project! 🚀

