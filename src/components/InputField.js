import React from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const InputField = ({ label, value, onChangeText, ...props }) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      mode="flat"
      underlineColor="#ffffff"
      textColor="#ffffff"
      style={styles.input}
      theme={{ colors: { text: '#ffffff', placeholder: '#aaaaaa' } }}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent',
    fontFamily: 'Poppins_400Regular',
  },
});

export default InputField;