import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { store } from './src/redux/store';
import Routes from './src/navigation/Routes';

const App = () => {
  useEffect(() => {
    // Disable font scaling globally if needed, similar to the image
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Host>
            <NavigationContainer>
              <Routes />
              <Toast />
            </NavigationContainer>
          </Host>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;

