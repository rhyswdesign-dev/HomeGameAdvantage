/**
 * VAULT PAYMENT METHODS SCREEN
 * Manage credit/debit cards for Vault purchases
 */

import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, radii } from '../../theme/tokens';

interface PaymentMethod {
  id: string;
  type: 'card';
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  stripePaymentMethodId?: string;
}

export default function VaultPaymentMethodsScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Mock payment methods - would come from backend/Stripe in real app
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1',
      type: 'card',
      brand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      stripePaymentMethodId: 'pm_1234567890'
    }
  ]);
  
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  
  useLayoutEffect(() => {
    nav.setOptions({
      title: 'Payment Methods',
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text, fontWeight: '900' },
      headerShadowVisible: false,
      headerLeft: () => (
        <Pressable hitSlop={12} onPress={() => nav.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable hitSlop={12} onPress={() => setShowAddCard(true)}>
          <Ionicons name="add" size={24} color={colors.text} />
        </Pressable>
      ),
    });
  }, [nav]);

  const getBrandIcon = (brand: string): string => {
    switch (brand.toLowerCase()) {
      case 'visa': return 'credit-card-outline';
      case 'mastercard': return 'credit-card-outline';
      case 'amex': return 'credit-card-outline';
      case 'discover': return 'credit-card-outline';
      default: return 'credit-card-outline';
    }
  };

  const getBrandColor = (brand: string): string => {
    switch (brand.toLowerCase()) {
      case 'visa': return '#1A1F71';
      case 'mastercard': return '#EB001B';
      case 'amex': return '#006FCF';
      case 'discover': return '#FF6000';
      default: return colors.accent;
    }
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev => prev.map(pm => ({
      ...pm,
      isDefault: pm.id === methodId
    })));
  };

  const handleRemoveCard = (methodId: string, last4: string) => {
    Alert.alert(
      'Remove Card',
      `Remove card ending in ${last4}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(pm => pm.id !== methodId));
          }
        }
      ]
    );
  };

  const handleAddCard = () => {
    // In a real app, this would integrate with Stripe to tokenize the card
    if (!newCard.number || !newCard.expiry || !newCard.cvc || !newCard.name) {
      Alert.alert('Missing Information', 'Please fill in all card details.');
      return;
    }

    const newPaymentMethod: PaymentMethod = {
      id: 'pm_' + Date.now(),
      type: 'card',
      brand: 'visa', // Would be detected from card number
      last4: newCard.number.slice(-4),
      expiryMonth: parseInt(newCard.expiry.split('/')[0]),
      expiryYear: parseInt('20' + newCard.expiry.split('/')[1]),
      isDefault: paymentMethods.length === 0,
      stripePaymentMethodId: 'pm_mock_' + Date.now()
    };

    setPaymentMethods(prev => [...prev, newPaymentMethod]);
    setNewCard({ number: '', expiry: '', cvc: '', name: '' });
    setShowAddCard(false);
    
    Alert.alert('Card Added', 'Your payment method has been added successfully.');
  };

  return (
    <View style={styles.container}>
      {paymentMethods.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="credit-card-outline" size={80} color={colors.subtext} />
          <Text style={styles.emptyTitle}>No payment methods</Text>
          <Text style={styles.emptySubtitle}>
            Add a credit or debit card to purchase Keys and Boosters
          </Text>
          <TouchableOpacity 
            style={styles.addCardButton}
            onPress={() => setShowAddCard(true)}
          >
            <Text style={styles.addCardButtonText}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.cardsList}>
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentMethodCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardBrand}>
                  <MaterialCommunityIcons 
                    name={getBrandIcon(method.brand)} 
                    size={24} 
                    color={getBrandColor(method.brand)} 
                  />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardBrandText}>
                      {method.brand.toUpperCase()}
                    </Text>
                    <Text style={styles.cardNumber}>•••• {method.last4}</Text>
                  </View>
                </View>
                
                {method.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>DEFAULT</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.cardExpiry}>
                Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
              </Text>
              
              <View style={styles.cardActions}>
                {!method.isDefault && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleSetDefault(method.id)}
                  >
                    <Text style={styles.actionButtonText}>Set as Default</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.removeButton]}
                  onPress={() => handleRemoveCard(method.id, method.last4)}
                >
                  <Text style={[styles.actionButtonText, styles.removeButtonText]}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Add Card Modal */}
      <Modal
        visible={showAddCard}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddCard(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Card</Text>
            <TouchableOpacity onPress={handleAddCard}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <TextInput
              style={styles.cardInput}
              placeholder="Card Number"
              value={newCard.number}
              onChangeText={(text) => setNewCard(prev => ({...prev, number: text}))}
              keyboardType="numeric"
              maxLength={19}
              placeholderTextColor={colors.subtext}
            />
            
            <View style={styles.cardRow}>
              <TextInput
                style={[styles.cardInput, styles.halfInput]}
                placeholder="MM/YY"
                value={newCard.expiry}
                onChangeText={(text) => setNewCard(prev => ({...prev, expiry: text}))}
                keyboardType="numeric"
                maxLength={5}
                placeholderTextColor={colors.subtext}
              />
              
              <TextInput
                style={[styles.cardInput, styles.halfInput]}
                placeholder="CVC"
                value={newCard.cvc}
                onChangeText={(text) => setNewCard(prev => ({...prev, cvc: text}))}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                placeholderTextColor={colors.subtext}
              />
            </View>
            
            <TextInput
              style={styles.cardInput}
              placeholder="Cardholder Name"
              value={newCard.name}
              onChangeText={(text) => setNewCard(prev => ({...prev, name: text}))}
              placeholderTextColor={colors.subtext}
            />
            
            <View style={styles.securityNote}>
              <Ionicons name="shield-checkmark" size={16} color={colors.accent} />
              <Text style={styles.securityText}>
                Your payment information is encrypted and secure
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing(4),
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing(2),
    marginBottom: spacing(1),
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: spacing(3),
  },
  addCardButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
  },
  addCardButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  
  // Cards List
  cardsList: {
    flex: 1,
    padding: spacing(2),
  },
  paymentMethodCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(3),
    marginBottom: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(1),
  },
  cardBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfo: {
    marginLeft: spacing(2),
  },
  cardBrandText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  defaultBadge: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
  },
  defaultText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  cardExpiry: {
    fontSize: 12,
    color: colors.subtext,
    marginBottom: spacing(2),
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  actionButton: {
    backgroundColor: colors.bg,
    borderRadius: radii.sm,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderWidth: 1,
    borderColor: colors.line,
  },
  removeButton: {
    borderColor: colors.destructive,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  removeButtonText: {
    color: colors.destructive,
  },
  
  // Add Card Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  cancelButton: {
    fontSize: 16,
    color: colors.subtext,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  modalContent: {
    flex: 1,
    padding: spacing(3),
  },
  cardInput: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing(2.5),
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing(2),
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  halfInput: {
    flex: 1,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing(2),
    marginTop: spacing(2),
    gap: spacing(1),
  },
  securityText: {
    fontSize: 12,
    color: colors.subtext,
    flex: 1,
  },
});