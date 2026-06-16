import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, GLASS_STYLE } from '../theme/theme';

export default function GlassCard({ children, style, ...props }) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...GLASS_STYLE,
    overflow: 'hidden',
  },
});
