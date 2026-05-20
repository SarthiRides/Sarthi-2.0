import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import useAuthStore from './src/stores/authStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: true,
      headerTitle: 'Saarthi',
      headerStyle: { backgroundColor: '#101A2E' },
      headerTintColor: '#EAF1FF',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
      tabBarStyle: { backgroundColor: '#101A2E', borderTopColor: '#1F2D49', height: 60, paddingBottom: 8 },
      tabBarActiveTintColor: '#7C4DFF',
      tabBarInactiveTintColor: '#9FB0D1',
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size + 4} />,
      }}
    />
    <Tab.Screen
      name="HistoryTab"
      component={HistoryScreen}
      options={{
        tabBarLabel: 'History',
        tabBarIcon: ({ color, size }) => <MaterialIcons name="history" color={color} size={size + 4} />,
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size + 4} />,
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  const user = useAuthStore((state) => state.user);
  const restoreToken = useAuthStore((state) => state.restoreToken);

  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#101A2E" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
              name="Results"
              component={ResultsScreen}
              options={{
                headerShown: true,
                title: 'Fare Results',
                headerStyle: { backgroundColor: '#101A2E' },
                headerTintColor: '#EAF1FF',
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
