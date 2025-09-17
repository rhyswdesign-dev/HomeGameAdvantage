/**
 * Order Exercise Component
 * Drag-to-order interface with inline diff feedback
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Item } from '../../types/domain';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/tokens';

export type ExerciseCommonProps = {
  item: Item;
  onResult: (res: { correct: boolean; msToAnswer: number }) => void;
  disabled?: boolean;
};

export default function OrderExercise({ item, onResult, disabled = false }: ExerciseCommonProps): React.JSX.Element {
  const [currentOrder, setCurrentOrder] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [startTime] = useState(Date.now());

  // Reset state when item changes
  useEffect(() => {
    // Reset all state for fresh question
    setAnswered(false);
    setShowDiff(false);
    
    if (item.orderTarget) {
      // Shuffle the target order for initial display
      const shuffled = [...item.orderTarget].sort(() => Math.random() - 0.5);
      setCurrentOrder(shuffled);
    }
  }, [item.id]); // Depend on item.id to reset when question changes

  const handleSubmit = () => {
    if (answered || disabled) return;
    
    const isCorrect = arraysEqual(currentOrder, item.orderTarget || []);
    const timeToAnswer = Date.now() - startTime;
    
    setAnswered(true);
    
    if (!isCorrect) {
      setShowDiff(true);
    }
    
    setTimeout(() => {
      onResult({ correct: isCorrect, msToAnswer: timeToAnswer });
    }, isCorrect ? 1000 : 2500); // Show diff longer for incorrect answers
  };

  const handleRetry = () => {
    setAnswered(false);
    setShowDiff(false);
    // Re-shuffle items
    const shuffled = [...(item.orderTarget || [])].sort(() => Math.random() - 0.5);
    setCurrentOrder(shuffled);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (answered || disabled) return;
    
    const newOrder = [...currentOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setCurrentOrder(newOrder);
  };

  const arraysEqual = (a: string[], b: string[]): boolean => {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  };

  const getItemStyle = (orderItem: string, index: number) => {
    if (!answered) {
      return styles.orderItem;
    }
    
    const correctIndex = (item.orderTarget || item.expectedOrder || []).indexOf(orderItem);
    const isInCorrectPosition = correctIndex === index;
    
    if (isInCorrectPosition) {
      return [styles.orderItem, styles.correctItem];
    } else {
      return [styles.orderItem, styles.incorrectItem];
    }
  };

  const renderDiff = () => {
    if (!showDiff || !item.orderTarget) return null;
    
    return (
      <View style={styles.diffContainer}>
        <Text style={styles.diffTitle}>Correct Order:</Text>
        {item.orderTarget.map((step, index) => (
          <View key={`correct-${index}`} style={styles.diffItem}>
            <Text style={styles.diffNumber}>{index + 1}.</Text>
            <Text style={styles.diffText}>{step}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{item.prompt}</Text>
      
      <View style={styles.orderContainer}>
        {currentOrder.map((step, index) => (
          <View key={`${step}-${index}`} style={styles.itemContainer}>
            <Pressable
              style={getItemStyle(step, index)}
              onPress={() => {
                // Simple tap-to-move: move item up one position
                if (index > 0) {
                  moveItem(index, index - 1);
                }
              }}
              onLongPress={() => {
                // Long press to move to end
                if (index < currentOrder.length - 1) {
                  moveItem(index, currentOrder.length - 1);
                }
              }}
              disabled={answered || disabled}
            >
              <View style={styles.itemContent}>
                <Text style={styles.itemNumber}>{index + 1}</Text>
                <Text style={styles.itemText}>{step}</Text>
                {!answered && !disabled && (
                  <View style={styles.moveHints}>
                    {index > 0 && <Text style={styles.hintText}>↑</Text>}
                    {index < currentOrder.length - 1 && <Text style={styles.hintText}>↓</Text>}
                  </View>
                )}
              </View>
            </Pressable>
            
            {/* Move buttons for better UX */}
            {!answered && !disabled && (
              <View style={styles.moveButtons}>
                {index > 0 && (
                  <Pressable
                    style={styles.moveButton}
                    onPress={() => moveItem(index, index - 1)}
                  >
                    <Text style={styles.moveButtonText}>▲</Text>
                  </Pressable>
                )}
                {index < currentOrder.length - 1 && (
                  <Pressable
                    style={styles.moveButton}
                    onPress={() => moveItem(index, index + 1)}
                  >
                    <Text style={styles.moveButtonText}>▼</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        ))}
      </View>

      {renderDiff()}

      <View style={styles.actionContainer}>
        {!answered ? (
          <Pressable
            style={[styles.submitButton, disabled && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={disabled}
          >
            <Text style={styles.submitButtonText}>Check Order</Text>
          </Pressable>
        ) : (
          <View style={styles.feedback}>
            <View style={styles.feedbackContent}>
              <Ionicons 
                name={arraysEqual(currentOrder, item.orderTarget || []) ? 'checkmark-circle' : 'close-circle'} 
                size={24} 
                color={arraysEqual(currentOrder, item.orderTarget || []) ? colors.success : colors.error} 
              />
              <Text style={[
                styles.feedbackText,
                arraysEqual(currentOrder, item.orderTarget || []) ? styles.correctText : styles.incorrectText
              ]}>
                {arraysEqual(currentOrder, item.orderTarget || []) ? 'Perfect sequence!' : 'Not quite right'}
              </Text>
            </View>
            
            {!arraysEqual(currentOrder, item.orderTarget || []) && (
              <Pressable style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  prompt: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    lineHeight: 28,
    textAlign: 'center',
  },
  orderContainer: {
    gap: 8,
    marginBottom: 24,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderItem: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  correctItem: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
  },
  incorrectItem: {
    backgroundColor: '#ffeaea',
    borderColor: '#f44336',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    minWidth: 24,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  moveHints: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  hintText: {
    fontSize: 12,
    color: '#888',
  },
  moveButtons: {
    flexDirection: 'column',
    gap: 4,
  },
  moveButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    padding: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  moveButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  diffContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  diffTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4CAF50',
  },
  diffItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  diffNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    minWidth: 20,
  },
  diffText: {
    fontSize: 14,
    color: '#333',
  },
  actionContainer: {
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  feedback: {
    alignItems: 'center',
    gap: 12,
  },
  feedbackContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  correctText: {
    color: '#4CAF50',
  },
  incorrectText: {
    color: '#f44336',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});