import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../redux/auth/authSlice';
import { View, ActivityIndicator } from 'react-native';

import Login from '../screens/Auth/Login';
import Signup from '../screens/Auth/Signup';
import ChatList from '../screens/Chat/ChatList';
import Chat from '../screens/Chat/Chat';

const Stack = createStackNavigator();

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
);

const AppStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ChatList" component={ChatList} />
        <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
);

const Routes = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    dispatch(setUser(JSON.parse(storedUser)));
                }
            } catch (e) {
                console.log('Error loading user', e);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, [dispatch]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    return user ? <AppStack /> : <AuthStack />;
};

export default Routes;

