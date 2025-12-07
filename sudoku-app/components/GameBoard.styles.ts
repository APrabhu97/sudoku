import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  spacer: {
    flex: 1,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timer: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  pauseButton: {
    padding: 4,
  },
  gridWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  numberPadContainer: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
});
