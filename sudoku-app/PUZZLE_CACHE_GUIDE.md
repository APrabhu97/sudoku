# Puzzle Cache System

## Overview
The puzzle cache system pre-generates and stores Sudoku puzzles for instant delivery, eliminating generation delays and providing a seamless user experience.

## Features
- **Instant puzzle delivery**: Puzzles are served from cache immediately
- **Background refill**: Cache automatically refills after each puzzle is retrieved
- **3 puzzles per difficulty**: Maintains 3 pre-generated puzzles for each difficulty level
- **Guaranteed uniqueness**: All cached puzzles have a unique solution
- **Automatic initialization**: Cache is initialized on app startup

## Architecture

### Key Components
1. **`puzzleCache.ts`**: Core caching service using AsyncStorage
2. **`usePuzzleCache.ts`**: React hook for easy integration
3. **`SplashScreen.tsx`**: Initializes cache on app startup

### Cache Flow
```
App Startup → initializePuzzleCache() → Pre-generate 12 puzzles (3 × 4 difficulties)
↓
User requests puzzle → getCachedPuzzle() → Returns cached puzzle instantly
↓
Cache updated → Remove used puzzle → Trigger background refill
↓
Background refill → Generate new puzzle → Cache maintained at 3 puzzles
```

## Usage

### Basic Usage in a Component
```tsx
import React from 'react';
import { Button, View, Text } from 'react-native';
import { usePuzzleCache } from '../hooks/usePuzzleCache';

function PuzzleSelector() {
  const { getPuzzle, loading, error } = usePuzzleCache();
  const [puzzle, setPuzzle] = React.useState<number[][] | null>(null);

  const handleNewGame = async (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
    const newPuzzle = await getPuzzle(difficulty);
    if (newPuzzle) {
      setPuzzle(newPuzzle);
      // Start game with newPuzzle
    }
  };

  return (
    <View>
      <Button title="Easy Game" onPress={() => handleNewGame('easy')} />
      <Button title="Medium Game" onPress={() => handleNewGame('medium')} />
      <Button title="Hard Game" onPress={() => handleNewGame('hard')} />
      <Button title="Expert Game" onPress={() => handleNewGame('expert')} />
      {loading && <Text>Loading puzzle...</Text>}
      {error && <Text>Error: {error.message}</Text>}
    </View>
  );
}
```

### Direct Cache Access
```tsx
import { getCachedPuzzle } from '../services/gameEngine/puzzleCache';

// Get a puzzle directly
const puzzle = await getCachedPuzzle('medium');
```

### Cache Management

#### Initialize Cache (done automatically on app startup)
```tsx
import { initializePuzzleCache } from '../services/gameEngine/puzzleCache';

await initializePuzzleCache();
```

#### Clear Cache (for testing or troubleshooting)
```tsx
import { clearPuzzleCache } from '../services/gameEngine/puzzleCache';

await clearPuzzleCache();
```

#### Monitor Cache Statistics
```tsx
import { getCacheStats } from '../services/gameEngine/puzzleCache';

const stats = await getCacheStats();
console.log(stats);
// { easy: 3, medium: 3, hard: 2, expert: 3 }
```

## Performance Benefits

### Before Caching
- Generation time: 100-500ms per puzzle
- User waits every time
- Noticeable delay on slower devices

### After Caching
- Delivery time: <10ms (instant)
- No user wait time
- Consistent experience across all devices
- Background refill ensures cache is always ready

## Implementation Details

### Storage Structure
```json
{
  "sudoku_puzzle_cache_easy": [
    {
      "puzzle": [[...], [...], ...],
      "timestamp": 1701878400000
    },
    {
      "puzzle": [[...], [...], ...],
      "timestamp": 1701878401000
    },
    {
      "puzzle": [[...], [...], ...],
      "timestamp": 1701878402000
    }
  ]
}
```

### Cache Keys
- `sudoku_puzzle_cache_easy`
- `sudoku_puzzle_cache_medium`
- `sudoku_puzzle_cache_hard`
- `sudoku_puzzle_cache_expert`

### Refill Strategy
- Triggered automatically after puzzle retrieval
- Non-blocking (doesn't slow down puzzle delivery)
- Maintains exactly 3 puzzles per difficulty
- Error handling ensures cache continues to work even if refill fails

## Testing

Run the cache tests:
```bash
npx jest __tests__/services/puzzleCache.test.ts
```

Test coverage includes:
- Cache hits and misses
- Background refill
- Error handling
- Cache initialization
- Cache clearing
- Statistics retrieval

## Advanced Usage

### Pre-warm specific difficulty
```tsx
import { getCachedPuzzle } from '../services/gameEngine/puzzleCache';

// Pre-fetch puzzles for a specific difficulty
await Promise.all([
  getCachedPuzzle('hard'),
  getCachedPuzzle('hard'),
  getCachedPuzzle('hard'),
]);
```

### Monitor cache health
```tsx
import { getCacheStats } from '../services/gameEngine/puzzleCache';

setInterval(async () => {
  const stats = await getCacheStats();
  console.log('Cache health:', stats);
  
  // Alert if any difficulty is low
  Object.entries(stats).forEach(([difficulty, count]) => {
    if (count < 2) {
      console.warn(`Low cache for ${difficulty}: ${count} puzzles`);
    }
  });
}, 60000); // Check every minute
```

## Best Practices

1. **Always initialize on app startup**: Call `initializePuzzleCache()` in your splash screen or app root
2. **Use the hook in components**: `usePuzzleCache()` provides loading states and error handling
3. **Don't block on refill**: Let background refill happen asynchronously
4. **Monitor cache in development**: Use `getCacheStats()` to ensure cache is working
5. **Handle errors gracefully**: The system falls back to direct generation if cache fails

## Troubleshooting

### Cache not filling
- Check AsyncStorage permissions
- Verify `initializePuzzleCache()` is called
- Check console for errors

### Puzzles not instant
- Verify cache is initialized before first puzzle request
- Check cache stats to ensure puzzles are cached
- Ensure background refill isn't blocked by errors

### Storage quota issues
- Each puzzle is ~1KB
- 12 cached puzzles = ~12KB total
- AsyncStorage typically has 6-10MB limit
- No quota concerns expected
