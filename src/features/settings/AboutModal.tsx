import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, StyleSheet, Pressable, Modal, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../components/ScreenHeader';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

const logo = require('../../../assets/stumart-logo.png');

export const AboutModal: React.FC<AboutModalProps> = ({ visible, onClose }) => {
  const showTerms = () => {
    Alert.alert(
      'Terms of Service',
      'StuMart is a peer-to-peer campus marketplace platform connecting student sellers and buyers. All transactions and interactions must abide by university campus guidelines and local laws.'
    );
  };

  const showPrivacy = () => {
    Alert.alert(
      'Privacy Policy',
      'StuMart respects your privacy. Account details, chat history, and verification documents are encrypted and never shared with third parties.'
    );
  };

  const showSupport = () => {
    Alert.alert(
      'Campus Support',
      'Need help with an order or account? Contact us at support@stumart.app or visit the KNUST Student Hustle Help Desk.'
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="About StuMart" backLabel="Settings" onBack={onClose} />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Logo & Version */}
          <View style={styles.logoSection}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.appName}>StuMart</Text>
            <Text style={styles.versionText}>Version 1.2.4 (Build 2026.07)</Text>
            <Text style={styles.tagline}>Built for campus hustle & student commerce</Text>
          </View>

          <View style={styles.card}>
            <Pressable style={styles.row} onPress={showTerms}>
              <Ionicons name="document-text-outline" size={20} color="#4F46E5" />
              <Text style={styles.rowLabel}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={styles.row} onPress={showPrivacy}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#4F46E5" />
              <Text style={styles.rowLabel}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={styles.row} onPress={showSupport}>
              <Ionicons name="help-buoy-outline" size={20} color="#4F46E5" />
              <Text style={styles.rowLabel}>Contact & Campus Support</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>
          </View>

          <Text style={styles.copyright}>© 2026 StuMart Inc. All rights reserved.</Text>
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
  logoSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 10,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
  },
  versionText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  tagline: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
  },
});
