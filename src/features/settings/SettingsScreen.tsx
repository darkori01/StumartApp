import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ChangePasswordModal } from './ChangePasswordModal';
import { NotificationPreferencesModal } from './NotificationPreferencesModal';
import { AnnouncementsModal } from './AnnouncementsModal';
import { AboutModal } from './AboutModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ConfirmLogoutModal } from './ConfirmLogoutModal';

interface SettingsScreenProps {
  visible: boolean;
  onBack: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  userDisplayName: string;
  userEmail: string;
  userRole: 'customer' | 'vendor';
  userAvatarUri?: string;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  visible,
  onBack,
  onEditProfile,
  onLogout,
  onDeleteAccount,
  userDisplayName,
  userEmail,
  userRole,
  userAvatarUri,
}) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!visible) return null;

  const username = `@${userDisplayName.toLowerCase().replace(/\s+/g, '_')}`;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.topHeaderBar}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#4F46E5" />
          <Text style={styles.backBtnText}>Home</Text>
        </Pressable>
        <Text style={styles.screenTitle}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Cover Banner & Avatar */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.bannerWrap}>
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bannerGradient}
            />
          </View>

          <View style={styles.avatarContainer}>
            {userAvatarUri ? (
              <Image source={{ uri: userAvatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons
                  name={userRole === 'vendor' ? 'storefront' : 'person'}
                  size={36}
                  color="#4F46E5"
                />
              </View>
            )}
          </View>

          <View style={styles.userInfoWrap}>
            <Text style={styles.displayName}>{userDisplayName}</Text>
            <Text style={styles.usernameText}>{username}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {userRole === 'vendor' ? 'Verified Student Vendor' : 'Student Buyer'}
              </Text>
            </View>
          </View>
        </View>

        {/* 1. ACCOUNT SECTION */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.sectionCard}>
          <Pressable style={styles.row} onPress={onEditProfile}>
            <View style={styles.iconWrap}>
              <Ionicons name="person-outline" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.rowLabel}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.row} onPress={() => setShowPasswordModal(true)}>
            <View style={styles.iconWrap}>
              <Ionicons name="key-outline" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.rowLabel}>Change Password</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.row} onPress={() => setShowNotificationModal(true)}>
            <View style={styles.iconWrap}>
              <Ionicons name="notifications-outline" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.rowLabel}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.row} onPress={() => setShowAnnouncementsModal(true)}>
            <View style={styles.iconWrap}>
              <Ionicons name="megaphone-outline" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.rowLabel}>Announcements</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* 2. SUPPORT & ABOUT SECTION */}
        <Text style={styles.sectionHeader}>SUPPORT & ABOUT</Text>
        <View style={styles.sectionCard}>
          <Pressable style={styles.row} onPress={() => setShowAboutModal(true)}>
            <View style={styles.iconWrap}>
              <Ionicons name="information-circle-outline" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.rowLabel}>About StuMart</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* 3. ACTIONS SECTION (Visually distinct - Error Red) */}
        <Text style={styles.sectionHeader}>ACTIONS</Text>
        <View style={[styles.sectionCard, styles.actionsCard]}>
          <Pressable style={styles.row} onPress={() => setShowDeleteModal(true)}>
            <View style={styles.iconWrapDanger}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </View>
            <Text style={styles.rowLabelDanger}>Delete Profile</Text>
            <Ionicons name="chevron-forward" size={18} color="#FCA5A5" />
          </Pressable>

          <View style={styles.dividerDanger} />

          <Pressable style={styles.row} onPress={() => setShowLogoutModal(true)}>
            <View style={styles.iconWrapDanger}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </View>
            <Text style={styles.rowLabelDanger}>Account Logout</Text>
            <Ionicons name="chevron-forward" size={18} color="#FCA5A5" />
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Nested Modals */}
      <ChangePasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => setShowPasswordModal(false)}
      />

      <NotificationPreferencesModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />

      <AnnouncementsModal
        visible={showAnnouncementsModal}
        onClose={() => setShowAnnouncementsModal(false)}
      />

      <AboutModal
        visible={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      <ConfirmDeleteModal
        visible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          onDeleteAccount();
        }}
      />

      <ConfirmLogoutModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          onLogout();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeaderBar: {
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtnText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollContent: {
    padding: 16,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
  },
  bannerWrap: {
    width: '100%',
    height: 84,
  },
  bannerGradient: {
    width: '100%',
    height: '100%',
  },
  avatarContainer: {
    marginTop: -36,
    marginBottom: 10,
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userInfoWrap: {
    alignItems: 'center',
  },
  displayName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  usernameText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.8,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  actionsCard: {
    borderColor: '#FECACA',
    backgroundColor: '#FFF5F5',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    minHeight: 48,
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDanger: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  rowLabelDanger: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  dividerDanger: {
    height: 1,
    backgroundColor: '#FEE2E2',
  },
});
