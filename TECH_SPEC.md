# Sudoku Game App - Technical Specification

## Project Overview
A cross-platform (iOS/Android) Sudoku game built with React Native, featuring single-player and competitive multiplayer modes with real-time synchronization, offline support, and social features.

---

## 1. Architecture Overview

### Tech Stack
- **Frontend**: React Native (Expo for easier deployment)
- **Backend**: Firebase (Realtime Database + Cloud Functions)
- **Authentication**: App Store ID (iOS) / Google Play ID (Android)
- **State Management**: Redux or Zustand
- **Local Storage**: AsyncStorage (device persistence)
- **Network Sync**: Custom sync engine with conflict resolution

### High-Level Architecture
```
┌─────────────────────────────────────────────────────┐
│             React Native App (iOS/Android)          │
│  ┌──────────────────────────────────────────────┐  │
│  │  UI Layer (Game Board, Menus, Profiles)      │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Game Engine (Sudoku logic, Timer, Sync)     │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Local Storage (AsyncStorage)                │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
           ↓ (Network Sync when online)
┌─────────────────────────────────────────────────────┐
│              Firebase Backend                       │
│  ┌──────────────────────────────────────────────┐  │
│  │  Realtime Database (Game State, Users)       │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Cloud Functions (Game Logic, Validation)    │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Authentication (App Store ID Mapping)       │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 2. Feature Breakdown

### 2.1 Single Player Mode
- **Difficulty Levels**: Easy, Medium, Hard, Expert
- **Game Options**:
  - Timer (on/off)
  - Hints (on/off, limited per game)
  - Show mistakes (on/off)
  - Pause allowed
- **Offline Support**: Full functionality without internet
- **Statistics**: Time taken, difficulty, completion date
- **Daily Challenge**: Same puzzle for all users globally

### 2.2 Competitive Multiplayer Mode
- **Game Modes**:
  1. Random Matchmaking (vs random player)
  2. Friend Challenge (invite specific friend)
  3. Invite Code (share code for quick join)
- **Game Rules**:
  - Both players receive identical board
  - Same difficulty level
  - Race to completion (first to finish wins)
  - No pausing allowed during competitive games
  - 30-second disconnect tolerance before forfeit
  - Win/loss allocated based on each player's local completion time
- **Network Handling**:
  - Local timer continues running offline
  - Timer sync on reconnection (30sec max drift tolerance)
  - Graceful degradation if connection drops

### 2.3 Game Modes (Extensible)
Current:
- Classic Sudoku (9×9)
- Speed Mode (fixed 3-5 min timer, simpler puzzles)
- Daily Challenge

Future-ready architecture for:
- Mini Sudoku (4×4)
- Irregular Sudoku
- Custom rule modes

### 2.4 User Profiles
**Stored Data**:
- App Store ID (iOS) / Google Play ID (Android)
- Display Name
- Avatar (optional)
- Total Wins/Losses (overall + per game mode)
- Best Times (per difficulty)
- Friends List
- Play History (last 50 games)
- Achievements/Badges
- Preferences (dark mode, notifications, etc.)

**Privacy & Compliance**:
- No storage of PII beyond name
- Follow Apple App Store & Google Play guidelines
- GDPR-compliant data retention (delete account option)
- Optional analytics (anonymous, non-PII)

### 2.5 Social Features
- **Friends System**:
  - Add by ID/username
  - View friend list with online status
  - Quick match with friends
- **Stats Display**:
  - View opponent's overall win/loss ratio
  - View head-to-head record with each player
  - Match history (date, mode, winner, time taken)
- **Notifications**:
  - Friend request received
  - Invited to play
  - Game results
  - Daily Challenge available

### 2.6 Leaderboards
- Global leaderboard (all-time)
- Weekly leaderboard
- Friends leaderboard
- Per-gamemode leaderboards

---

## 3. Database Schema (Firebase Realtime Database)

```
/users/{userId}/
  ├── appStoreId (string, unique)
  ├── displayName (string)
  ├── avatar (string, URL)
  ├── createdAt (timestamp)
  ├── lastActiveAt (timestamp)
  ├── settings/
  │   ├── darkMode (boolean)
  │   ├── notificationsEnabled (boolean)
  │   └── analyticsOptIn (boolean)
  ├── stats/
  │   ├── totalWins (number)
  │   ├── totalLosses (number)
  │   ├── gameModesStats/
  │   │   ├── {gameModeId}/
  │   │   │   ├── wins (number)
  │   │   │   ├── losses (number)
  │   │   │   └── bestTime (number)
  │   └── difficultyStats/
  │       ├── easy/wins, losses, bestTime
  │       ├── medium/wins, losses, bestTime
  │       ├── hard/wins, losses, bestTime
  │       └── expert/wins, losses, bestTime
  ├── friends/
  │   └── {friendId}: true
  └── blockedUsers/
      └── {blockedUserId}: true

