import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FlashSaleTimerProps {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export const FlashSaleTimer: React.FC<FlashSaleTimerProps> = ({
  hours = 2,
  minutes = 45,
  seconds = 30,
}) => {
  const [time, setTime] = useState({ hours, minutes, seconds });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours: h, minutes: m, seconds: s } = prev;
        
        if (s > 0) {
          s--;
        } else if (m > 0) {
          m--;
          s = 59;
        } else if (h > 0) {
          h--;
          m = 59;
          s = 59;
        } else {
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        
        return { hours: h, minutes: m, seconds: s };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kết thúc trong</Text>
      <View style={styles.timeBox}>
        <Text style={styles.timeText}>
          {formatTime(time.hours)}:{formatTime(time.minutes)}:{formatTime(time.seconds)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  timeBox: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
