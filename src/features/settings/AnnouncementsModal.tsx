import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Announcement } from './types';

interface AnnouncementsModalProps {
  visible: boolean;
  onClose: () => void;
}

const mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: 'StuMart v1.2 Release: In-App Payments & MoMo!',
    date: '26 Jul, 2026',
    body: 'We are thrilled to introduce native Mobile Money and Card payment checkout! Buyers and sellers can now settle deals securely in seconds.',
    isRead: false,
    category: 'Update',
  },
  {
    id: 'a2',
    title: 'Expanded Campus Category Taxonomy',
    date: '24 Jul, 2026',
    body: 'Discover new categories including Tech & Repair, Barbering & Grooming, Photo & Video, and Academic Tutoring for student hustles.',
    isRead: false,
    category: 'Feature',
  },
  {
    id: 'a3',
    title: 'Student Vendor Verification Guidelines',
    date: '18 Jul, 2026',
    body: 'Verify your school ID evidence in Studio Mode to unlock verified vendor badges and build instant buyer trust.',
    isRead: true,
    category: 'Safety',
  },
  {
    id: 'a4',
    title: 'Campus Pickup & Escrow Protection',
    date: '10 Jul, 2026',
    body: 'Remember to inspect items or confirm completed services before confirming final receipt. StuMart holds funds until you are satisfied.',
    isRead: true,
    category: 'General',
  },
];

export const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({
  visible,
  onClose,
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);

  const markAllRead = () => {
    setAnnouncements((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={onClose}>
            <Ionicons name="arrow-back" size={20} color="#4F46E5" />
          </Pressable>
          <Text style={styles.headerTitle}>Announcements</Text>
          <Pressable onPress={markAllRead}>
            <Text style={styles.markReadText}>Mark read</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {announcements.map((item) => (
            <View key={item.id} style={[styles.card, !item.isRead && styles.unreadCard]}>
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.category}</Text>
                </View>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>

              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.bodyText}>{item.body}</Text>

              {!item.isRead && <View style={styles.unreadDot} />}
            </View>
          ))}
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
  markReadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    position: 'relative',
  },
  unreadCard: {
    borderColor: '#818CF8',
    backgroundColor: '#FAF5FF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 19,
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
  },
});