/games/{gameId}/
  ├── mode (string: 'single', 'multiplayer')
  ├── gameType (string: 'classic', 'speed', 'daily')
  ├── difficulty (string)
  ├── initialBoard (string, serialized)
  ├── players/
  │   ├── {playerId}/
  │   │   ├── currentBoard (string, serialized)
  │   │   ├── startTime (timestamp)
  │   │   ├── completionTime (timestamp, nullable)
  │   │   ├── localStartTime (number, ms)
  │   │   ├── localCompletionTime (number, ms)
  │   │   ├── status (string: 'playing', 'completed', 'forfeit', 'paused')
  │   │   ├── hintsUsed (number)
  │   │   └── lastHeartbeat (timestamp)
  ├── createdAt (timestamp)
  ├── status (string: 'active', 'completed', 'abandoned')
  └── winner (string, userId of winner, nullable)

/gameResults/{resultId}/
  ├── gameId (string, reference)
  ├── player1Id (string)
  ├── player2Id (string, nullable for single-player)
  ├── winnerId (string)
  ├── completionTimes/
  │   ├── player1 (number, ms)
  │   └── player2 (number, ms, nullable)
  ├── gameType (string)
  ├── difficulty (string)
  ├── createdAt (timestamp)
  └── resultsValidated (boolean)

/dailyChallenge/{date}/
  ├── board (string, serialized)
  ├── difficulty (string)
  ├── createdAt (timestamp)
  └── leaderboard/
      └── {userId}: {completionTime: number, timestamp: number}

/friendRequests/{requestId}/
  ├── fromUserId (string)
  ├── toUserId (string)
  ├── status (string: 'pending', 'accepted', 'rejected')
  └── createdAt (timestamp)

/matchmakingQueue/{queueId}/
  ├── userId (string)
  ├── gameType (string)
  ├── difficulty (string)
  ├── joinedAt (timestamp)
  └── status (string: 'waiting', 'matched')

/leaderboards/{period}/{type}/
  └── {rank}/
      ├── userId (string)
      ├── displayName (string)
      ├── score (number, based on wins)
      └── lastUpdated (timestamp)
