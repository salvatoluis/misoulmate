import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private messageListeners: Map<string, Function[]> = new Map();
  private statusListeners: Map<string, Function[]> = new Map();
  private notificationListeners: Function[] = [];
  private typingListeners: Map<string, Function[]> = new Map();
  private connectionListeners: Function[] = [];
  private onlineStatusListeners: Function[] = [];
  private globalReadListeners: Function[] = [];

  // Initialize the socket connection
  initialize(token: string, userId: string) {
    if (this.socket) {
      this.disconnect();
    }

    this.userId = userId;

    // Connect with authentication token
    this.socket = io('http://localhost:3000', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.joinUserRoom();
      this.connectionListeners.forEach(listener => listener(true));
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connectionListeners.forEach(listener => listener(false));
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.connectionListeners.forEach(listener => listener(false, error));
    });

    // Message events
    this.socket.on('message:new', (message) => {
      const matchId = message.matchId;
      if (this.messageListeners.has(matchId)) {
        this.messageListeners.get(matchId)?.forEach(listener => listener(message));
      }
    });

    this.socket.on('message:read', (data) => {
      // For match-specific listeners
      const matchId = data.matchId;
      if (this.statusListeners.has(matchId)) {
        this.statusListeners.get(matchId)?.forEach(listener => listener(data));
      }
      
      // For global read status listeners
      this.globalReadListeners.forEach(listener => listener(data));
    });

    // Notification events
    this.socket.on('notification:message', (data) => {
      this.notificationListeners.forEach(listener => listener(data));
    });

    // Typing events
    this.socket.on('user:typing', (data) => {
      const matchId = data.matchId;
      if (this.typingListeners.has(matchId)) {
        this.typingListeners.get(matchId)?.forEach(listener => 
          listener(data.userId, data.isTyping));
      }
    });
    
    // Online status events
    this.socket.on('user:online', (data) => {
      this.onlineStatusListeners.forEach(listener => listener(data));
    });

    return this.socket;
  }

  // Join user's personal room
  joinUserRoom() {
    if (!this.socket || !this.userId) return;
    this.socket.emit('join:user', { userId: this.userId });
  }

  // Join a match room for real-time messages
  joinMatchRoom(matchId: string) {
    if (!this.socket) return;
    this.socket.emit('join:match', { matchId });
    console.log(`Joined match room: ${matchId}`);
  }

  // Leave a match room
  leaveMatchRoom(matchId: string) {
    if (!this.socket) return;
    this.socket.emit('leave:match', { matchId });
    console.log(`Left match room: ${matchId}`);
  }

  // Send a message via socket
  sendMessage(matchId: string, content: string, media: any = null) {
    if (!this.socket) return;
    
    const messageData = {
      matchId,
      content,
      media
    };
    
    this.socket.emit('message:send', messageData);
  }

  // Send typing status
  sendTypingStatus(matchId: string, isTyping: boolean) {
    if (!this.socket) return;
    
    this.socket.emit('user:typing', {
      matchId,
      isTyping
    });
  }

  // Mark messages as read
  markMessagesAsRead(matchId: string) {
    if (!this.socket) return;
    this.socket.emit('message:read', { matchId });
  }

  // Add message listener
  onNewMessage(matchId: string, callback: Function) {
    if (!this.messageListeners.has(matchId)) {
      this.messageListeners.set(matchId, []);
    }
    this.messageListeners.get(matchId)?.push(callback);
  }

  // Remove message listener
  offNewMessage(matchId: string, callback: Function) {
    if (this.messageListeners.has(matchId)) {
      const listeners = this.messageListeners.get(matchId) || [];
      this.messageListeners.set(
        matchId,
        listeners.filter(listener => listener !== callback)
      );
    }
  }

  // Add read status listener
  onMessageRead(matchId: string, callback: Function) {
    if (!this.statusListeners.has(matchId)) {
      this.statusListeners.set(matchId, []);
    }
    this.statusListeners.get(matchId)?.push(callback);
  }

  // Remove read status listener
  offMessageRead(matchId: string, callback: Function) {
    if (this.statusListeners.has(matchId)) {
      const listeners = this.statusListeners.get(matchId) || [];
      this.statusListeners.set(
        matchId,
        listeners.filter(listener => listener !== callback)
      );
    }
  }
  
  // Add global read status listener (for conversation list)
  onGlobalReadStatus(callback: Function) {
    this.globalReadListeners.push(callback);
  }
  
  // Remove global read status listener
  offGlobalReadStatus(callback: Function) {
    this.globalReadListeners = this.globalReadListeners.filter(
      listener => listener !== callback
    );
  }

  // Add notification listener
  onNotification(callback: Function) {
    this.notificationListeners.push(callback);
  }

  // Remove notification listener
  offNotification(callback: Function) {
    this.notificationListeners = this.notificationListeners.filter(
      listener => listener !== callback
    );
  }

  // Add typing listener
  onTypingStatus(matchId: string, callback: Function) {
    if (!this.typingListeners.has(matchId)) {
      this.typingListeners.set(matchId, []);
    }
    this.typingListeners.get(matchId)?.push(callback);
  }

  // Remove typing listener
  offTypingStatus(matchId: string, callback: Function) {
    if (this.typingListeners.has(matchId)) {
      const listeners = this.typingListeners.get(matchId) || [];
      this.typingListeners.set(
        matchId,
        listeners.filter(listener => listener !== callback)
      );
    }
  }
  
  // Add online status listener
  onOnlineStatus(callback: Function) {
    this.onlineStatusListeners.push(callback);
  }
  
  // Remove online status listener
  offOnlineStatus(callback: Function) {
    this.onlineStatusListeners = this.onlineStatusListeners.filter(
      listener => listener !== callback
    );
  }

  // Add connection listener
  onConnectionChange(callback: Function) {
    this.connectionListeners.push(callback);
  }

  // Remove connection listener
  offConnectionChange(callback: Function) {
    this.connectionListeners = this.connectionListeners.filter(
      listener => listener !== callback
    );
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
      this.messageListeners.clear();
      this.statusListeners.clear();
      this.notificationListeners = [];
      this.typingListeners.clear();
      this.connectionListeners = [];
      this.onlineStatusListeners = [];
      this.globalReadListeners = [];
    }
  }

  // Check if socket is connected
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService;