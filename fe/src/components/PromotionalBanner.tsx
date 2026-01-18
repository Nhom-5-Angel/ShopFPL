import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PromotionalBannerProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  title,
  subtitle,
  buttonText = 'Mua Ngay',
  onButtonPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder}>
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <TouchableOpacity 
              style={styles.button} 
              onPress={onButtonPress}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#1A1A1A',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    padding: 24,
  },
  content: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    opacity: 0.95,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#1A1A1A',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
