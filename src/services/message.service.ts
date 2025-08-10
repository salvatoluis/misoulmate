import axiosInstance from "./axiosInstance";

const getConversations = async (options: any = {}) => {
  const { page = 1, limit = 20 } = options;
  const response = await axiosInstance.get(
    `/messages/conversations?page=${page}&limit=${limit}`
  );
  return response.data;
};

const getMessagesByMatchId = async (matchId: string, options: any = {}) => {
  const { page, limit, beforeId } = options;
  let url = `/messages/matches/${matchId}`;

  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (beforeId) params.append("beforeId", beforeId);

  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  const response = await axiosInstance.get(url);
  return response.data;
};

const sendMessage = async (
  matchId: string,
  content: any,
  media: any = null
) => {
  const payload: { content: any; media?: any } = { content };

  if (media) {
    payload.media = media;
  }

  const response = await axiosInstance.post(
    `/messages/matches/${matchId}`,
    payload
  );
  return response.data;
};

// Add standard media upload
const uploadMedia = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post("/messages/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Add raw media upload specifically for audio
const uploadRawAudio = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("resourceType", "raw"); // Tell backend this is a raw file

  const response = await axiosInstance.post("/messages/upload-raw", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

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
  const response = await axiosInstance.patch(
    `/messages/matches/${matchId}/read`
  );
  return response.data;
};

const getUnreadCount = async () => {
  const response = await axiosInstance.get(`/messages/unread/count`);
  return response.data.unreadCount;
};

export default {
  getMessagesByMatchId,
  sendMessage,
  getMessageById,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getConversations,
  uploadMedia,
  uploadRawAudio,
};
