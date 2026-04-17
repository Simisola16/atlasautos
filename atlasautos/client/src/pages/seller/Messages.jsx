import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { MessageCircle, Search, ChevronLeft, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatRelativeTime } from '../../utils/formatters';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Socket.IO needs the server root URL, not the /api path
const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');

const SellerMessages = () => {
  const { user, api } = useAuth();
  const navigate = useNavigate();
  
  // Normalize user ID - backend sends "id", MongoDB uses "_id"
  const userId = user?.id || user?._id;
  
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [typing, setTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return;
    
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('[SellerMessages] Socket connected:', newSocket.id);
      newSocket.emit('join', userId);
    });

    newSocket.on('new-message', (message) => {
      // Only add if it's from the OTHER user (we already optimistically added our own)
      const msgSenderId = message.sender?._id || message.sender?.id || message.sender;
      if (msgSenderId !== userId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    });

    newSocket.on('typing', ({ isTyping }) => {
      setTyping(isTyping);
    });

    newSocket.on('messages-read', () => {
      setMessages(prev => prev.map(m => ({ ...m, status: 'read' })));
    });
    
    newSocket.on('new-conversation', ({ chat }) => {
      setConversations(prev => {
        const existing = prev.findIndex(c => c._id === chat._id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = chat;
          return updated.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
        }
        return [chat, ...prev];
      });
    });

    return () => {
      newSocket.close();
    };
  }, [userId]);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chat/conversations');
      setConversations(response.data.chats);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (chat) => {
    setSelectedChat(chat);
    
    try {
      const response = await api.get(`/chat/${chat._id}/messages`);
      setMessages(response.data.messages);
      
      // Join chat room
      socket?.emit('join-chat', chat._id);
      
      // Mark as read
      socket?.emit('mark-read', { chatId: chat._id, userId });
      
      scrollToBottom();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const messageData = {
      chatId: selectedChat._id,
      content: newMessage.trim(),
      senderId: userId
    };

    // Optimistically add message
    const tempMessage = {
      _id: Date.now().toString(),
      ...messageData,
      sender: { _id: userId, fullName: user.fullName, profilePhoto: user.profilePhoto },
      createdAt: new Date().toISOString(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    scrollToBottom();

    // Send via socket
    socket?.emit('send-message', messageData);
  };

  const handleTyping = () => {
    socket?.emit('typing', { chatId: selectedChat?._id, isTyping: true });
    
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit('typing', { chatId: selectedChat?._id, isTyping: false });
    }, 1000);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const filteredConversations = conversations.filter(chat => {
    const otherUser = chat.buyer;
    return otherUser?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           chat.car?.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           chat.car?.model?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getOtherUser = (chat) => chat.buyer;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] bg-dark-50 rounded-xl border border-dark-100 overflow-hidden">
      <div className="flex h-full">
        {/* Conversations List */}
        <div className={`w-full md:w-80 border-r border-dark-100 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-4 border-b border-dark-100">
            <h2 className="text-lg font-semibold text-white mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-dark border border-dark-100 rounded-lg py-2 pl-9 pr-4 text-white placeholder-gray-500 text-sm focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(chat => {
                const otherUser = getOtherUser(chat);
                const unreadCount = chat.unreadCountSeller;
                
                return (
                  <button
                    key={chat._id}
                    onClick={() => selectConversation(chat)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-dark/50 transition-colors border-b border-dark-100 ${
                      selectedChat?._id === chat._id ? 'bg-dark/50 border-l-4 border-l-primary' : ''
                    }`}
                  >
                    {otherUser?.profilePhoto ? (
                      <img
                        src={otherUser.profilePhoto}
                        alt={otherUser.fullName}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium">
                          {otherUser?.fullName?.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-white truncate">{otherUser?.fullName}</p>
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(chat.lastMessageAt)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-primary truncate">
                        {chat.car?.year} {chat.car?.brand} {chat.car?.model}
                      </p>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-400 truncate pr-2">
                          {chat.lastMessage || 'No messages yet'}
                        </p>
                        {unreadCount > 0 && (
                          <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-white flex-shrink-0">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <EmptyState
                icon={MessageCircle}
                title="No messages yet"
                description="When buyers contact you, your conversations will appear here"
              />
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-dark-100 flex items-center gap-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden p-2 text-gray-400 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {getOtherUser(selectedChat)?.profilePhoto ? (
                <img
                  src={getOtherUser(selectedChat).profilePhoto}
                  alt={getOtherUser(selectedChat).fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-medium">
                    {getOtherUser(selectedChat)?.fullName?.charAt(0)}
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <p className="font-medium text-white">{getOtherUser(selectedChat)?.fullName}</p>
                <p className="text-xs text-primary">
                  {selectedChat.car?.year} {selectedChat.car?.brand} {selectedChat.car?.model}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                const msgSenderId = message.sender?._id || message.sender?.id || message.sender;
                const isMe = msgSenderId === userId;
                const prevSenderId = index > 0 ? (messages[index - 1].sender?._id || messages[index - 1].sender?.id || messages[index - 1].sender) : null;
                const showAvatar = index === 0 || prevSenderId !== msgSenderId;
                
                return (
                  <div
                    key={message._id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : ''}`}>
                      {!isMe && showAvatar && (
                        message.sender?.profilePhoto ? (
                          <img
                            src={message.sender.profilePhoto}
                            alt={message.sender.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs text-white">{message.sender?.fullName?.charAt(0)}</span>
                          </div>
                        )
                      )}
                      
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isMe
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-dark-100 text-white rounded-bl-md'
                        }`}
                      >
                        <p>{message.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                          <span className="text-xs opacity-70">
                            {formatRelativeTime(message.createdAt)}
                          </span>
                          {isMe && (
                            message.status === 'read' ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-dark-100 px-4 py-2 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-dark-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendMessage();
                    handleTyping();
                  }}
                  placeholder="Type a message..."
                  className="flex-1 bg-dark border border-dark-100 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-primary hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <EmptyState
              icon={MessageCircle}
              title="Select a conversation"
              description="Choose a conversation from the list to start chatting"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerMessages;
