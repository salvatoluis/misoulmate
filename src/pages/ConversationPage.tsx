import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  ImageIcon,
  Paperclip,
  MoreVertical,
  Wifi,
  WifiOff,
  X,
  Mic,
  StopCircle,
  Heart,
} from "lucide-react";
import { matchService } from "@/services";
import messageService from "@/services/message.service";
import { useSocket } from "@/contexts/SocketContext";
import lamejs from "lamejs";

const ConversationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  let currentUserId: string | null = null;
  const authData = localStorage.getItem("auth");
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
    tempId?: string;
    processed?: boolean;
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
  const [messageText, setMessageText] = useState("");
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
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const [processedMessageIds] = useState<Set<string>>(new Set());

  // Media-related states
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Media viewer state
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerType, setViewerType] = useState<string>("image");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const matchData = await matchService.getMatchById(id);
        setOtherUser(matchData.otherUser);

        const response = await messageService.getMessagesByMatchId(
          id as string
        );

        setMessages(response.messages.reverse());
        setPagination(response.pagination);
        setHasMore(response.pagination.page < response.pagination.pages);

        const hasUnreadFromOthers = response.messages.some(
          (msg: Message) => !msg.isRead && msg.senderId !== currentUserId
        );

        if (hasUnreadFromOthers) {
          await messageService.markAllAsRead(id as string);

          if (socket && isConnected) {
            socket.emit("message_read", { matchId: id });
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching conversation data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUserId]);

  useEffect(() => {
    if (!socket || !isConnected || !id || !currentUserId) return;

    socket.emit("join_match", id);

    socket.on("new_message", (newMessage: Message) => {
      if (newMessage.matchId !== id) return;

      if (processedMessageIds.has(newMessage.id)) {
        return;
      }

      processedMessageIds.add(newMessage.id);

      setMessages((prevMessages) => {
        const existingIndex = prevMessages.findIndex(
          (msg) =>
            msg.id === newMessage.id ||
            (msg.tempId && msg.tempId === newMessage.tempId) ||
            (msg.senderId === newMessage.senderId &&
              msg.content === newMessage.content &&
              Math.abs(
                new Date(msg.createdAt).getTime() -
                  new Date(newMessage.createdAt).getTime()
              ) < 5000)
        );

        if (existingIndex !== -1) {
          const newMessages = [...prevMessages];
          newMessages[existingIndex] = {
            ...newMessage,
            isSending: false,
            processed: true,
          };
          return newMessages;
        }

        if (newMessage.senderId !== currentUserId) {
          socket.emit("message_read", {
            matchId: id,
            messageId: newMessage.id,
          });
          messageService.markAsRead(newMessage.id).catch(console.error);
        }

        return [...prevMessages, { ...newMessage, processed: true }];
      });

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    socket.on("message_sending", ({ tempId }: { tempId: string }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.tempId === tempId ? { ...msg, isSending: true } : msg
        )
      );
    });

    socket.on(
      "message_error",
      ({ tempId, error }: { tempId: string; error: string }) => {
        console.error("Message error:", error);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.tempId === tempId
              ? { ...msg, isSending: false, error: true }
              : msg
          )
        );
      }
    );

    socket.on(
      "message_read_update",
      ({
        matchId,
        readBy,
      }: {
        matchId: string;
        messageId: string;
        readBy: string;
      }) => {
        if (matchId !== id || readBy === currentUserId) return;

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            !msg.isRead ? { ...msg, isRead: true } : msg
          )
        );
      }
    );

    socket.on(
      "user_typing",
      ({
        userId,
        matchId,
        isTyping,
      }: {
        userId: string;
        matchId: string;
        isTyping: boolean;
      }) => {
        if (matchId !== id || userId === currentUserId) return;
        setOtherUserTyping(isTyping);
      }
    );

    socket.on(
      "user_status_change",
      ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
        if (otherUser && userId === otherUser.id) {
          setOtherUser((prev) => (prev ? { ...prev, isOnline } : null));
        }
      }
    );

    return () => {
      socket.off("new_message");
      socket.off("message_sending");
      socket.off("message_error");
      socket.off("message_read_update");
      socket.off("user_typing");
      socket.off("user_status_change");
    };
  }, [socket, isConnected, id, currentUserId, otherUser, processedMessageIds]);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading, messages.length]);

  useEffect(() => {
    if (previousScrollHeight > 0 && messageListRef.current) {
      const newScrollHeight = messageListRef.current.scrollHeight;
      messageListRef.current.scrollTop = newScrollHeight - previousScrollHeight;
    }
  }, [previousScrollHeight]);

  useEffect(() => {
    if (!socket || !isConnected || !id) return;

    if (messageText && !isTyping) {
      setIsTyping(true);
      socket.emit("typing", { matchId: id, isTyping: true });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socket.emit("typing", { matchId: id, isTyping: false });
      }
    }, 2000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [messageText, socket, isConnected, id, isTyping]);

  // Handle file selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    setSelectedFile(file);

    // Determine file type
    if (file.type.startsWith("image/")) {
      setFileType("image");
    } else if (file.type.startsWith("video/")) {
      setFileType("video");
    } else if (file.type.startsWith("audio/")) {
      setFileType("audio");
    } else {
      setFileType("document");
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const convertToMP3 = async (audioBlob: Blob): Promise<Blob> => {
    // Skip conversion if it's already MP3
    if (audioBlob.type.includes("mp3")) {
      return audioBlob;
    }

    try {
      // Convert the audio blob to array buffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Decode the audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Convert to MP3 using lamejs
      const channels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);

      // Process audio data
      const samples = new Int16Array(audioBuffer.length * channels);
      const leftChannel = audioBuffer.getChannelData(0);
      const rightChannel =
        channels > 1 ? audioBuffer.getChannelData(1) : leftChannel;

      for (let i = 0; i < audioBuffer.length; i++) {
        // Convert float to int
        const left = leftChannel[i] * 32767;
        const right = rightChannel[i] * 32767;
        samples[i * 2] = left;
        samples[i * 2 + 1] = right;
      }

      // Encode to MP3
      const mp3Data = [];
      const blockSize = 1152;

      for (let i = 0; i < samples.length; i += blockSize * 2) {
        const sampleChunk = samples.subarray(i, i + blockSize * 2);
        const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }
      }

      const mp3buf = mp3encoder.flush();
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }

      // Create MP3 blob
      const mp3Blob = new Blob(mp3Data, { type: "audio/mp3" });
      return mp3Blob;
    } catch (error) {
      console.error("Error converting to MP3:", error);
      // If conversion fails, use the original blob
      return audioBlob;
    }
  };

  const cancelFileUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Use mp3 or ogg format if browser supports it, otherwise fallback to webm
      const mimeType = MediaRecorder.isTypeSupported("audio/mp3")
        ? "audio/mp3"
        : MediaRecorder.isTypeSupported("audio/ogg")
        ? "audio/ogg"
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Determine the correct type based on mimeType
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setPreviewUrl(url);
        setFileType("audio");

        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer (rest of your existing code)
      let seconds = 0;
      recordingTimerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);

        if (seconds >= 60) {
          stopRecording();
        }
      }, 1000);
    } catch (error) {
      console.error("Error starting audio recording:", error);
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  // Cancel audio recording
  const cancelRecording = () => {
    if (isRecording) {
      stopRecording();
    }

    setAudioBlob(null);
    setPreviewUrl(null);
    setFileType(null);
    setRecordingTime(0);
  };

  // Format recording time
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Open media viewer
  const openMediaViewer = (url: string, type: string) => {
    setViewerUrl(url);
    setViewerType(type);
  };

  const loadMoreMessages = async () => {
    if (!hasMore || loadingMore || !messages.length) return;

    try {
      setLoadingMore(true);

      if (messageListRef.current) {
        setPreviousScrollHeight(messageListRef.current.scrollHeight);
      }

      const response = await messageService.getMessagesByMatchId(id as string, {
        page: pagination.page + 1,
        limit: pagination.limit,
        beforeId: messages[0]?.id,
      });

      setMessages((prevMessages) => [
        ...response.messages.reverse(),
        ...prevMessages,
      ]);
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
      setHasMore(response.pagination.page < response.pagination.pages);
      setLoadingMore(false);
    } catch (error) {
      console.error("Error loading more messages:", error);
      setLoadingMore(false);
    }
  };

  const handleSendMessage = async () => {
    if (
      (!messageText.trim() && !selectedFile && !audioBlob) ||
      sending ||
      isUploading
    )
      return;

    const messageContent = messageText.trim();
    const tempId = `temp-${Date.now()}`;
    let mediaInfo = null;

    try {
      setSending(true);

      // Inside handleSendMessage function, update the upload section:

      if (selectedFile || audioBlob) {
        setIsUploading(true);

        try {
          let fileToUpload;

          if (audioBlob) {
            const fileExtension = audioBlob.type.includes("mp3")
              ? ".mp3"
              : audioBlob.type.includes("ogg")
              ? ".ogg"
              : ".webm";

            fileToUpload = new File(
              [audioBlob],
              `voice-note-${Date.now()}${fileExtension}`,
              { type: audioBlob.type }
            );
          } else {
            fileToUpload = selectedFile!;
          }

          const uploadResult = await messageService.uploadMedia(fileToUpload);
          mediaInfo = {
            url: uploadResult.url,
            type: uploadResult.type,
          };
          setIsUploading(false);
        } catch (error) {
          console.error("Error uploading media:", error);
          setIsUploading(false);
          setSending(false);
          return;
        }
      }

      // Create temporary message
      const tempMessage: Message = {
        id: tempId,
        tempId,
        matchId: id as string,
        senderId: currentUserId as string,
        content: messageContent,
        createdAt: new Date().toISOString(),
        isRead: false,
        isSending: true,
        ...(mediaInfo && {
          mediaUrl: mediaInfo.url,
          mediaType: mediaInfo.type,
        }),
      };

      // Add to local state immediately
      setMessages((prevMessages) => [...prevMessages, tempMessage]);
      setMessageText("");

      // Clear media states
      cancelFileUpload();
      cancelRecording();

      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

      // Focus the input again after sending
      messageInputRef.current?.focus();

      // Use socket for real-time delivery if connected
      if (socket && isConnected) {
        socket.emit("send_message", {
          tempId,
          matchId: id,
          content: messageContent,
          media: mediaInfo,
        });
      }

      // Also send via API for persistence
      const response = await messageService.sendMessage(
        id as string,
        messageContent,
        mediaInfo
      );

      // Mark this message ID as processed so the socket won't add it again
      processedMessageIds.add(response.id);

      // Update with server response
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.tempId === tempId
            ? { ...response, isSending: false, processed: true }
            : msg
        )
      );

      setSending(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setSending(false);

      // Mark message as failed
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.tempId === tempId
            ? { ...msg, error: true, isSending: false }
            : msg
        )
      );

      // Try to resend via socket when connection is restored
      if (socket) {
        const retryMessage = messageContent;
        const retryMedia = mediaInfo;

        const onReconnect = () => {
          socket.emit("send_message", {
            tempId,
            matchId: id,
            content: retryMessage,
            media: retryMedia,
          });

          socket.off("connect", onReconnect);
        };

        socket.on("connect", onReconnect);
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
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

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString();

      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate as string,
            messages: currentGroup,
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
        messages: currentGroup,
      });
    }

    return groups;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
          <div className="w-8 h-8 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex flex-col max-h-[90vh] bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-rose-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      <header className="bg-white/80 backdrop-blur-md shadow-lg py-4 px-4 flex items-center gap-3 z-10 border-b border-pink-100/50">
        <button
          onClick={() => navigate("/messages")}
          className="p-2 rounded-full hover:bg-pink-100/50 transition-all duration-200 transform hover:scale-105"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>

        {otherUser && (
          <div className="flex items-center gap-3 flex-grow">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-pink-200 shadow-lg">
                <img
                  src={otherUser.profile?.photos?.[0] || "/default-avatar.png"}
                  alt={otherUser.profile?.name || "Match"}
                  className="w-full h-full object-cover"
                />
              </div>
              {otherUser.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
              )}
            </div>

            <div className="flex-grow">
              <h3 className="font-semibold text-gray-800 text-lg">
                {otherUser.profile?.name || "Match"}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                {otherUserTyping ? (
                  <>
                    <span className="flex space-x-1">
                      <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce delay-150"></div>
                    </span>
                    <span className="ml-1">typing something sweet...</span>
                  </>
                ) : otherUser.isOnline ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Online now</span>
                  </>
                ) : (
                  "Last seen recently"
                )}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="text-xs text-emerald-600 flex items-center p-2 bg-emerald-50 rounded-full">
              <Wifi size={16} />
            </div>
          ) : (
            <div className="text-xs text-amber-600 flex items-center p-2 bg-amber-50 rounded-full">
              <WifiOff size={16} />
            </div>
          )}
          <button className="p-2 rounded-full hover:bg-pink-100/50 transition-all duration-200">
            <MoreVertical size={20} className="text-gray-700" />
          </button>
        </div>
      </header>

      {/* Messages list */}
      <div
        ref={messageListRef}
        className="flex-grow overflow-y-auto px-4 py-6 relative z-10"
      >
        {hasMore && (
          <div className="flex justify-center mb-6">
            <button
              onClick={loadMoreMessages}
              disabled={loadingMore}
              className="px-6 py-3 text-sm text-gray-600 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:bg-white/80 disabled:opacity-50 transition-all duration-200 border border-pink-100/50"
            >
              {loadingMore ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                "Load earlier messages"
              )}
            </button>
          </div>
        )}

        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-2xl text-sm text-gray-600 shadow-sm border border-pink-100/50">
                {formatDate(group.date)}
              </div>
            </div>

            <div className="space-y-4">
              {group.messages.map((message) => {
                const isCurrentUser = message.senderId === currentUserId;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    } animate-fadeIn`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] ${
                        message.error ? "opacity-60" : ""
                      }`}
                    >
                      <div
                        className={`rounded-3xl px-5 py-3 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${
                          isCurrentUser
                            ? "bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-br-lg transform hover:scale-[1.02]"
                            : "bg-white/90 text-gray-800 rounded-bl-lg border border-pink-100/50 hover:bg-white/95"
                        }`}
                      >
                        {message.mediaUrl && (
                          <div className="mb-3 rounded-2xl overflow-hidden shadow-sm">
                            {message.mediaType === "image" ? (
                              <img
                                src={message.mediaUrl}
                                alt="Image"
                                className="w-full h-auto rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-105"
                                onClick={() =>
                                  openMediaViewer(message.mediaUrl!, "image")
                                }
                              />
                            ) : message.mediaType === "video" ? (
                              <video
                                src={message.mediaUrl}
                                controls
                                className="w-full h-auto rounded-2xl"
                                preload="metadata"
                              />
                            ) : message.mediaType === "audio" ? (
                              <div
                                className={`p-3 rounded-2xl ${
                                  isCurrentUser ? "bg-white/20" : "bg-gray-50"
                                }`}
                              >
                                <audio
                                  src={message.mediaUrl}
                                  controls
                                  className="w-full"
                                  preload="metadata"
                                />
                              </div>
                            ) : (
                              <div
                                className={`px-4 py-3 rounded-2xl flex items-center ${
                                  isCurrentUser ? "bg-white/20" : "bg-gray-50"
                                }`}
                              >
                                <Paperclip size={16} className="mr-2" />
                                <span className="text-sm">
                                  {message.mediaUrl.split("/").pop() ||
                                    "Attachment"}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        {message.content && (
                          <p
                            className={`leading-relaxed ${
                              message.mediaUrl ? "mt-2" : ""
                            } ${
                              isCurrentUser ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {message.content}
                          </p>
                        )}
                      </div>

                      <div
                        className={`mt-2 flex items-center text-xs ${
                          isCurrentUser
                            ? "justify-end text-gray-500"
                            : "justify-start text-gray-400"
                        }`}
                      >
                        <span>{formatTime(message.createdAt)}</span>

                        {isCurrentUser && (
                          <span className="ml-2 flex items-center gap-1">
                            {message.isSending ? (
                              <>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                <span>Sending</span>
                              </>
                            ) : message.isRead ? (
                              <>
                                <Heart
                                  size={10}
                                  className="text-pink-400 fill-current"
                                />
                                <span>Read</span>
                              </>
                            ) : (
                              <>
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span>Delivered</span>
                              </>
                            )}
                          </span>
                        )}

                        {message.error && (
                          <span className="ml-2 text-red-500 flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {otherUserTyping && (
          <div className="flex justify-start mb-4 animate-fadeIn">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl px-5 py-3 shadow-lg border border-pink-100/50 flex items-center">
              <div className="flex space-x-1 mr-2">
                <div
                  className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">Writing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {(previewUrl || isRecording) && (
        <div className="bg-white/80 backdrop-blur-sm border-t border-pink-200/50 p-4 mx-4 rounded-t-2xl shadow-xl">
          <div className="mb-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl relative border border-pink-100">
            <button
              onClick={
                fileType === "audio" && audioBlob
                  ? cancelRecording
                  : cancelFileUpload
              }
              className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full p-1.5 z-10 transition-all duration-200 transform hover:scale-110"
            >
              <X size={16} />
            </button>

            {isRecording ? (
              <div className="flex items-center">
                <div className="animate-pulse mr-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  Recording: {formatRecordingTime(recordingTime)}
                </span>
                <button
                  onClick={stopRecording}
                  className="ml-auto bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <StopCircle size={20} />
                </button>
              </div>
            ) : fileType === "image" && previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected image"
                className="max-h-48 rounded-2xl mx-auto shadow-md"
              />
            ) : fileType === "video" && previewUrl ? (
              <video
                src={previewUrl}
                controls
                className="max-h-48 w-full rounded-2xl shadow-md"
              />
            ) : fileType === "audio" && previewUrl ? (
              <div className="bg-white/50 rounded-2xl p-3">
                <audio src={previewUrl} controls className="w-full" />
              </div>
            ) : previewUrl ? (
              <div className="flex items-center p-3 bg-white/50 rounded-2xl">
                <Paperclip size={20} className="text-gray-500 mr-3" />
                <span className="text-sm text-gray-700 truncate font-medium">
                  {selectedFile?.name || "Selected file"}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-md border-t border-pink-200/50 p-4 m-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,video/*,audio/*"
            className="hidden"
            id="file-upload"
          />

          <div className="flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1 text-gray-500 hover:text-pink-500 rounded-full hover:bg-pink-50 transition-all duration-200 transform hover:scale-110"
              disabled={isRecording || isUploading}
            >
              <Paperclip size={20} />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1 text-gray-500 hover:text-pink-500 rounded-full hover:bg-pink-50 transition-all duration-200 transform hover:scale-110"
              disabled={isRecording || isUploading}
            >
              <ImageIcon size={20} />
            </button>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-1 rounded-full transition-all duration-200 transform hover:scale-110 ${
                isRecording
                  ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100"
                  : "text-gray-500 hover:text-pink-500 hover:bg-pink-50"
              }`}
              disabled={isUploading || !!selectedFile}
            >
              <Mic size={20} />
            </button>
          </div>

          <div className="flex-grow relative">
            <input
              ref={messageInputRef}
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSendMessage()
              }
              placeholder={
                isUploading
                  ? "Uploading your message..."
                  : isConnected
                  ? "Write something beautiful..."
                  : "Write something beautiful (offline)"
              }
              className="w-full bg-gradient-to-r from-pink-50 to-purple-50 rounded-full py-4 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-300/50 border border-pink-100 transition-all duration-200 placeholder-gray-400"
              disabled={isUploading}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={
              (!messageText.trim() && !selectedFile && !audioBlob) ||
              sending ||
              isUploading
            }
            className={`p-3 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg ${
              (messageText.trim() || selectedFile || audioBlob) &&
              !sending &&
              !isUploading
                ? "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-rose-600 text-white"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>

      {viewerUrl && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn"
          onClick={() => setViewerUrl(null)}
        >
          <button
            onClick={() => setViewerUrl(null)}
            className="absolute top-6 right-6 text-white p-3 rounded-full hover:bg-white/10 transition-all duration-200 transform hover:scale-110"
          >
            <X size={24} />
          </button>
          <div className="max-w-4xl max-h-[90vh] p-4">
            {viewerType === "image" ? (
              <img
                src={viewerUrl}
                alt="Full size"
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
            ) : viewerType === "video" ? (
              <video
                src={viewerUrl}
                controls
                autoPlay
                className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
              />
            ) : null}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConversationPage;
