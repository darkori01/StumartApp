import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ScreenHeaderProps {
  title: string;
  backLabel?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  subtitle?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  backLabel = 'Back',
  onBack,
  rightAction,
}) => {
  return (
    <View style={styles.headerContainer}>
      {onBack && (
        <Pressable style={styles.backBtn} onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={20} color="#4F46E5" />
          <Text style={styles.backLabel} numberOfLines={1}>{backLabel}</Text>
        </Pressable>
      )}

      <View style={styles.titleRow}>
        <Text style={styles.titleText}>{title}</Text>
        {rightAction && <View style={styles.rightActionWrap}>{rightAction}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  backLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'left',
    letterSpacing: -0.5,
    paddingTop: 8,
    paddingBottom: 16,
  },
  rightActionWrap: {
    alignItems: 'flex-end',
  },
});
