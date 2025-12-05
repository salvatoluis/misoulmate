import React, { useEffect, useState } from "react";
import {
  Search,
  Settings,
  Heart,
  ArrowLeft,
  Wifi,
  WifiOff,
  MessageSquare,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import messageService from "@/services/message.service";
import { useSocket } from "@/contexts/SocketContext";

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    profile: {
      name: string;
      photos: string[];
    };
    isOnline: boolean;
  };
  matchPercentage: number;
  createdAt: string;
  lastMessageAt: string;
  latestMessage: {
    id: string;
    matchId: string;
    senderId: string;
    content: string;
    createdAt: string;
    isRead: boolean;
    sender: {
      id: string;
      profile: {
        name: string;
      };
    };
  };
  unreadCount: number;
}

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  let currentUserId: string | null = null;
  try {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const parsedAuth = JSON.parse(authData);
      currentUserId = parsedAuth.user?.id || null;
    }
  } catch (error) {
    console.error("Error getting user ID from localStorage:", error);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await messageService.getConversations({
          page: 1,
          limit: 20,
        });
        setConversations(res.conversations || []);

        const unreadCount =
          res.conversations?.reduce(
            (total: number, conv: Conversation) =>
              total + (conv.unreadCount || 0),
            0
          ) || 0;
        setTotalUnreadCount(unreadCount);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setError("Failed to load conversations. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!socket || !isConnected || !currentUserId) return;

    socket.on("new_message", (message) => {
      // Check if this is a new message before updating
      const messageContent = message.content;
      const messageSenderId = message.senderId;

      setConversations((prevConversations) => {
        // Find if conversation exists
        const conversationIndex = prevConversations.findIndex(
          (conv) => conv.id === message.matchId
        );

        if (conversationIndex === -1) {
          // If this is a new conversation, we might need to fetch it
          // For now, we'll ignore as we don't have all the conversation data
          return prevConversations;
        }

        const conversation = prevConversations[conversationIndex];

        // Don't update if this is the same message we already have
        if (
          conversation.latestMessage.content === messageContent &&
          conversation.latestMessage.senderId === messageSenderId &&
          Math.abs(
            new Date(conversation.latestMessage.createdAt).getTime() -
              new Date(message.createdAt).getTime()
          ) < 5000
        ) {
          return prevConversations;
        }

        // Create a new array to avoid mutation
        const newConversations = [...prevConversations];

        // Update the conversation with the new message
        const updatedConversation = { ...newConversations[conversationIndex] };
        updatedConversation.latestMessage = message;
        updatedConversation.lastMessageAt = message.createdAt;

        // If message is from the other user, increment unread count
        if (message.senderId !== currentUserId) {
          updatedConversation.unreadCount =
            (updatedConversation.unreadCount || 0) + 1;
          setTotalUnreadCount((prev) => prev + 1);
        }

        // Remove the conversation from its current position
        newConversations.splice(conversationIndex, 1);

        // Add it to the top of the list
        return [updatedConversation, ...newConversations];
      });
    });

    socket.on("message_read_update", ({ matchId, readBy }) => {
      if (readBy === currentUserId) return;

      setConversations((prevConversations) =>
        prevConversations.map((conv) => {
          if (conv.id === matchId) {
            // Calculate how many unread messages were cleared
            const clearedCount = conv.unreadCount || 0;

            // Update total unread count
            if (clearedCount > 0) {
              setTotalUnreadCount((prev) => Math.max(0, prev - clearedCount));
            }

            // Clear unread count for this conversation
            return {
              ...conv,
              unreadCount: 0,
              latestMessage: {
                ...conv.latestMessage,
                isRead: true,
              },
            };
          }
          return conv;
        })
      );
    });

    // Listen for user status changes
    socket.on("user_status_change", ({ userId, isOnline }) => {
      setConversations((prevConversations) =>
        prevConversations.map((conv) => {
          if (conv.otherUser.id === userId) {
            return {
              ...conv,
              otherUser: {
                ...conv.otherUser,
                isOnline,
              },
            };
          }
          return conv;
        })
      );
    });

    return () => {
      socket.off("new_message");
      socket.off("message_read_update");
      socket.off("user_status_change");
    };
  }, [socket, isConnected, currentUserId]);

  const filteredConversations = conversations.filter((conversation) =>
    conversation.otherUser.profile.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const formatMessagePreview = (message: string) => {
    return message.length > 40 ? message.substring(0, 40) + "..." : message;
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "long" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-gray-700 border-t-[#FF6B9D] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart size={24} className="text-[#FF6B9D] fill-[#FF6B9D] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] p-4">
        <div className="mb-4 p-4 bg-gray-900 rounded-full">
          <Heart size={32} className="text-[#FF6B9D]" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-400 text-center mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#FF6B9D] hover:bg-[#FF4D88] text-white rounded-lg transition-all"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#1a1a1a] z-40 border-b border-gray-800">
        <div className="px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF6B9D] p-1.5 rounded-full">
              <MessageSquare size={16} className="text-white fill-white" />
            </div>
            <h1 className="text-lg font-bold text-white">messages</h1>
            {isConnected ? (
              <div className="ml-2 flex items-center text-xs text-green-500">
                <Wifi size={14} className="mr-1" />
                <span className="hidden sm:inline">Live</span>
              </div>
            ) : (
              <div className="ml-2 flex items-center text-xs text-amber-500">
                <WifiOff size={14} className="mr-1" />
                <span className="hidden sm:inline">Offline</span>
              </div>
            )}
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-800 transition-colors">
            <Settings size={20} className="text-gray-300" />
          </button>
        </div>

        <div className="px-4 pb-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search messages"
              className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] transition-all text-white placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 pt-32 pb-24 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-10">
            <div className="mb-4 flex justify-center">
              <div className="p-4 bg-gray-900 rounded-full inline-flex">
                <Heart size={32} className="text-[#FF6B9D]" />
              </div>
            </div>
            {searchQuery ? (
              <>
                <h3 className="text-lg font-medium text-white mb-2">
                  No matches found
                </h3>
                <p className="text-gray-400">
                  We couldn't find any messages matching "{searchQuery}"
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-white mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-400">
                  When you match and message with others, you'll see your
                  conversations here.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conversation) => {
              const isFromCurrentUser =
                conversation.latestMessage?.senderId === currentUserId;

              return (
                <Link
                  key={conversation.id}
                  to={`/messages/${conversation.id}`}
                  className="flex items-center p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all"
                >
                  <div className="relative mr-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden">
                      <img
                        src={
                          conversation.otherUser.profile.photos[0] ||
                          "/default-avatar.png"
                        }
                        alt={conversation.otherUser.profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {conversation.otherUser.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-white">
                        {conversation.otherUser.profile.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(
                          conversation.latestMessage.createdAt
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <p
                        className={`text-sm text-gray-400 flex-grow ${
                          conversation.unreadCount > 0 ? "font-medium text-gray-300" : ""
                        }`}
                      >
                        {isFromCurrentUser ? "You: " : ""}
                        {formatMessagePreview(
                          conversation.latestMessage.content
                        )}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 bg-[#FF6B9D] text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 pb-safe z-40">
        <div className="flex items-center justify-around py-3 px-4">
          {/* Discover */}
          <button
            onClick={() => navigate('/for-you')}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <div className="text-gray-400">
              <Heart size={24} />
            </div>
            <span className="text-xs text-gray-400">Discover</span>
          </button>

          {/* Matches */}
          <button
            onClick={() => navigate('/matches')}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <div className="text-gray-400">
              <Sparkles size={24} />
            </div>
            <span className="text-xs text-gray-400">Matches</span>
          </button>

          {/* Messages */}
          <button className="flex flex-col items-center gap-1 py-2 px-4">
            <div className="text-[#FF6B9D]">
              <MessageSquare size={24} className="fill-[#FF6B9D]" />
            </div>
            <span className="text-xs text-[#FF6B9D] font-medium">Messages</span>
          </button>

          {/* Referrals */}
          <button
            onClick={() => navigate('/referrals')}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <div className="text-gray-400">
              <Users size={24} />
            </div>
            <span className="text-xs text-gray-400">Referrals</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
