import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MoreVertical, Image, Send, Info, Mic, Smile } from 'lucide-react';

const matchData = {
    id: 1,
    name: 'Emma Wilson',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isOnline: true,
    lastActive: 'Active now',
    matchDate: 'May 15, 2025',
    matchPercentage: 96
};

const initialMessages = [
    {
        id: 1,
        senderId: 'match',
        text: 'Hi there! I noticed we both love photography. What kind of photos do you usually take?',
        timestamp: 'Yesterday, 2:30 PM',
        isRead: true
    },
    {
        id: 2,
        senderId: 'user',
        text: 'Hey Emma! Nice to connect with you. I mostly do street photography and landscapes when I travel. How about you?',
        timestamp: 'Yesterday, 2:45 PM',
        isRead: true
    },
    {
        id: 3,
        senderId: 'match',
        text: 'That sounds amazing! I\'m more into portrait photography, but I\'ve been wanting to try landscapes. Do you have any favorite spots around the city?',
        timestamp: 'Yesterday, 3:01 PM',
        isRead: true
    },
    {
        id: 4,
        senderId: 'user',
        text: 'Definitely! Golden Gate Park has some great spots, especially around the Japanese Garden. Also, the view from Twin Peaks is incredible for cityscapes.',
        timestamp: 'Yesterday, 3:10 PM',
        isRead: true
    },
    {
        id: 5,
        senderId: 'match',
        text: 'I love the Japanese Garden! I\'ve never been to Twin Peaks though.Maybe we could check it out sometime?',
        timestamp: 'Yesterday, 3:15 PM',
        isRead: true
    },
    {
        id: 6,
        senderId: 'match',
        text: 'Also, do you have a favorite coffee shop? I\'m always looking for new places to try.',
        timestamp: 'Today, 12:45 PM',
        isRead: false
    }
];

const quickReplies = [
    "I'd love to show you Twin Peaks sometime!",
    "My favorite coffee shop is Ritual Coffee Roasters. Have you been there?",
    "When did you get into portrait photography?",
    "Would you like to grab coffee this weekend?"
];

const Conversation: React.FC = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (messageInput.length > 0) {
            setIsTyping(true);
        } else {
            setIsTyping(false);
        }
    }, [messageInput]);

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            senderId: 'user',
            text: messageInput.trim(),
            timestamp: 'Just now',
            isRead: false
        };

        setMessages([...messages, newMessage]);
        setMessageInput('');

        setTimeout(() => {
            const replyMessage = {
                id: messages.length + 2,
                senderId: 'match',
                text: "That's a great suggestion! I'd love to try it out. When are you usually free?",
                timestamp: 'Just now',
                isRead: false
            };

            setMessages(prev => [...prev, replyMessage]);
        }, 3000);
    };

    const handleSelectFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log('Selected file:', e.target.files[0]);
        }
    };

    const handleQuickReply = (reply: string) => {
        setMessageInput(reply);
    };

    const formatMessageDate = (date: string) => {
        if (date.startsWith('Just now')) return date;
        return date;
    };

    const messagesByDate = messages.reduce((groups: { [key: string]: typeof messages }, message) => {
        const dateStr = message.timestamp.split(',')[0];
        if (!groups[dateStr]) {
            groups[dateStr] = [];
        }
        groups[dateStr].push(message);
        return groups;
    }, {});

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <button className="mr-3" onClick={() => window.history.back()}>
                            <ArrowLeft size={24} className="text-gray-700" />
                        </button>
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => setShowInfo(!showInfo)}
                        >
                            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                                <img
                                    src={matchData.photo}
                                    alt={matchData.name}
                                    className="w-full h-full object-cover"
                                />
                                {matchData.isOnline && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                            </div>
                            <div>
                                <h2 className="font-medium text-gray-800">{matchData.name}</h2>
                                <p className="text-xs text-gray-500">{matchData.lastActive}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Info size={20} className="text-gray-700" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <MoreVertical size={20} className="text-gray-700" />
                        </button>
                    </div>
                </div>
            </header>

            <div
                className={`bg-white border-b border-gray-200 overflow-hidden transition-all duration-300 ${showInfo ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden mb-2">
                                <img
                                    src={matchData.photo}
                                    alt={matchData.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="font-bold text-gray-800">{matchData.name}</h3>
                        </div>

                        <div className="text-center">
                            <div className="font-bold text-2xl text-[#FF6B81]">{matchData.matchPercentage}%</div>
                            <div className="text-sm text-gray-500">Match</div>
                        </div>

                        <div className="text-center">
                            <div className="font-medium text-gray-800">{matchData.matchDate}</div>
                            <div className="text-sm text-gray-500">Matched on</div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-4">
                        <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                            View Profile
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-[#FF6B81] text-[#FF6B81] hover:bg-[#FF6B81]/5 transition-colors">
                            Unmatch
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 pb-20">
                <div className="container mx-auto max-w-3xl space-y-6">
                    <div className="text-center">
                        <div className="bg-white/70 backdrop-blur-sm inline-block px-4 py-2 rounded-lg text-sm text-gray-500">
                            You matched with {matchData.name} on {matchData.matchDate}
                        </div>
                    </div>

                    {Object.entries(messagesByDate).map(([date, dateMessages]) => (
                        <div key={date} className="space-y-4">
                            <div className="flex items-center justify-center">
                                <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600">
                                    {date}
                                </div>
                            </div>

                            {dateMessages.map(message => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {message.senderId === 'match' && (
                                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-1 flex-shrink-0">
                                            <img
                                                src={matchData.photo}
                                                alt={matchData.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[75%] ${message.senderId === 'user'
                                            ? 'bg-[#FF6B81] text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
                                            : 'bg-white text-gray-800 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl'
                                            } p-3 shadow-sm relative`}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                        <span className="text-xs text-right block mt-1 opacity-70">
                                            {formatMessageDate(message.timestamp.split(', ')[1])}
                                            {message.senderId === 'user' && (
                                                <span className="ml-1">
                                                    {message.isRead ? '✓✓' : '✓'}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-1 flex-shrink-0">
                                <img
                                    src={matchData.photo}
                                    alt={matchData.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="bg-white p-3 rounded-2xl shadow-sm">
                                <div className="flex space-x-1.5">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {messages.length > 0 && messages[messages.length - 1].senderId === 'match' && (
                        <div className="mt-4 overflow-x-auto scrollbar-hide py-2">
                            <div className="flex space-x-2 w-max">
                                {quickReplies.map((reply, index) => (
                                    <button
                                        key={index}
                                        className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap transition-colors"
                                        onClick={() => handleQuickReply(reply)}
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="bg-white border-t border-gray-200 py-3 px-4 sticky bottom-0 z-40">
                <div className="container mx-auto max-w-3xl">
                    <div className="flex items-center">
                        <button
                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                            onClick={handleSelectFile}
                        >
                            <Image size={22} />
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </button>

                        <div className="flex-grow mx-2 bg-gray-100 rounded-full flex items-center">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-grow px-4 py-2.5 bg-transparent focus:outline-none"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button className="p-2 text-gray-500">
                                <Smile size={22} />
                            </button>
                        </div>

                        {messageInput ? (
                            <button
                                className="p-2 text-[#FF6B81] hover:text-[#D86D72] transition-colors"
                                onClick={handleSendMessage}
                            >
                                <Send size={22} />
                            </button>
                        ) : (
                            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                                <Mic size={22} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Conversation;