```

---

## 4. Authentication Flow

### Auto-Login (No Manual Auth)
1. **App Launch**:
   - Check if App Store ID cached locally
   - If not cached, request from App Store (iOS) / Google Play (Android)
   - Store securely in keychain/credentials storage

2. **User Identification**:
   - Map App Store ID → Firebase User ID (custom claims)
   - Use Firebase Anonymous Auth with custom token mapping
   - Or use Firebase Custom Authentication with cloud function validation

3. **Profile Creation**:
   - Auto-create user profile on first launch
   - Generate display name from app store data if available
   - Allow user to customize display name in settings

### Implementation Details
- **iOS**: Use `StoreKit` to validate receipt and get App Store ID
- **Android**: Use `Google Play Billing Library` for device ID
- **Firebase**: Cloud function validates device ID and returns custom auth token

---

## 5. Offline-First Architecture

### Single Player Offline Support
- **Complete offline functionality**: All single-player games work fully offline
- **Local state management**: Store game progress in AsyncStorage
- **Sync on reconnect**: Upload completed games when back online

### Multiplayer Network Resilience
- **Local timer authority**: Each device maintains its own timer
- **Conflict resolution**: 
  - If time drift > 30 seconds on reconnect, use server timestamp
  - Each player's completion time is their local time
  - Server validates completion within reasonable bounds
- **Graceful degradation**:
  - Continue game if opponent offline (30-sec timeout)
  - Auto-forfeit after 30 seconds of no communication
  - Notify both players of connection status

### Local Storage Structure
```
AsyncStorage Schema:
├── @sudoku/userProfile
├── @sudoku/currentGame
├── @sudoku/gameHistory (last 50 games)
├── @sudoku/friends
├── @sudoku/settings
├── @sudoku/syncQueue (pending uploads)
└── @sudoku/dailyChallenge
```

---

## 6. Synchronization Strategy

### Real-Time Sync (Online)
- Firebase Realtime Database listeners on active game state
- WebSocket-based real-time updates
- Debounced sync (batch updates every 500-1000ms)

### Conflict Resolution
```
Scenario: Player A completes locally, goes offline, then reconnects

1. Local completion → LocalStorage updated
2. Offline period detected
3. Reconnection → Try to sync
4. If server state differs:
   - Check timestamp validity (within 5 min of current time)
   - Use maximum elapsed time (penalizes connection drops)
   - Award win to first completer (by server-validated time)
