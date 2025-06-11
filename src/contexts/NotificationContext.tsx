import socketService from '@/services/socket.service';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface NotificationContextType {
    unreadCount: number;
    setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
    notifications: any[];
    addNotification: (notification: any) => void;
    clearNotifications: () => void;
    markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [notifications, setNotifications] = useState<any[]>([]);

    // Handle new message notifications
    useEffect(() => {
        const handleNotification = (data: any) => {
            addNotification(data);
            setUnreadCount(prev => prev + 1);
        };

        socketService.onNotification(handleNotification);

        return () => {
            socketService.offNotification(handleNotification);
        };
    }, []);

    const addNotification = (notification: any) => {
        setNotifications(prev => [notification, ...prev.slice(0, 19)]);
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const markAllRead = () => {
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider
            value={{
                unreadCount,
                setUnreadCount,
                notifications,
                addNotification,
                clearNotifications,
                markAllRead
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};