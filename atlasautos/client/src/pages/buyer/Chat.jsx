import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  ChevronLeft, 
  Check, 
  CheckCheck, 
  Send, 
  Car,
  Phone,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatPrice, formatRelativeTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Socket.IO needs the server root URL, not the /api path
const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');

const Chat = () => {
  const { chatId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, api } = useAuth();
  
  // Normalize user ID - backend sends "id", MongoDB uses "_id"
  const userId = user?.id || user?._id;
  
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket
  useEffect(() => {
    if (!userId) return;
    
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('[Chat] Socket connected:', newSocket.id);
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

    return () => {
      newSocket.close();
    };
  }, [userId]);

  // Fetch chat data
  useEffect(() => {
    if (chatId === 'new') {
      // Create new chat
      const carId = searchParams.get('carId');
      if (carId) {
        createNewChat(carId);
      } else {
        navigate('/conversations');
      }
    } else {
      fetchChatData();
    }
  }, [chatId]);

  const createNewChat = async (carId) => {
    try {
      setLoading(true);
      const response = await api.post('/chat', { carId });
      const newChatId = response.data.chat._id;
      navigate(`/chat/${newChatId}`, { replace: true });
    } catch (error) {
      console.error('Failed to create chat:', error);
      toast.error('Failed to start conversation');
      navigate('/conversations');
    }
  };

  const fetchChatData = async () => {
    try {
      setLoading(true);
      
      // Fetch chat details and messages in parallel
      const [chatResponse, messagesResponse] = await Promise.all([
        api.get('/chat/conversations'),
        api.get(`/chat/${chatId}/messages`)
      ]);
      
      const currentChat = chatResponse.data.chats.find(c => c._id === chatId);
      setChat(currentChat);
      setMessages(messagesResponse.data.messages);
      
      // Join chat room
      socket?.emit('join-chat', chatId);
      
      // Mark as read
      socket?.emit('mark-read', { chatId, userId });
      
      scrollToBottom();
    } catch (error) {
      console.error('Failed to fetch chat:', error);
      toast.error('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chat) return;

    setSending(true);
    
    const messageData = {
      chatId: chat._id,
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
    
    setSending(false);
  };

  const handleTyping = () => {
    socket?.emit('typing', { chatId: chat?._id, isTyping: true });
    
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit('typing', { chatId: chat?._id, isTyping: false });
    }, 1000);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getOtherUser = () => chat?.seller;

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4">
        <p className="text-gray-400">Conversation not found</p>
        <button
          onClick={() => navigate('/conversations')}
          className="mt-4 text-primary hover:text-primary-400"
        >
          Back to Messages
        </button>
      </div>
    );
  }

  const otherUser = getOtherUser();

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Header */}
      <header className="sticky top-16 z-30 bg-dark-50 border-b border-dark-100">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/conversations')}
              className="p-2 -ml-2 text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            {otherUser?.profilePhoto ? (
              <img
                src={otherUser.profilePhoto}
                alt={otherUser.dealershipName || otherUser.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-medium">
                  {(otherUser?.dealershipName || otherUser?.fullName)?.charAt(0)}
                </span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">
                {otherUser?.dealershipName || otherUser?.fullName}
              </p>
              <p className="text-xs text-gray-400">
                {otherUser?.isVerified ? 'Verified Seller' : 'Seller'}
              </p>
            </div>
            
            <a
              href={`tel:${otherUser?.phoneNumber}`}
              className="p-2 text-gray-400 hover:text-primary transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
          
          {/* Car Info Bar */}
          <div className="mt-3 pt-3 border-t border-dark-100">
            <button
              onClick={() => navigate(`/car/${chat.car?._id}`)}
              className="flex items-center gap-3 w-full text-left"
            >
              <img
                src={chat.car?.coverPhoto}
                alt={`${chat.car?.brand} ${chat.car?.model}`}
                className="w-12 h-9 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  {chat.car?.year} {chat.car?.brand} {chat.car?.model}
                </p>
                <p className="text-sm text-primary">
                  {formatPrice(chat.car?.price)}
                </p>
              </div>
              <Car className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto py-4">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No messages yet</p>
              <p className="text-gray-500 text-sm mt-1">Start the conversation!</p>
            </div>
          )}
          
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
                <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : ''}`}>
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
                    className={`px-4 py-2.5 rounded-2xl ${
                      isMe
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-dark-100 text-white rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
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
              <div className="bg-dark-100 px-4 py-2.5 rounded-2xl rounded-bl-md">
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
      </main>

      {/* Input */}
      <footer className="sticky bottom-0 bg-dark-50 border-t border-dark-100 pb-safe">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
                handleTyping();
              }}
              placeholder="Type a message..."
              className="flex-1 bg-dark border border-dark-100 rounded-full py-3 px-5 text-white placeholder-gray-500 focus:border-primary transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="w-12 h-12 bg-primary hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
