import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface PageHeaderBannerProps {
  title: string;
  subtitle?: string;
  iconName?: string;
  badgeText?: string;
  rightAction?: React.ReactNode;
  gradientColors?: [string, string];
}

export const PageHeaderBanner: React.FC<PageHeaderBannerProps> = ({
  title,
  rightAction,
}) => {
  return (
    <View style={styles.headerContainer}>
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
    paddingHorizontal: 0,
    paddingTop: 4,
    paddingBottom: 4,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
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
