import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Image, Paperclip, MoreVertical } from 'lucide-react';
import { matchService } from '@/services';
import messageService from '@/services/message.service';

const ConversationPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    let currentUserId: string | null = null;
    const authData = localStorage.getItem('auth');
    if (authData) {
        const parsedAuth = JSON.parse(authData);
        currentUserId = parsedAuth.user?.id || null;
    }

    type Message = {
        id: string;
        matchId: string;
        senderId: string;
        content: string;
        createdAt: string;
        isRead: boolean;
        isSending?: boolean;
        error?: boolean;
        mediaUrl?: string;
        mediaType?: string | null;
        sender?: {
            id: string;
            profile?: {
                name: string;
                photos: string[];
            };
        };
    };

    const [messages, setMessages] = useState<Message[]>([]);
    type User = {
        id: string;
        isOnline?: boolean;
        profile?: any;
    };

    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [messageText, setMessageText] = useState('');
    const [sending, setSending] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 50,
        pages: 0,
    });
    const [hasMore, setHasMore] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messageListRef = useRef<HTMLDivElement | null>(null);
    const [previousScrollHeight, setPreviousScrollHeight] = useState(0);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const matchData = await matchService.getMatchById(id);
                setOtherUser(matchData.otherUser);

                const response = await messageService.getMessagesByMatchId(id as string);

                setMessages(response.messages.reverse());
                setPagination(response.pagination);
                setHasMore(response.pagination.page < response.pagination.pages);

                const hasUnreadFromOthers = response.messages.some(
                    (msg: Message) => !msg.isRead && msg.senderId !== currentUserId
                );

                if (hasUnreadFromOthers) {
                    await messageService.markAllAsRead(id as string);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching conversation data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, currentUserId]);

    useEffect(() => {
        if (!loading && messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [loading]);

    useEffect(() => {
        if (previousScrollHeight > 0 && messageListRef.current) {
            const newScrollHeight = messageListRef.current.scrollHeight;
            messageListRef.current.scrollTop = newScrollHeight - previousScrollHeight;
        }
    }, [previousScrollHeight]);

    const loadMoreMessages = async () => {
        if (!hasMore || loadingMore || !messages.length) return;

        try {
            setLoadingMore(true);

            if (messageListRef.current) {
                setPreviousScrollHeight(messageListRef.current.scrollHeight);
            }

            const response = await messageService.getMessagesByMatchId(
                id as string,
            );

            setMessages(prevMessages => [...response.messages.reverse(), ...prevMessages]);
            setPagination(response.pagination);
            setHasMore(response.pagination.page < response.pagination.pages);
            setLoadingMore(false);
        } catch (error) {
            console.error('Error loading more messages:', error);
            setLoadingMore(false);
        }
    };

    const handleSendMessage = async () => {
        if (!messageText.trim() || sending) return;

        const tempId = `temp-${Date.now()}`;
        try {
            setSending(true);

            const tempMessage: Message = {
                id: tempId,
                matchId: id as string,
                senderId: currentUserId as string,
                content: messageText,
                createdAt: new Date().toISOString(),
                isRead: true,
                isSending: true
            };

            setMessages(prevMessages => [...prevMessages, tempMessage]);
            setMessageText('');

            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

            const response = await messageService.sendMessage(id as string, messageText);

            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === tempId ? response : msg
                )
            );

            setSending(false);
        } catch (error) {
            console.error('Error sending message:', error);
            setSending(false);

            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === tempId ? { ...msg, error: true } : msg
                )
            );
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const groupMessagesByDate = () => {
        const groups: {
            date: string;
            messages: Message[];
        }[] = [];

        let currentDate: string | null = null;
        let currentGroup: Message[] = [];

        messages.forEach(message => {
            const messageDate = new Date(message.createdAt).toDateString();

            if (messageDate !== currentDate) {
                if (currentGroup.length > 0) {
                    groups.push({
                        date: currentDate as string,
                        messages: currentGroup
                    });
                }
                currentDate = messageDate;
                currentGroup = [message];
            } else {
                currentGroup.push(message);
            }
        });

        if (currentGroup.length > 0 && currentDate) {
            groups.push({
                date: currentDate,
                messages: currentGroup
            });
        }

        return groups;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const messageGroups = groupMessagesByDate();

    return (
        <div className="flex flex-col h-[90vh] bg-gray-50">
            <header className="bg-white shadow-sm py-3 px-4 flex items-center gap-3 z-10">
                <button
                    onClick={() => navigate('/messages')}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>

                {otherUser && (
                    <div className="flex items-center gap-3 flex-grow">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img
                                    src={otherUser.profile?.photos?.[0] || '/default-avatar.png'}
                                    alt={otherUser.profile?.name || 'Match'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {otherUser.isOnline && (
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-800">
                                {otherUser.profile?.name || 'Match'}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {otherUser.isOnline ? 'Online' : 'Last active recently'}
                            </p>
                        </div>
                    </div>
                )}

                <button className="p-2 rounded-full hover:bg-gray-100">
                    <MoreVertical size={20} className="text-gray-700" />
                </button>
            </header>

            {/* Messages list */}
            <div
                ref={messageListRef}
                className="flex-grow overflow-y-auto px-4 py-6"
            >
                {hasMore && (
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={loadMoreMessages}
                            disabled={loadingMore}
                            className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                            {loadingMore ? 'Loading...' : 'Load older messages'}
                        </button>
                    </div>
                )}

                {messageGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-6">
                        <div className="flex justify-center mb-4">
                            <div className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
                                {formatDate(group.date)}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {group.messages.map((message) => {
                                const isCurrentUser = message.senderId === currentUserId;

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] ${message.error ? 'opacity-50' : ''}`}>
                                            {/* Message bubble */}
                                            <div className={`rounded-2xl px-4 py-2 ${isCurrentUser
                                                ? 'bg-green-600 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                                }`}>
                                                {message.mediaUrl && (
                                                    <div className="mb-2 rounded-lg overflow-hidden">
                                                        {message.mediaType === 'image' || !message.mediaType ? (
                                                            <img
                                                                src={message.mediaUrl}
                                                                alt="Media"
                                                                className="w-full h-auto"
                                                            />
                                                        ) : message.mediaType === 'video' ? (
                                                            <video
                                                                src={message.mediaUrl}
                                                                controls
                                                                className="w-full h-auto"
                                                            />
                                                        ) : (
                                                            <div className="px-3 py-2 bg-gray-100 text-gray-700 rounded">
                                                                Attachment: {message.mediaUrl.split('/').pop()}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <p>{message.content}</p>
                                            </div>

                                            {/* Time and status */}
                                            <div className={`mt-1 flex items-center text-xs ${isCurrentUser ? 'justify-end text-gray-500' : 'justify-start text-gray-400'
                                                }`}>
                                                <span>{formatTime(message.createdAt)}</span>

                                                {isCurrentUser && (
                                                    <span className="ml-1">
                                                        {message.isSending ? '• Sending' : message.isRead ? '• Read' : '• Sent'}
                                                    </span>
                                                )}

                                                {message.error && (
                                                    <span className="ml-1 text-red-500">• Failed</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="bg-white border-t border-gray-200 p-3">
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                        <Paperclip size={20} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                        <Image size={20} />
                    </button>

                    <div className="flex-grow relative">
                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                            placeholder="Type a message..."
                            className="w-full bg-gray-100 rounded-full py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-green-600/30"
                        />
                    </div>

                    <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim() || sending}
                        className={`p-2.5 rounded-full flex items-center justify-center ${messageText.trim() && !sending
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-400'
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConversationPage;