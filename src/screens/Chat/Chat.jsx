import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import io from 'socket.io-client';
import { BASE_URL } from '../../constants';
import { createConversation, getMessages, resetChatState } from '../../redux/chat/chatSlice';


const Chat = ({ route, navigation }) => {
    const { recipient } = route.params;
    const { user } = useSelector((state) => state.auth);
    const { activeConversation, messages: historyMessages, isLoading: chatLoading } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showTyping, setShowTyping] = useState(false);
    const socket = useRef(null);

    const SOCKET_URL = BASE_URL.replace('/api', '');

    // 1. Initial Socket Connection
    useEffect(() => {
        if (!user || !user._id) {
            console.log('[Chat] User or User ID missing');
            return;
        }

        socket.current = io(SOCKET_URL);
        console.log('[Chat] Socket connected, joining room:', user._id);
        socket.current.emit('join', user._id);

        socket.current.on('receive_message', (data) => {
            console.log('[Chat] Real-time message received:', data);
            if (data.from === recipient._id) {
                setMessages((prev) => [...prev, data]);
            }
        });

        socket.current.on('user_typing', (data) => {
            if (data.userId === recipient._id) {
                setShowTyping(data.isTyping);
            }
        });

        return () => {
            console.log('[Chat] Cleanup: Disconnecting socket and resetting state');
            socket.current.disconnect();
            dispatch(resetChatState());
        };
    }, [SOCKET_URL, user._id, recipient._id, dispatch]);

    // 2. Manage Conversation & History
    useEffect(() => {
        console.log(`[Chat] Initializing chat with ${recipient.name}...`);
        dispatch(createConversation(recipient._id));
    }, [recipient._id, dispatch]);

    useEffect(() => {
        if (activeConversation?._id) {
            console.log('[Chat] Active conversation ID:', activeConversation._id);
            dispatch(getMessages(activeConversation._id));
        }
    }, [activeConversation?._id, dispatch]);

    useEffect(() => {
        if (historyMessages.length > 0) {
            console.log(`[Chat] Syncing ${historyMessages.length} history messages`);
            const formatted = historyMessages.map(m => ({
                _id: m._id,
                message: m.text,
                from: m.sender._id || m.sender,
                timestamp: m.createdAt,
            }));
            setMessages(formatted);
        }
    }, [historyMessages]);


    const handleSend = () => {
        if (message.trim() && activeConversation) {
            console.log(`[Chat] Sending message via conversation: ${activeConversation._id}`);
            const messageData = {
                to: recipient._id,
                message: message.trim(),
                timestamp: new Date().toISOString(),
                from: user._id,
                conversationId: activeConversation._id
            };

            socket.current.emit('send_message', messageData);
            setMessages((prev) => [...prev, messageData]);

            setMessage('');
            socket.current.emit('typing', { to: recipient._id, isTyping: false });
        } else if (!activeConversation) {
            console.warn('[Chat] Cannot send: Active conversation not initialized');
        }
    };


    const onTyping = (text) => {
        setMessage(text);
        if (!isTyping && text.length > 0) {
            setIsTyping(true);
            socket.current.emit('typing', { to: recipient._id, isTyping: true });
        } else if (text.length === 0) {
            setIsTyping(false);
            socket.current.emit('typing', { to: recipient._id, isTyping: false });
        }
    };

    const renderMessage = ({ item }) => {
        const isMyMessage = item.from === (user.id || user._id);
        return (
            <View
                style={[
                    styles.messageWrapper,
                    isMyMessage ? styles.myMessageWrapper : styles.theirMessageWrapper,
                ]}
            >
                <View
                    style={[
                        styles.messageContainer,
                        isMyMessage ? styles.myMessage : styles.theirMessage,
                    ]}
                >
                    <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : {}]}>
                        {item.message}
                    </Text>
                    <Text style={styles.timeText}>
                        {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{recipient.name}</Text>
                    {showTyping ? (
                        <Text style={styles.typingText}>typing...</Text>
                    ) : (
                        <Text style={styles.statusText}>
                            {recipient.isOnline ? 'Online' : 'Offline'}
                        </Text>
                    )}
                </View>
            </View>

            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.messageList}
                inverted={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={message}
                        onChangeText={onTyping}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <MaterialCommunityIcons name="send" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerInfo: {
        marginLeft: 15,
    },
    headerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    statusText: {
        fontSize: 12,
        color: '#6B7280',
    },
    typingText: {
        fontSize: 12,
        color: '#10B981',
        fontWeight: '600',
    },
    messageList: {
        padding: 15,
    },
    messageWrapper: {
        width: '100%',
        marginVertical: 5,
        flexDirection: 'row',
    },
    myMessageWrapper: {
        justifyContent: 'flex-end',
    },
    theirMessageWrapper: {
        justifyContent: 'flex-start',
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
    },
    myMessage: {
        backgroundColor: '#007BFF',
        borderBottomRightRadius: 5,
    },
    theirMessage: {
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 5,
    },
    messageText: {
        fontSize: 15,
        color: '#1F2937',
    },
    myMessageText: {
        color: '#FFF',
    },
    timeText: {
        fontSize: 10,
        color: '#9CA3AF',
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 45,
        backgroundColor: '#F3F4F6',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        marginRight: 10,
    },
    sendButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Chat;