5. Sync complete → UI updates with result
```

### Heartbeat & Presence
- Heartbeat sent every 5 seconds during active game
- 30-second timeout before considering player disconnected
- Graceful reconnection within timeout window

---

## 7. Game Modes Architecture (Extensible)

### Game Mode Interface
```typescript
interface GameMode {
  id: string;
  name: string;
  description: string;
  supported: 'single' | 'multiplayer' | 'both';
  boardSize: number; // 9, 4, 16, etc.
  boardValidator: (board: number[][]) => boolean;
  boardGenerator: (difficulty: string) => number[][];
  rulesDescription: string;
}
```

### Current Implementations
1. **Classic Sudoku**: 9×9 grid, standard rules
2. **Speed Mode**: 9×9, fixed 3-5 min timer, pre-filled board
3. **Daily Challenge**: 9×9, same board for all users daily

### Easy to Add Future Modes
- Mini Sudoku (4×4)
- Irregular Sudoku (6×6 with irregular shapes)
- Diagonal Sudoku (9×9 + diagonal uniqueness)

---

## 8. Leaderboard System

### Types
1. **Global All-Time**: Ranked by total wins
2. **Weekly**: Reset every Monday UTC
3. **Friends**: Only friends visible
4. **Per-GameMode**: Leaderboard per mode
5. **Daily Challenge**: Today's daily challenge rankings

### Ranking Algorithm
```
Score = (Wins × 10) + (Top10_Finishes × 5) + (BestTime_Bonus × 1)
Top10_Finishes = count of daily challenges in top 10
BestTime_Bonus = based on speed records
```

---

## 9. Push Notifications

### Types & Triggers
1. **Friend Request**: When someone adds you
2. **Game Invite**: When invited to play
3. **Match Found**: In matchmaking queue
4. **Game Result**: When opponent completes
5. **Daily Challenge**: New daily challenge available (optional)

### Implementation
- Firebase Cloud Messaging (FCM)
- OneSignal (optional for better analytics)

---

## 10. Data Privacy & Compliance

### Stored Data
- ✅ App Store ID (linked to user account)
- ✅ Display Name
- ✅ Game statistics (wins/losses, times)
- ✅ Friend relationships
- ✅ Game history (anonymized move data)
- ❌ No PII beyond name
- ❌ No location data
- ❌ No detailed analytics without opt-in

### Compliance
- **GDPR**: User can delete account (delete user + all associated data)
- **CCPA**: Privacy policy listing data collected
- **Apple App Store**: No storing IDFA if not used for ads
- **Google Play**: No tracking data beyond app analytics

### Data Retention
- Active user: Keep indefinitely (or per user preference)
- Inactive user (1+ year): Consider archival/deletion

---

## 11. Analytics (Privacy-First)

### Tracked Events (Anonymous, No PII)
- Game started (mode, difficulty)
- Game completed (time taken, result)
- User created
- Feature usage (leaderboard views, etc.)

### Not Tracked
- User name
- User ID (use anonymous session ID)
- Exact completion times
- Opponent identity
- Location data

### Tools
- Firebase Analytics (default, privacy-focused)
- Or Amplitude/Mixpanel (self-hosted if needed)

---

## 12. Project Structure

```
sudoku-app/
├── .env.example
├── app.json (Expo config)
├── package.json
├── tsconfig.json
├── 
├── src/
│   ├── index.tsx (entry point)
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── types.ts
│   │   └── stacks/
│   │       ├── HomeStack.tsx
│   │       ├── GameStack.tsx
│   │       └── ProfileStack.tsx
│   │
│   ├── screens/
│   │   ├── Home/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── SinglePlayerMenu.tsx
│   │   │   └── MultiplayerMenu.tsx
│   │   ├── Game/
│   │   │   ├── GameScreen.tsx
│   │   │   ├── GameBoard.tsx
│   │   │   └── GameControls.tsx
│   │   ├── Matchmaking/
│   │   │   └── MatchmakingScreen.tsx
│   │   ├── Profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── StatsScreen.tsx
│   │   │   ├── FriendsScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── Leaderboards/
│   │   │   └── LeaderboardScreen.tsx
│   │   └── Auth/
│   │       └── SplashScreen.tsx
│   │
│   ├── components/
│   │   ├── GameBoard/
│   │   │   ├── Cell.tsx
│   │   │   ├── Grid.tsx
│   │   │   └── styles.ts
│   │   ├── Common/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Loading.tsx
│   │   ├── Leaderboard/
│   │   │   └── LeaderboardEntry.tsx
│   │   └── Profile/
│   │       ├── StatCard.tsx
│   │       └── MatchHistoryItem.tsx
│   │
│   ├── services/
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   ├── database.ts
│   │   │   ├── functions.ts
│   │   │   └── realtime.ts
│   │   ├── gameEngine/
│   │   │   ├── sudokuGenerator.ts
│   │   │   ├── sudokuValidator.ts
│   │   │   ├── gameState.ts
│   │   │   └── modes/
│   │   │       ├── index.ts (mode registry)
│   │   │       ├── classic.ts
│   │   │       ├── speed.ts
│   │   │       └── daily.ts
│   │   ├── sync/
│   │   │   ├── syncManager.ts
│   │   │   ├── conflictResolver.ts
│   │   │   ├── localStorage.ts
│   │   │   └── timer.ts
│   │   ├── notifications/
│   │   │   ├── pushNotifications.ts
│   │   │   └── localNotifications.ts
│   │   ├── auth/
│   │   │   ├── appStoreAuth.ts
│   │   │   └── deviceIdentifier.ts
│   │   └── analytics/
│   │       └── analyticsService.ts
│   │
│   ├── store/ (Redux/Zustand)
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── userSlice.ts
│   │   │   ├── gameSlice.ts
│   │   │   ├── friendsSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── hooks/
│   │       └── useAppDispatch.ts
│   │
│   ├── styles/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── themes/
│   │       ├── light.ts
│   │       └── dark.ts
│   │
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   ├── timing.ts
│   │   └── errors.ts
│   │
│   ├── constants/
│   │   ├── gameConstants.ts
│   │   ├── apiEndpoints.ts
│   │   └── config.ts
│   │
│   └── types/
│       ├── game.ts
│       ├── user.ts
│       ├── api.ts
│       └── index.ts
│
├── firebase/
│   └── functions/
│       ├── index.ts
│       ├── gameValidation.ts
│       ├── matchmaking.ts
│       ├── leaderboards.ts
│       └── notifications.ts
│
├── __tests__/
│   ├── services/
│   │   ├── gameEngine.test.ts
│   │   └── sync.test.ts
│   ├── utils/
│   │   └── validation.test.ts
│   └── integration/
│       └── multiplayer.test.ts
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   ├── API.md
│   ├── GAME_MODES.md
│   └── DEPLOYMENT.md
│
└── config/
    ├── firebase.config.js
    ├── app.config.js
    └── eas.json (Expo Application Services)
