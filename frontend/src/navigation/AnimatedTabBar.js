import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { COLORS } from '../theme/theme';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width - 32;
const TAB_WIDTH = TAB_BAR_WIDTH / 5;

export default function AnimatedTabBar({ state, descriptors, navigation }) {
  // Translate X animation for active background glow indicator
  const indicatorStyle = useAnimatedStyle(() => {
    const targetX = state.index * TAB_WIDTH;
    return {
      transform: [
        {
          translateX: withSpring(targetX, {
            damping: 15,
            stiffness: 120,
          }),
        },
      ],
    };
  });

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Sliding Glow Indicator */}
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Map route names to icons
          let iconName = 'home-outline';
          if (route.name === 'Home') iconName = isFocused ? 'grid' : 'grid-outline';
          else if (route.name === 'AI Assistant') iconName = isFocused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          else if (route.name === 'Career') iconName = isFocused ? 'briefcase' : 'briefcase-outline';
          else if (route.name === 'Portfolio') iconName = isFocused ? 'folder-open' : 'folder-open-outline';
          else if (route.name === 'Profile') iconName = isFocused ? 'person' : 'person-outline';

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={isFocused ? COLORS.primary : COLORS.textSecondary}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    width: TAB_BAR_WIDTH,
    height: 64,
    backgroundColor: 'rgba(11, 17, 32, 0.85)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  indicator: {
    position: 'absolute',
    width: TAB_WIDTH,
    height: '100%',
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabItem: {
    width: TAB_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
