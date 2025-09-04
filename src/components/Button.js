import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const PrimaryButton = ({ title, onPress, loading, disabled }) => {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={styles.button}
      labelStyle={styles.label}
      buttonColor="#ffffff"
    >
      {title}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    borderRadius: 5,
  },
  label: {
    color: '#000000',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
});

export default PrimaryButton;