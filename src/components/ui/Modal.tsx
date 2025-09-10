import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Modal as RNModal, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../../theme/tokens';
import { BlurView } from 'expo-blur';

export interface ModalConfig {
  id: string;
  title?: string;
  content: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: Array<{
    label: string;
    onPress: () => void;
    style?: 'primary' | 'secondary' | 'danger';
  }>;
}

interface ModalContextType {
  showModal: (config: Omit<ModalConfig, 'id'>) => string;
  hideModal: (id: string) => void;
  hideAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const getModalSize = (size: ModalConfig['size']) => {
  switch (size) {
    case 'small':
      return { width: Math.min(320, screenWidth - 64), maxHeight: screenHeight * 0.5 };
    case 'medium':
      return { width: Math.min(400, screenWidth - 32), maxHeight: screenHeight * 0.7 };
    case 'large':
      return { width: Math.min(500, screenWidth - 16), maxHeight: screenHeight * 0.85 };
    case 'fullscreen':
      return { width: screenWidth, height: screenHeight };
    default:
      return { width: Math.min(400, screenWidth - 32), maxHeight: screenHeight * 0.7 };
  }
};

interface ModalItemProps {
  modal: ModalConfig;
  onDismiss: (id: string) => void;
}

const ModalItem: React.FC<ModalItemProps> = ({ modal, onDismiss }) => {
  const modalSize = getModalSize(modal.size);
  const isFullscreen = modal.size === 'fullscreen';

  const handleBackdropPress = () => {
    if (modal.dismissible !== false) {
      modal.onDismiss?.();
      onDismiss(modal.id);
    }
  };

  const handleClose = () => {
    modal.onDismiss?.();
    onDismiss(modal.id);
  };

  const getActionButtonStyle = (style?: 'primary' | 'secondary' | 'danger') => {
    switch (style) {
      case 'primary':
        return {
          backgroundColor: colors.accent,
          color: colors.accentText,
        };
      case 'danger':
        return {
          backgroundColor: '#EF4444',
          color: '#FFFFFF',
        };
      case 'secondary':
      default:
        return {
          backgroundColor: colors.card,
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.line,
        };
    }
  };

  return (
    <RNModal
      visible={true}
      transparent={!isFullscreen}
      animationType="slide"
      statusBarTranslucent
    >
      {isFullscreen ? (
        <SafeAreaView style={styles.fullscreenModal}>
          {modal.title && (
            <View style={styles.fullscreenHeader}>
              <Text style={styles.fullscreenTitle}>{modal.title}</Text>
              {modal.showCloseButton !== false && (
                <Pressable onPress={handleClose} hitSlop={12} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </Pressable>
              )}
            </View>
          )}
          <View style={styles.fullscreenContent}>
            {modal.content}
          </View>
          {modal.actions && modal.actions.length > 0 && (
            <View style={styles.actionsContainer}>
              {modal.actions.map((action, index) => {
                const buttonStyle = getActionButtonStyle(action.style);
                return (
                  <Pressable
                    key={index}
                    style={[styles.actionButton, buttonStyle]}
                    onPress={action.onPress}
                  >
                    <Text style={[styles.actionButtonText, { color: buttonStyle.color }]}>
                      {action.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </SafeAreaView>
      ) : (
        <Pressable style={styles.backdrop} onPress={handleBackdropPress}>
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          <View style={styles.modalContainer}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={[styles.modal, modalSize]}>
                {modal.title && (
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{modal.title}</Text>
                    {modal.showCloseButton !== false && (
                      <Pressable onPress={handleClose} hitSlop={12} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={colors.text} />
                      </Pressable>
                    )}
                  </View>
                )}
                
                <ScrollView 
                  style={styles.modalContent}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {modal.content}
                </ScrollView>
                
                {modal.actions && modal.actions.length > 0 && (
                  <View style={styles.actionsContainer}>
                    {modal.actions.map((action, index) => {
                      const buttonStyle = getActionButtonStyle(action.style);
                      return (
                        <Pressable
                          key={index}
                          style={[styles.actionButton, buttonStyle]}
                          onPress={action.onPress}
                        >
                          <Text style={[styles.actionButtonText, { color: buttonStyle.color }]}>
                            {action.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            </Pressable>
          </View>
        </Pressable>
      )}
    </RNModal>
  );
};

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const showModal = useCallback((config: Omit<ModalConfig, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const modal = { ...config, id };
    setModals(prev => [...prev, modal]);
    return id;
  }, []);

  const hideModal = useCallback((id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  }, []);

  const hideAllModals = useCallback(() => {
    setModals([]);
  }, []);

  return (
    <ModalContext.Provider value={{ showModal, hideModal, hideAllModals }}>
      {children}
      {modals.map(modal => (
        <ModalItem
          key={modal.id}
          modal={modal}
          onDismiss={hideModal}
        />
      ))}
    </ModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing(2),
  },
  modal: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: spacing(2),
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: spacing(2),
    gap: spacing(1.5),
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(2),
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  fullscreenModal: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  fullscreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  fullscreenTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  fullscreenContent: {
    flex: 1,
  },
});