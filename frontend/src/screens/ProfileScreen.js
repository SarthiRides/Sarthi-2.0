import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import useAuthStore from '../stores/authStore';

const ProfileScreen = () => {
  const { user, updateProfileName, logout } = useAuthStore();
  const [name, setName] = useState(user?.name || '');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter a valid name.');
      return;
    }
    updateProfileName(name);
    Alert.alert('Saved', 'Profile name updated.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Email</Text>
      <View style={styles.readOnlyBox}>
        <Text style={styles.readOnlyText}>{user?.email || '-'}</Text>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor="#7B8BAA"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Name</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090F1D',
    padding: 18,
  },
  title: {
    color: '#EAF1FF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 22,
  },
  label: {
    color: '#9FB0D1',
    marginBottom: 8,
    fontWeight: '600',
  },
  readOnlyBox: {
    backgroundColor: '#0B1427',
    borderColor: '#26395E',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  readOnlyText: {
    color: '#DCE6FF',
    fontSize: 15,
  },
  input: {
    backgroundColor: '#0B1427',
    borderColor: '#26395E',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#DCE6FF',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#7C4DFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#E53935',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
