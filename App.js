import 'react-native-get-random-values';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Alert } from 'react-native';
import { Amplify } from 'aws-amplify';
import { defaultStorage } from 'aws-amplify/utils';
import { signIn, signUp, signOut, getCurrentUser } from 'aws-amplify/auth';
import awsconfig from './aws-exports';
import { useState, useEffect } from 'react';

// Check if we have valid config
const hasValidConfig = awsconfig.Auth?.userPoolId && 
                      awsconfig.Auth?.userPoolId !== 'your-user-pool-id' &&
                      awsconfig.Auth?.userPoolWebClientId !== 'your-app-client-id';

// Only configure if we have valid values
if (hasValidConfig) {
  try {
    Amplify.configure(awsconfig);
    console.log('Amplify configured successfully');
  } catch (error) {
    console.log('Amplify config error:', error);
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [configStatus, setConfigStatus] = useState(hasValidConfig ? 'Configured' : 'Missing AWS values');

  // Test function to check current user
  const checkCurrentUser = async () => {
    if (!hasValidConfig) {
      Alert.alert('Not Configured', 'Please add your Cognito values to aws-exports.js first');
      return;
    }
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      Alert.alert('Success', `Logged in as: ${currentUser.username}`);
    } catch (error) {
      setUser(null);
      Alert.alert('Not logged in', 'No user found');
    }
  };

  // Test sign in (hardcoded for now)
  const testSignIn = async () => {
    if (!hasValidConfig) {
      Alert.alert('Not Configured', 'Please add your Cognito values to aws-exports.js first');
      return;
    }
    setLoading(true);
    try {
      const user = await signIn({
        username: 'test@example.com',
        password: 'Test123!'
      });
      setUser(user);
      Alert.alert('Success', 'Signed in successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test sign out
  const testSignOut = async () => {
    if (!hasValidConfig) {
      Alert.alert('Not Configured', 'Please add your Cognito values to aws-exports.js first');
      return;
    }
    try {
      await signOut();
      setUser(null);
      Alert.alert('Success', 'Signed out successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PostFlow</Text>
        <Text style={styles.subtitle}>Authentication Test</Text>
      </View>
      
      <View style={styles.content}>
        <View style={[styles.statusContainer, { backgroundColor: hasValidConfig ? '#D1FAE5' : '#FEE2E2' }]}>
          <Text style={styles.status}>
            Config: {configStatus}
          </Text>
        </View>

        <Text style={styles.userStatus}>
          Auth Status: {user ? `Logged in as ${user.username}` : 'Not logged in'}
        </Text>

        <View style={styles.buttonContainer}>
          <Button 
            title="Check Current User" 
            onPress={checkCurrentUser}
            color="#6366F1"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Test Sign In" 
            onPress={testSignIn}
            disabled={loading || !hasValidConfig}
            color="#10B981"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Test Sign Out" 
            onPress={testSignOut}
            disabled={!hasValidConfig}
            color="#EF4444"
          />
        </View>

        {!hasValidConfig && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Update aws-exports.js with your Cognito values to enable authentication
            </Text>
          </View>
        )}
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  statusContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  userStatus: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  warningBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  warningText: {
    color: '#92400E',
    textAlign: 'center',
    fontSize: 14,
  },
});