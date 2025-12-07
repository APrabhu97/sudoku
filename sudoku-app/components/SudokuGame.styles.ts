import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingVertical: 20,
    gap: 16,
  },
  difficultySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  difficultyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  difficultyButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  difficultyButtonTextActive: {
    color: '#FFFFFF',
  },
  gridWrapper: {
    borderRadius: 12,
    padding: 16,
  },
  completionBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E20',
    flex: 1,
  },
  completionTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E7D32',
  },
});
