import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../stores/authStore';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, user } = useAuthStore();
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      navigation.replace('Main');
    }
  }, [user]);

  const handleLogin = async () => {
    const result = await login(email, password);
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
        <Text style={styles.kicker}>Welcome back</Text>
        <Text style={styles.title}>Saarthi</Text>
        <Text style={styles.subtitle}>Find the best fare in seconds</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#7B8BAA"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#7B8BAA"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
          <Text style={styles.linkText}>Don't have an account? Register</Text>
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
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  kicker: {
    fontSize: 13,
    color: '#9AA9C6',
    marginBottom: 4,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EAF1FF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A4C2',
    marginTop: 4,
    marginBottom: 24,
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
    backgroundColor: '#7C4DFF',
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

export default LoginScreen;