```

---

## 13. Development Phases

### Phase 1: Foundation (Weeks 1-3)
- [x] Project setup (React Native, Firebase)
- [x] Authentication (App Store ID mapping)
- [x] Basic game board UI
- [x] Sudoku generator & validator
- [x] Single-player game flow
- [x] Local storage setup

### Phase 2: Single Player Polish (Weeks 3-4)
- [ ] Difficulty levels implementation
- [ ] Game options (timer, hints, mistakes)
- [ ] Statistics tracking
- [ ] Dark mode
- [ ] Settings screen

### Phase 3: Multiplayer Foundation (Weeks 5-6)
- [ ] Firebase real-time sync
- [ ] Matchmaking system
- [ ] Friend system
- [ ] Game invitation flow
- [ ] Basic multiplayer game

### Phase 4: Multiplayer Polish (Weeks 6-7)
- [ ] Offline resilience
- [ ] Timer sync logic
- [ ] Disconnect handling
- [ ] Connection recovery

### Phase 5: Social & Leaderboards (Weeks 7-8)
- [ ] Leaderboards (global, weekly, friends)
- [ ] Match history
- [ ] Win/loss tracking
- [ ] Achievements/badges
- [ ] Player profiles

### Phase 6: Polish & Optimization (Weeks 8-9)
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] UI/UX improvements
- [ ] Comprehensive testing

### Phase 7: Deployment (Week 9-10)
- [ ] iOS build & App Store submission
- [ ] Android build & Google Play submission
- [ ] Beta testing
- [ ] Launch coordination

---

## 14. Deployment Checklist

### Pre-Launch
- [ ] Firebase project set up (us-east region)
- [ ] Cloud functions deployed
- [ ] Database security rules configured
- [ ] Analytics enabled
- [ ] Push notifications configured
- [ ] App Store developer account (iOS)
- [ ] Google Play developer account (Android)

### Build & Release
- [ ] Code signing (iOS certificates)
- [ ] Keystore configured (Android)
- [ ] App Store build (ipa)
- [ ] Google Play build (aab)
- [ ] Privacy policy & ToS finalized
- [ ] Screenshots & descriptions prepared
- [ ] Testing on real devices

### Post-Launch
- [ ] Monitor crash logs (Firebase Crashlytics)
- [ ] Monitor analytics
- [ ] Respond to user reviews
- [ ] Track real-time issues
- [ ] Plan Phase 2 features

---

## 15. Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | React Native (Expo) | Cross-platform, JS, faster dev |
| Backend | Firebase | Real-time, auto-scaling, free tier sufficient |
| Auth | App Store ID | Frictionless login, user request |
| Offline | AsyncStorage + Sync Queue | Proven, reliable, good UX |
| Timer Sync | Local authority + server validation | Prevents cheating, handles connectivity |
| State Management | Zustand (smaller) or Redux | Clear architecture, side effects |
| Push Notifications | Firebase Cloud Messaging | Free, reliable, integrated |
| Testing | Jest + React Native Testing Library | Standard, good coverage |

---

## 16. Known Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| Timer manipulation (local timer) | Server validates completion times within bounds (±30s) |
| Matchmaking fairness | Random queue + difficulty selection matching |
| Firebase costs exceeding free tier | Monitor usage, set budget alerts |
| Real-time sync conflicts | Conflict resolver with clear rules |
| App Store rejection | Follow guidelines early, private beta testing |
| User data privacy | GDPR-compliant deletion, minimal PII storage |

---

## Next Steps
1. Set up Firebase project (us-east region)
2. Initialize React Native project with Expo
3. Create data models & types
4. Implement authentication
5. Build game engine & board UI
6. Develop sync system
7. Integrate Firebase services
8. Build UI screens
9. Comprehensive testing
10. Deploy to both app stores

