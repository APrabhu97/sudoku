# 🧪 Testing Guide - Sudoku Game App

## Overview

This project includes comprehensive unit, integration, and example tests to ensure reliability and catch regressions early.

**Test Coverage Targets:**
- Game Engine: 100% (critical logic)
- State Management: 90%+
- Services: 80%+
- Overall: 70%+ coverage threshold

---

## Test Suite Structure

```
__tests__/
├── setup.ts                  # Jest configuration & mocks
├── services/
│   └── gameEngine.test.ts    # Sudoku generator, validator tests
├── store/
│   ├── gameStore.test.ts     # Game state management tests
│   └── userStore.test.ts     # User profile state tests
└── integration/
    └── singlePlayerFlow.test.ts  # Full game flow tests
```

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test:watch
```

### Run Tests with Coverage Report
```bash
npm test:coverage
```

### Run Specific Test File
```bash
npm test gameEngine.test.ts
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="isValidMove"
```

---

## Test Coverage

### Game Engine Tests (`services/gameEngine.test.ts`)

**Sudoku Generator:**
- ✅ Generate valid puzzles for all difficulties
- ✅ Correct clue counts per difficulty
- ✅ Generate different puzzles on each call
- ✅ Validate board structure

**Move Validation (`isValidMove`):**
- ✅ Allow valid moves
- ✅ Reject duplicates in rows
- ✅ Reject duplicates in columns
- ✅ Reject duplicates in 3×3 boxes
- ✅ Reject invalid numbers (0, 10+)
- ✅ Allow valid moves across different boxes

**Board Validation (`isBoardValid`):**
- ✅ Validate complete valid boards
- ✅ Reject boards with row duplicates
- ✅ Reject boards with column duplicates
- ✅ Reject boards with box duplicates

**Completion Check (`isBoardComplete`):**
- ✅ Detect incomplete boards
- ✅ Detect complete boards

**Hint Generation (`generateHint`):**
- ✅ Generate hints for partially filled boards
- ✅ Return null when board is complete
- ✅ Return correct hint values

**Puzzle Solver (`solveSudoku`):**
- ✅ Solve valid puzzles
- ✅ Return complete boards
- ✅ Maintain original clues
- ✅ Don't modify input puzzle

### State Management Tests

**Game Store (`store/gameStore.test.ts`):**
- ✅ Initialize with null game
- ✅ Set current game
- ✅ Clear current game
- ✅ Update board state
- ✅ Update elapsed time
- ✅ Track hint usage
- ✅ Pause game
- ✅ Resume game

**User Store (`store/userStore.test.ts`):**
- ✅ Initialize with null user
- ✅ Set user profile
- ✅ Update display name
- ✅ Update settings (dark mode, notifications)
- ✅ Update statistics
- ✅ Clear user profile
- ✅ Manage friends list

### Integration Tests (`integration/singlePlayerFlow.test.ts`)

**Complete Game Flow:**
- ✅ Generate puzzle
- ✅ Create game state
- ✅ Play and solve
- ✅ Complete game
- ✅ Track completion time

**Game Control Flow:**
- ✅ Pause and resume game
- ✅ Hint system with limits
- ✅ Statistics tracking
- ✅ Time tracking

---

## Writing Tests

### Test Structure

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  it('should do something specific', () => {
    // Arrange: Set up test data
    const input = 'test';

    // Act: Call the function
    const result = myFunction(input);

    // Assert: Verify the result
    expect(result).toBe('expected');
  });
});
```

### Testing Async Code

```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Testing with Mocks

```typescript
jest.mock('../path/to/module', () => ({
  functionName: jest.fn(() => 'mocked value'),
}));

it('should use mocked function', () => {
  const result = myFunction();
  expect(mockedFunction).toHaveBeenCalled();
});
```

### Testing State Management

```typescript
it('should update state correctly', () => {
  const store = useGameStore();
  
  store.setCurrentGame(mockGame);
  expect(store.currentGame).toEqual(mockGame);
  
  store.pauseGame();
  expect(store.currentGame.status).toBe('paused');
});
```

---

## Test Best Practices

### ✅ Do's

1. **Test Behavior, Not Implementation**
   ```typescript
   // Good
   expect(isBoardComplete(board)).toBe(true);
   
   // Avoid
   expect(board.flat().every(cell => cell !== 0)).toBe(true);
   ```

2. **Use Descriptive Test Names**
   ```typescript
   // Good
   it('should reject duplicate numbers in the same row', () => {});
   
   // Avoid
   it('should validate', () => {});
   ```

3. **One Assertion Per Test (or Related)**
   ```typescript
   // Good
   it('should update board and time', () => {
     store.updateBoard(newBoard);
     store.updateTime(100);
     expect(store.currentGame?.board).toEqual(newBoard);
     expect(store.currentGame?.elapsedTime).toBe(100);
   });
   ```

4. **Test Edge Cases**
   ```typescript
   // Test boundary conditions
   expect(isValidMove(board, 0, 0, 1)).toBe(true);  // First cell
   expect(isValidMove(board, 8, 8, 9)).toBe(true);  // Last cell
   expect(isValidMove(board, 4, 4, 5)).toBe(true);  // Middle cell
   ```

5. **Mock External Dependencies**
   ```typescript
   jest.mock('firebase/app');
   jest.mock('@react-native-async-storage/async-storage');
   ```

### ❌ Don'ts

1. **Don't Test Implementation Details**
   - Avoid testing private methods
   - Focus on public API

2. **Don't Make Tests Too Complex**
   - Keep tests focused and simple
   - One concept per test

3. **Don't Depend on Test Order**
   - Each test should be independent
   - Use `beforeEach` for setup

4. **Don't Skip Error Cases**
   - Test both success and failure paths
   - Test boundary conditions

5. **Don't Test Third-Party Libraries**
   - Assume they work correctly
   - Test your integration with them

---

## Common Assertions

```typescript
// Basic
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).not.toBe(expected);

