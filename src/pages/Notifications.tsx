// src/pages/NotificationPage.tsx
import React, { useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Bell, Calendar, Settings, Trash2, Check, Users, Star } from 'lucide-react';

// Define types for notifications
interface Notification {
    id: string;
    type: 'match' | 'message' | 'like' | 'view' | 'event' | 'system';
    content: string;
    timestamp: string;
    isRead: boolean;
    data?: {
        userId?: number;
        name?: string;
        photo?: string;
        messagePreview?: string;
        eventDate?: string;
    };
}

// Dummy notification data
const initialNotifications: Notification[] = [
    {
        id: 'n1',
        type: 'match',
        content: 'You and Emma matched!',
        timestamp: '15m ago',
        isRead: false,
        data: {
            userId: 1,
            name: 'Emma',
            photo: '/images/profile-1.jpg'
        }
    },
    {
        id: 'n2',
        type: 'message',
        content: 'New message from Michael',
        timestamp: '45m ago',
        isRead: false,
        data: {
            userId: 2,
            name: 'Michael',
            photo: '/images/profile-2.jpg',
            messagePreview: 'Hey! I noticed we both love hiking...'
        }
    },
    {
        id: 'n3',
        type: 'like',
        content: 'Sophia liked your profile',
        timestamp: '2h ago',
        isRead: true,
        data: {
            userId: 3,
            name: 'Sophia',
            photo: '/images/profile-3.jpg'
        }
    },
    {
        id: 'n4',
        type: 'view',
        content: '5 people viewed your profile today',
        timestamp: '3h ago',
        isRead: true
    },
    {
        id: 'n5',
        type: 'message',
        content: 'New message from James',
        timestamp: '5h ago',
        isRead: true,
        data: {
            userId: 4,
            name: 'James',
            photo: '/images/profile-4.jpg',
            messagePreview: 'Thanks for the movie recommendation!'
        }
    },
    {
        id: 'n6',
        type: 'system',
        content: 'Your profile is getting a lot of attention! Add more photos to increase your matches.',
        timestamp: 'Yesterday',
        isRead: true
    },
    {
        id: 'n7',
        type: 'match',
        content: 'You and Olivia matched!',
        timestamp: 'Yesterday',
        isRead: true,
        data: {
            userId: 5,
            name: 'Olivia',
            photo: '/images/profile-5.jpg'
        }
    },
    {
        id: 'n8',
        type: 'event',
        content: 'Singles Mixer in San Francisco',
        timestamp: '2 days ago',
        isRead: true,
        data: {
            eventDate: 'Saturday, May 25 • 7 PM'
        }
    },
    {
        id: 'n9',
        type: 'system',
        content: 'Welcome to HeartMatch! Complete your profile to start matching.',
        timestamp: '1 week ago',
        isRead: true
    },
    {
        id: 'n10',
        type: 'like',
        content: 'Daniel liked your profile',
        timestamp: '1 week ago',
        isRead: true,
        data: {
            userId: 6,
            name: 'Daniel',
            photo: '/images/profile-6.jpg'
        }
    }
];

const NotificationPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // Filter notifications based on the active filter
    const filteredNotifications = activeFilter === 'all'
        ? notifications
        : notifications.filter(notif => !notif.isRead);

    // Group notifications by date
    const groupedNotifications = filteredNotifications.reduce((groups: { [key: string]: Notification[] }, notification) => {
        // Extract date from timestamp (just for demo purposes - in a real app you'd have actual dates)
        const dateKey = notification.timestamp.includes('ago') || notification.timestamp === 'Yesterday'
            ? 'Today'
            : notification.timestamp;

        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }

        groups[dateKey].push(notification);
        return groups;
    }, {});

    // Handle marking a notification as read
    const markAsRead = (id: string) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, isRead: true } : notif
        ));
    };

    // Handle marking all notifications as read
    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    };

    // Handle clearing all notifications
    const clearAllNotifications = () => {
        setNotifications([]);
        setShowClearConfirm(false);
    };

    // Get notification icon based on type
    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'match':
                return <Heart size={20} className="text-[#FF6B81]" />;
            case 'message':
                return <MessageCircle size={20} className="text-[#A8E0D7]" />;
            case 'like':
                return <Star size={20} className="text-[#FFE066]" />;
            case 'view':
                return <Users size={20} className="text-[#8B5CF6]" />;
            case 'event':
                return <Calendar size={20} className="text-[#3B82F6]" />;
            case 'system':
                return <Bell size={20} className="text-[#9CA3AF]" />;
            default:
                return <Bell size={20} className="text-[#9CA3AF]" />;
        }
    };

    // Count unread notifications
    const unreadCount = notifications.filter(notif => !notif.isRead).length;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <button className="mr-2 md:hidden">
                            <ArrowLeft size={24} className="text-gray-700" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
                        {unreadCount > 0 && (
                            <span className="ml-2 bg-[#FF6B81] text-white text-xs rounded-full px-2 py-0.5">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                        >
                            <Check size={18} className="inline-block mr-1" />
                            Mark all read
                        </button>
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => setShowClearConfirm(true)}
                        >
                            <Trash2 size={18} className="text-gray-500" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Settings size={18} className="text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="container mx-auto px-4 pb-4 flex items-center gap-4">
                    <button
                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${activeFilter === 'all'
                                ? 'bg-[#FF6B81] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } transition-colors`}
                        onClick={() => setActiveFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${activeFilter === 'unread'
                                ? 'bg-[#FF6B81] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } transition-colors`}
                        onClick={() => setActiveFilter('unread')}
                    >
                        Unread
                        {unreadCount > 0 && (
                            <span className="ml-1 inline-block bg-white text-[#FF6B81] text-xs rounded-full px-1.5">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Notification list */}
            <div className="container mx-auto px-4 pt-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Bell size={28} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No notifications</h3>
                        <p className="text-gray-500">
                            You're all caught up! We'll notify you when you have new activity.
                        </p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Check size={28} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No unread notifications</h3>
                        <p className="text-gray-500">
                            You've read all your notifications. Check back later for updates!
                        </p>
                        <button
                            className="mt-4 px-4 py-2 text-[#FF6B81] font-medium"
                            onClick={() => setActiveFilter('all')}
                        >
                            View all notifications
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
                            <div key={date}>
                                {/* Date header */}
                                <div className="text-sm font-medium text-gray-500 mb-3">
                                    {date}
                                </div>

                                {/* Notifications for this date */}
                                <div className="space-y-2">
                                    {dateNotifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`flex p-3 rounded-xl ${notification.isRead ? 'bg-white' : 'bg-white border-l-4 border-[#FF6B81]'
                                                } shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            {/* Icon or profile photo */}
                                            <div className="mr-3 mt-1">
                                                {notification.data?.photo ? (
                                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                                        <img
                                                            src={notification.data.photo}
                                                            alt={notification.data.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Notification content */}
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className={`font-medium ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                                        {notification.content}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{notification.timestamp}</div>
                                                </div>

                                                {notification.data?.messagePreview && (
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {notification.data.messagePreview}
                                                    </p>
                                                )}

                                                {notification.data?.eventDate && (
                                                    <div className="mt-2 text-sm">
                                                        <div className="flex items-center text-blue-600">
                                                            <Calendar size={14} className="mr-1" />
                                                            {notification.data.eventDate}
                                                        </div>
                                                        <div className="mt-1 flex gap-2">
                                                            <button className="px-3 py-1 bg-[#FF6B81] text-white text-xs rounded-full">
                                                                Interested
                                                            </button>
                                                            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                                Not interested
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {notification.type === 'match' && (
                                                    <div className="mt-2">
                                                        <button className="px-4 py-1.5 bg-[#FF6B81] text-white text-sm rounded-full mr-2">
                                                            Send Message
                                                        </button>
                                                        <button className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                                                            View Profile
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Clear all confirmation dialog */}
            {showClearConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Clear all notifications</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to clear all notifications? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => setShowClearConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                onClick={clearAllNotifications}
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPage;