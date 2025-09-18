/**
 * ActionMenu Component
 * Standardized 3-dot overflow menu for cards and cells
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Modal, 
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Platform,
  ViewStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fonts } from '../../theme/tokens';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  destructive?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  triggerIcon?: keyof typeof Ionicons.glyphMap;
  triggerSize?: number;
  triggerColor?: string;
  triggerStyle?: ViewStyle;
  menuWidth?: number;
  placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
  showDividers?: boolean;
  closeOnSelect?: boolean;
  disabled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export default function ActionMenu({
  items,
  triggerIcon = 'ellipsis-horizontal',
  triggerSize = 20,
  triggerColor = colors.subtext,
  triggerStyle,
  menuWidth = 200,
  placement = 'auto',
  showDividers = false,
  closeOnSelect = true,
  disabled = false,
  onOpen,
  onClose,
}: ActionMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<View>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 20,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, scaleAnim, opacityAnim]);

  const openMenu = () => {
    if (disabled) return;

    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });
      
      // Calculate menu position based on placement and screen boundaries
      let menuX = x;
      let menuY = y + height + spacing(0.5);

      // Auto placement logic
      if (placement === 'auto') {
        // Check if menu fits below
        if (menuY + (items.length * 44) + spacing(2) > screenHeight) {
          // Position above
          menuY = y - (items.length * 44) - spacing(2);
        }
        
        // Check if menu fits to the right
        if (menuX + menuWidth > screenWidth) {
          // Position to the left
          menuX = x + width - menuWidth;
        }
      } else {
        // Manual placement
        switch (placement) {
          case 'top':
            menuY = y - (items.length * 44) - spacing(2);
            break;
          case 'bottom':
            menuY = y + height + spacing(0.5);
            break;
          case 'left':
            menuX = x - menuWidth - spacing(1);
            menuY = y;
            break;
          case 'right':
            menuX = x + width + spacing(1);
            menuY = y;
            break;
        }
      }

      setMenuPosition({ x: Math.max(spacing(1), menuX), y: Math.max(spacing(1), menuY) });
      setIsVisible(true);
      onOpen?.();
    });
  };

  const closeMenu = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleItemPress = (item: ActionMenuItem) => {
    if (item.disabled) return;
    
    if (closeOnSelect) {
      closeMenu();
    }
    
    item.onPress();
  };

  const renderMenuItem = (item: ActionMenuItem, index: number) => {
    const isLast = index === items.length - 1;
    
    return (
      <View key={item.id}>
        <Pressable
          style={[
            styles.menuItem,
            item.disabled && styles.menuItemDisabled,
            item.destructive && styles.menuItemDestructive,
          ]}
          onPress={() => handleItemPress(item)}
          disabled={item.disabled}
        >
          {item.icon && (
            <Ionicons
              name={item.icon}
              size={18}
              color={
                item.disabled 
                  ? colors.muted 
                  : item.destructive 
                    ? '#EF4444' 
                    : colors.subtext
              }
              style={styles.menuItemIcon}
            />
          )}
          <Text
            style={[
              styles.menuItemText,
              item.disabled && styles.menuItemTextDisabled,
              item.destructive && styles.menuItemTextDestructive,
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
        
        {showDividers && !isLast && <View style={styles.divider} />}
      </View>
    );
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Trigger Button */}
      <Pressable
        ref={triggerRef}
        style={[styles.trigger, triggerStyle, disabled && styles.triggerDisabled]}
        onPress={openMenu}
        disabled={disabled}
      >
        <Ionicons name={triggerIcon} size={triggerSize} color={triggerColor} />
      </Pressable>

      {/* Menu Modal */}
      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.menu,
                  {
                    width: menuWidth,
                    left: menuPosition.x,
                    top: menuPosition.y,
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                  },
                ]}
              >
                {items.map(renderMenuItem)}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

// Convenience components for common menu types
export interface SaveActionMenuProps {
  isSaved: boolean;
  onSave: () => void;
  onUnsave: () => void;
  onShare?: () => void;
  onReport?: () => void;
  triggerStyle?: ViewStyle;
}

export const SaveActionMenu: React.FC<SaveActionMenuProps> = ({
  isSaved,
  onSave,
  onUnsave,
  onShare,
  onReport,
  triggerStyle,
}) => {
  const items: ActionMenuItem[] = [
    {
      id: 'save',
      label: isSaved ? 'Remove from Saved' : 'Save',
      icon: isSaved ? 'heart' : 'heart-outline',
      onPress: isSaved ? onUnsave : onSave,
    },
  ];

  if (onShare) {
    items.push({
      id: 'share',
      label: 'Share',
      icon: 'share-outline',
      onPress: onShare,
    });
  }

  if (onReport) {
    items.push({
      id: 'report',
      label: 'Report',
      icon: 'flag-outline',
      destructive: true,
      onPress: onReport,
    });
  }

  return <ActionMenu items={items} triggerStyle={triggerStyle} />;
};

export interface ContentActionMenuProps {
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  triggerStyle?: ViewStyle;
}

export const ContentActionMenu: React.FC<ContentActionMenuProps> = ({
  onEdit,
  onDuplicate,
  onDelete,
  onShare,
  canEdit = true,
  canDelete = true,
  triggerStyle,
}) => {
  const items: ActionMenuItem[] = [];

  if (onEdit && canEdit) {
    items.push({
      id: 'edit',
      label: 'Edit',
      icon: 'create-outline',
      onPress: onEdit,
    });
  }

  if (onDuplicate) {
    items.push({
      id: 'duplicate',
      label: 'Duplicate',
      icon: 'copy-outline',
      onPress: onDuplicate,
    });
  }

  if (onShare) {
    items.push({
      id: 'share',
      label: 'Share',
      icon: 'share-outline',
      onPress: onShare,
    });
  }

  if (onDelete && canDelete) {
    items.push({
      id: 'delete',
      label: 'Delete',
      icon: 'trash-outline',
      destructive: true,
      onPress: onDelete,
    });
  }

  return <ActionMenu items={items} triggerStyle={triggerStyle} showDividers />;
};

const styles = StyleSheet.create({
  trigger: {
    padding: spacing(1),
    borderRadius: radii.sm,
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menu: {
    position: 'absolute',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    paddingVertical: spacing(1),
    shadowColor: colors.shadow,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
    borderWidth: Platform.OS === 'android' ? 1 : 0,
    borderColor: colors.line,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(2),
    minHeight: 44,
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuItemDestructive: {
    // Styling handled by text and icon colors
  },
  menuItemIcon: {
    marginRight: spacing(1.5),
    width: 20,
  },
  menuItemText: {
    fontSize: fonts.body,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  menuItemTextDisabled: {
    color: colors.muted,
  },
  menuItemTextDestructive: {
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginHorizontal: spacing(2),
  },
});