import React, { useEffect, useState } from "react";
import {
  Search,
  Settings,
  Heart,
  ArrowLeft,
  Wifi,
  WifiOff,
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
            (total: number, conv: Conversation) => total + (conv.unreadCount || 0),
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

  // Set up socket listeners for real-time updates
  useEffect(() => {
    if (!socket || !isConnected || !currentUserId) return;

    // Listen for new messages to update conversation list
    socket.on("new_message", (message) => {
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

        // Create a new array to avoid mutation
        const newConversations = [...prevConversations];

        // Update the conversation with the new message
        const conversation = { ...newConversations[conversationIndex] };
        conversation.latestMessage = message;
        conversation.lastMessageAt = message.createdAt;

        // If message is from the other user, increment unread count
        if (message.senderId !== currentUserId) {
          conversation.unreadCount = (conversation.unreadCount || 0) + 1;
          setTotalUnreadCount((prev) => prev + 1);
        }

        // Remove the conversation from its current position
        newConversations.splice(conversationIndex, 1);

        // Add it to the top of the list
        return [conversation, ...newConversations];
      });
    });

    // Listen for read receipts
    socket.on("message_read_update", ({ matchId, readBy }) => {
      if (readBy === currentUserId) return; // Skip if we're the one who read

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#FF6B81] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="mb-4 p-4 bg-gray-100 rounded-full">
          <Heart size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-500 text-center mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#FF6B81] text-white rounded-lg"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button className="mr-2 md:hidden" onClick={() => navigate(-1)}>
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Messages</h1>
            {isConnected ? (
              <div className="ml-2 flex items-center text-xs text-green-600">
                <Wifi size={14} className="mr-1" />
                <span className="hidden sm:inline">Live</span>
              </div>
            ) : (
              <div className="ml-2 flex items-center text-xs text-amber-600">
                <WifiOff size={14} className="mr-1" />
                <span className="hidden sm:inline">Offline</span>
              </div>
            )}
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <Settings size={20} className="text-gray-700" />
          </button>
        </div>

        <div className="container mx-auto px-4 pb-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search messages"
              className="w-full bg-gray-100 border-none rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-10">
            <div className="mb-4 flex justify-center">
              <div className="p-4 bg-gray-100 rounded-full inline-flex">
                <Heart size={32} className="text-gray-400" />
              </div>
            </div>
            {searchQuery ? (
              <>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No matches found
                </h3>
                <p className="text-gray-500">
                  We couldn't find any messages matching "{searchQuery}"
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-500">
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
                  className="flex items-center p-3 rounded-xl hover:bg-gray-100 transition-colors"
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
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-gray-800">
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
                        className={`text-sm text-gray-600 flex-grow ${
                          conversation.unreadCount > 0 ? "font-medium" : ""
                        }`}
                      >
                        {isFromCurrentUser ? "You: " : ""}
                        {formatMessagePreview(
                          conversation.latestMessage.content
                        )}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 bg-[#FF6B81] text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
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

      {/* Connection status indicator */}
      {!isConnected && (
        <div className="fixed bottom-16 left-0 right-0 bg-amber-100 py-2 px-4 text-center text-sm text-amber-800 shadow-md">
          <div className="flex items-center justify-center">
            <WifiOff size={16} className="mr-2" />
            You're offline. Messages will send when you reconnect.
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
