import React, { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, logoutUser } from '../../redux/auth/authSlice';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatList = ({ navigation }) => {
    const dispatch = useDispatch();
    const { users, isLoading, user } = useSelector((state) => state.auth);

    useEffect(() => {
        console.log('[ChatList] Component mounted, fetching users...');
        dispatch(getAllUsers());
    }, [dispatch]);

    useEffect(() => {
        if (users.length > 0) {
            console.log(`[ChatList] Users list updated. Count: ${users.length}`);
        }
    }, [users]);

    const handleLogout = () => {
        console.log('[ChatList] Logout pressed');
        dispatch(logoutUser());
    };

    const renderUserItem = ({ item }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => {
                console.log(`[ChatList] Navigating to chat with ${item.name} (${item._id})`);
                navigation.navigate('Chat', { recipient: item });
            }}
        >

            <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {item.name ? item.name[0].toUpperCase() : '?'}
                    </Text>
                </View>
                <View
                    style={[
                        styles.statusDot,
                        { backgroundColor: item.isOnline ? '#4CAF50' : '#9E9E9E' },
                    ]}
                />
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userStatus}>
                    {item.isOnline ? 'Online' : 'Offline'}
                </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#CCC" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chats</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <MaterialCommunityIcons name="logout" size={24} color="#FF4D4D" />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007BFF" />
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item._id}
                    renderItem={renderUserItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No users found</Text>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    listContent: {
        padding: 10,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4F46E5',
    },
    statusDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    userInfo: {
        flex: 1,
        marginLeft: 15,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    userStatus: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
        fontSize: 16,
    },
});

export default ChatList;
