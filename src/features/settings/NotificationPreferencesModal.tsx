import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, SafeAreaView, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationPreferencesModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  visible,
  onClose,
}) => {
  const [orders, setOrders] = useState(true);
  const [messages, setMessages] = useState(true);
  const [social, setSocial] = useState(true);
  const [promotional, setPromotional] = useState(false);

  const handleSave = () => {
    Alert.alert('Preferences Saved', 'Your notification settings have been updated.', [
      { text: 'OK', onPress: onClose },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={onClose}>
            <Ionicons name="arrow-back" size={20} color="#4F46E5" />
          </Pressable>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>
            Choose which notifications you would like to receive on your device.
          </Text>

          <View style={styles.card}>
            {/* Orders Toggle */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="receipt-outline" size={20} color="#4F46E5" />
                <View style={styles.textWrap}>
                  <Text style={styles.rowTitle}>Orders & Checkout</Text>
                  <Text style={styles.rowDesc}>Updates on incoming orders, status changes, and pickup alerts.</Text>
                </View>
              </View>
              <Switch
                value={orders}
                onValueChange={setOrders}
                trackColor={{ false: '#CBD5E1', true: '#818CF8' }}
                thumbColor={orders ? '#4F46E5' : '#F1F5F9'}
              />
            </View>

            <View style={styles.divider} />

            {/* Messages Toggle */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="chatbubbles-outline" size={20} color="#4F46E5" />
                <View style={styles.textWrap}>
                  <Text style={styles.rowTitle}>Messages & Bargains</Text>
                  <Text style={styles.rowDesc}>Instant alerts for chat replies, offer proposals, and counter-offers.</Text>
                </View>
              </View>
              <Switch
                value={messages}
                onValueChange={setMessages}
                trackColor={{ false: '#CBD5E1', true: '#818CF8' }}
                thumbColor={messages ? '#4F46E5' : '#F1F5F9'}
              />
            </View>

            <View style={styles.divider} />

            {/* Social Toggle */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="heart-outline" size={20} color="#4F46E5" />
                <View style={styles.textWrap}>
                  <Text style={styles.rowTitle}>Social & Reels</Text>
                  <Text style={styles.rowDesc}>Likes on your reels, new vendor subscribers, and comments.</Text>
                </View>
              </View>
              <Switch
                value={social}
                onValueChange={setSocial}
                trackColor={{ false: '#CBD5E1', true: '#818CF8' }}
                thumbColor={social ? '#4F46E5' : '#F1F5F9'}
              />
            </View>

            <View style={styles.divider} />

            {/* Promotional Toggle */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="pricetag-outline" size={20} color="#4F46E5" />
                <View style={styles.textWrap}>
                  <Text style={styles.rowTitle}>Promotional & Campus Deals</Text>
                  <Text style={styles.rowDesc}>Special discounts, hall week announcements, and featured vendors.</Text>
                </View>
              </View>
              <Switch
                value={promotional}
                onValueChange={setPromotional}
                trackColor={{ false: '#CBD5E1', true: '#818CF8' }}
                thumbColor={promotional ? '#4F46E5' : '#F1F5F9'}
              />
            </View>
          </View>

          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Preferences</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  textWrap: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  rowDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  saveBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
