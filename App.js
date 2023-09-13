import 'react-native-gesture-handler';
import {useCallback} from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, Button } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './components/6.authentication/navigators/RootNavigator';
import { AuthProvider } from './components/6.authentication/contexts/AuthContext';
import { NativeBaseProvider } from 'native-base';


SplashScreen.preventAutoHideAsync();


export default function App() {
  const [fontsLoaded] = useFonts({
    'Pacifico': require('./assets/fonts/Pacifico-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return ( 
    <NavigationContainer>
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,          // Stretches out, takes up the available space
  }
});