// Types
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// Numbers
expect(value).toBeGreaterThan(5);
expect(value).toBeLessThan(10);
expect(value).toBeCloseTo(3.14, 2);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain('item');
expect(array).toEqual([1, 2, 3]);

// Objects
expect(obj).toHaveProperty('name');
expect(obj).toHaveProperty('name', 'John');

// Functions
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith('arg');
expect(fn).toHaveBeenCalledTimes(2);

// Strings
expect(str).toMatch(/pattern/);
expect(str).toContain('substring');
expect(str).toHaveLength(5);
```

---

## Debugging Tests

### Run Single Test
```bash
npm test -- --testNamePattern="specific test name"
```

### Run Tests with Output
```bash
npm test -- --verbose
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

Then run Jest with debugger:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## Coverage Reporting

### View Coverage Report
```bash
npm test:coverage
```

### Coverage Thresholds
The project is configured with these minimums:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

If coverage falls below these, the test suite fails.

### Improve Coverage
1. Find uncovered files: `coverage/lcov-report/index.html`
2. Add tests for uncovered lines
3. Ensure error paths are tested

---

## Mocking Guide

### Mock Firebase
```typescript
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));
```

### Mock AsyncStorage
```typescript
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
```

### Mock Functions
```typescript
const mockFunction = jest.fn();
mockFunction.mockReturnValue('value');
mockFunction.mockResolvedValue('async value');
mockFunction.mockRejectedValue(new Error('error'));
```

---

## Test Examples

### Testing Game Logic
```typescript
describe('Game Completion', () => {
  it('should recognize when game is complete', () => {
    const solvedBoard = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      // ... rest of solved board
    ];
    
    expect(isBoardComplete(solvedBoard)).toBe(true);
  });
});
```

### Testing State Updates
```typescript
describe('Game State Updates', () => {
  it('should update multiple states correctly', () => {
    const store = useGameStore();
    const mockGame = createMockGame();
    
    store.setCurrentGame(mockGame);
    store.updateTime(100);
    store.useHint();
    
    expect(store.currentGame?.elapsedTime).toBe(100);
    expect(store.currentGame?.hintsUsed).toBe(1);
  });
});
```

### Testing Error Handling
```typescript
describe('Error Handling', () => {
  it('should handle invalid moves gracefully', () => {
    const emptyBoard = Array(9).fill(null).map(() => Array(9).fill(0));
    emptyBoard[0][0] = 5;
    
    expect(isValidMove(emptyBoard, 0, 1, 5)).toBe(false);
  });
});
```

---

## Continuous Integration

Tests should run automatically on:
- **Pre-commit**: `husky` (if configured)
- **Pull Request**: CI/CD pipeline (GitHub Actions, etc.)
- **Pre-deployment**: Automated test suite

### Example CI Configuration
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test:coverage
```

---

## Future Test Coverage

Tests to add in Phase 2+:

- [ ] Component rendering tests (GameBoard, Cell, etc.)
- [ ] Screen navigation tests
- [ ] Firebase integration tests
- [ ] Sync and conflict resolution tests
- [ ] Multiplayer game flow tests
- [ ] Performance and load tests
- [ ] E2E tests with Detox

---

## Troubleshooting

### Tests Fail with Module Not Found
```bash
# Clear Jest cache
npm test -- --clearCache
```

### AsyncStorage Mock Issues
Ensure mock is set up in `__tests__/setup.ts`:
```typescript
jest.mock('@react-native-async-storage/async-storage');
```

### Zustand Store Not Resetting
Make sure to reset state in `beforeEach`:
```typescript
beforeEach(() => {
  const store = useGameStore();
  store.setCurrentGame(null);
});
```

### Tests Timeout
Increase timeout for slow operations:
```typescript
it('should complete slowly', async () => {
  const result = await slowFunction();
  expect(result).toBeDefined();
}, 10000); // 10 second timeout
```

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Summary

This testing framework ensures:
✅ **Reliability**: Catch bugs before production  
✅ **Confidence**: Refactor with assurance  
✅ **Documentation**: Tests show how code should behave  
✅ **Quality**: Maintain high code standards  

**Current Test Count**: 30+ tests covering critical functionality  
**Target Coverage**: 70%+ overall, 100% for game logic  

Ready to write tests! 🎯

