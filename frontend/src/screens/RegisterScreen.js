import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../stores/authStore';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    const result = await register(email, password, name, phone);
    if (!result.success) {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoWrapper}>
          <Image source={require('../../assets/saarthi.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={styles.kicker}>Create your profile</Text>
        <Text style={styles.title}>Get Started</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          placeholderTextColor="#7B8BAA"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email *"
          placeholderTextColor="#7B8BAA"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          placeholderTextColor="#7B8BAA"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Password *"
          placeholderTextColor="#7B8BAA"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.link}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#090F1D',
  },
  card: {
    backgroundColor: '#101A2E',
    borderWidth: 1,
    borderColor: '#1D2A45',
    borderRadius: 20,
    padding: 24,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  kicker: {
    fontSize: 13,
    color: '#9AA9C6',
    marginBottom: 4,
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#EAF1FF',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2A3B61',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#0B1427',
    fontSize: 16,
    color: '#F4F7FF',
  },
  button: {
    backgroundColor: '#06B77D',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    alignItems: 'center',
  },
  linkText: {
    color: '#AABDFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default RegisterScreen;
