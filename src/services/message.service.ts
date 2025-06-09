import axiosInstance from './axiosInstance';

const getConversations = async (options: any = {}) => {
    const { page = 1, limit = 20 } = options;
    const response = await axiosInstance.get(`/messages/conversations?page=${page}&limit=${limit}`);
    return response.data;
  };

const getMessagesByMatchId = async (matchId: string) => {
    let url = `/messages/matches/${matchId}`;

    const response = await axiosInstance.get(url);
    return response.data;
};

const sendMessage = async (matchId: string, content: any, media: any = null) => {
    const payload: { content: any; media?: any } = { content };

    if (media) {
        payload.media = media;
    }

    const response = await axiosInstance.post(`/messages/matches/${matchId}`, payload);
    return response.data;
};

const getMessageById = async (messageId: string) => {
    const response = await axiosInstance.get(`/messages/${messageId}`);
    return response.data;
};

const markAsRead = async (messageId: string) => {
    const response = await axiosInstance.patch(`/messages/${messageId}/read`);
    return response.data;
};

const markAllAsRead = async (matchId: string) => {
    const response = await axiosInstance.patch(`/messages/matches/${matchId}/read`);
    return response.data;
};

const getUnreadCount = async () => {
    const response = await axiosInstance.get(`/messages/unread`);
    return response.data.unreadCount;
};

export default {
    getMessagesByMatchId,
    sendMessage,
    getMessageById,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    getConversations
};