import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Search, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatRelativeTime } from '../../utils/formatters';

const Conversations = () => {
  const { user, api } = useAuth();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredConversations = conversations.filter(chat => {
    const otherUser = chat.seller;
    return otherUser?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherUser?.dealershipName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           chat.car?.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           chat.car?.model?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Messages</h1>
          <p className="text-gray-400 mt-1">
            Your conversations with sellers
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-dark-50 border border-dark-100 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-primary transition-colors"
          />
        </div>

        {/* Conversations List */}
        {filteredConversations.length > 0 ? (
          <div className="space-y-3">
            {filteredConversations.map(chat => {
              const otherUser = chat.seller;
              const unreadCount = chat.unreadCountBuyer;
              
              return (
                <button
                  key={chat._id}
                  onClick={() => navigate(`/chat/${chat._id}`)}
                  className="w-full bg-dark-50 rounded-xl p-4 border border-dark-100 hover:border-primary/30 transition-colors flex items-center gap-4"
                >
                  {/* Avatar */}
                  {otherUser?.profilePhoto ? (
                    <img
                      src={otherUser.profilePhoto}
                      alt={otherUser.dealershipName || otherUser.fullName}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-lg">
                        {(otherUser?.dealershipName || otherUser?.fullName)?.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white truncate">
                        {otherUser?.dealershipName || otherUser?.fullName}
                      </p>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatRelativeTime(chat.lastMessageAt)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-primary truncate">
                      {chat.car?.year} {chat.car?.brand} {chat.car?.model}
                    </p>
                    
                    <p className="text-sm text-gray-400 truncate mt-1">
                      {chat.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                  
                  {/* Unread Badge */}
                  {unreadCount > 0 && (
                    <div className="flex-shrink-0">
                      <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-white">
                        {unreadCount}
                      </span>
                    </div>
                  )}
                  
                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={MessageCircle}
            title={searchQuery ? 'No matches found' : 'No messages yet'}
            description={
              searchQuery
                ? 'Try adjusting your search query'
                : 'Start chatting with sellers by visiting a car listing and clicking "Chat with Seller"'
            }
            actionLabel="Browse Cars"
            actionLink="/browse"
          />
        )}
      </div>
    </div>
  );
};

export default Conversations;
