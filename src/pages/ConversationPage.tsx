import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
  Paperclip,
  MoreVertical,
  Wifi,
  WifiOff,
  X,
  Mic,
  StopCircle,
} from "lucide-react";
import { matchService } from "@/services";
import messageService from "@/services/message.service";
import { useSocket } from "@/contexts/SocketContext";

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

  // Handle typing indicator
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

  // Cancel file upload
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex flex-col h-[90vh] bg-gray-50">
      <header className="bg-white shadow-sm py-3 px-4 flex items-center gap-3 z-10">
        <button
          onClick={() => navigate("/messages")}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>

        {otherUser && (
          <div className="flex items-center gap-3 flex-grow">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={otherUser.profile?.photos?.[0] || "/default-avatar.png"}
                  alt={otherUser.profile?.name || "Match"}
                  className="w-full h-full object-cover"
                />
              </div>
              {otherUser.isOnline && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-white rounded-full"></div>
              )}
            </div>

            <div>
              <h3 className="font-medium text-gray-800">
                {otherUser.profile?.name || "Match"}
              </h3>
              <p className="text-xs text-gray-500">
                {otherUserTyping
                  ? "Typing..."
                  : otherUser.isOnline
                  ? "Online"
                  : "Last active recently"}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="text-xs text-green-600 flex items-center">
              <Wifi size={16} />
            </div>
          ) : (
            <div className="text-xs text-amber-600 flex items-center">
              <WifiOff size={16} />
            </div>
          )}
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MoreVertical size={20} className="text-gray-700" />
          </button>
        </div>
      </header>

      {/* Messages list */}
      <div ref={messageListRef} className="flex-grow overflow-y-auto px-4 py-6">
        {hasMore && (
          <div className="flex justify-center mb-4">
            <button
              onClick={loadMoreMessages}
              disabled={loadingMore}
              className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "Load older messages"}
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
                    className={`flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        message.error ? "opacity-50" : ""
                      }`}
                    >
                      {/* Message bubble */}
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isCurrentUser
                            ? "bg-primary text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                        }`}
                      >
                        {message.mediaUrl && (
                          <div className="mb-2 rounded-lg overflow-hidden">
                            {message.mediaType === "image" ? (
                              <img
                                src={message.mediaUrl}
                                alt="Image"
                                className="w-full h-auto rounded-lg cursor-pointer"
                                onClick={() =>
                                  openMediaViewer(message.mediaUrl!, "image")
                                }
                              />
                            ) : message.mediaType === "video" ? (
                              <video
                                src={message.mediaUrl}
                                controls
                                className="w-full h-auto rounded-lg"
                                preload="metadata"
                              />
                            ) : message.mediaType === "audio" ? (
                              <audio
                                src={message.mediaUrl}
                                controls
                                className="w-full"
                                preload="metadata"
                              />
                            ) : (
                              <div className="px-3 py-2 bg-gray-100 text-gray-700 rounded flex items-center">
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
                          <p className={message.mediaUrl ? "mt-2" : ""}>
                            {message.content}
                          </p>
                        )}
                      </div>

                      {/* Time and status */}
                      <div
                        className={`mt-1 flex items-center text-xs ${
                          isCurrentUser
                            ? "justify-end text-gray-500"
                            : "justify-start text-gray-400"
                        }`}
                      >
                        <span>{formatTime(message.createdAt)}</span>

                        {isCurrentUser && (
                          <span className="ml-1">
                            {message.isSending
                              ? "• Sending"
                              : message.isRead
                              ? "• Read"
                              : "• Sent"}
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

        {otherUserTyping && (
          <div className="flex justify-start mb-2">
            <div className="bg-white rounded-xl px-4 py-2 shadow-sm flex items-center">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Media preview area */}
      {(previewUrl || isRecording) && (
        <div className="bg-white border-t border-gray-200 p-3">
          <div className="mb-2 p-3 bg-gray-100 rounded-lg relative">
            <button
              onClick={
                fileType === "audio" && audioBlob
                  ? cancelRecording
                  : cancelFileUpload
              }
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 z-10"
            >
              <X size={16} />
            </button>

            {isRecording ? (
              <div className="flex items-center">
                <div className="animate-pulse mr-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">
                  Recording: {formatRecordingTime(recordingTime)}
                </span>
                <button
                  onClick={stopRecording}
                  className="ml-auto bg-gray-200 text-gray-800 p-2 rounded-full"
                >
                  <StopCircle size={20} />
                </button>
              </div>
            ) : fileType === "image" && previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected image"
                className="max-h-40 rounded-lg mx-auto"
              />
            ) : fileType === "video" && previewUrl ? (
              <video
                src={previewUrl}
                controls
                className="max-h-40 w-full rounded-lg"
              />
            ) : fileType === "audio" && previewUrl ? (
              <audio src={previewUrl} controls className="w-full" />
            ) : previewUrl ? (
              <div className="flex items-center p-2">
                <Paperclip size={20} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600 truncate">
                  {selectedFile?.name || "Selected file"}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,video/*,audio/*"
            className="hidden"
            id="file-upload"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            disabled={isRecording || isUploading}
          >
            <Paperclip size={20} />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            disabled={isRecording || isUploading}
          >
            <ImageIcon size={20} />
          </button>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-full hover:bg-gray-100 ${
              isRecording
                ? "text-red-500 hover:text-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            disabled={isUploading || !!selectedFile}
          >
            <Mic size={20} />
          </button>

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
                  ? "Uploading media..."
                  : isConnected
                  ? "Type a message..."
                  : "Type a message (offline mode)"
              }
              className="w-full bg-gray-100 rounded-full py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30"
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
            className={`p-2.5 rounded-full flex items-center justify-center ${
              (messageText.trim() || selectedFile || audioBlob) &&
              !sending &&
              !isUploading
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-gray-200 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>

      {!isConnected && (
        <div className="fixed bottom-16 left-0 right-0 bg-amber-100 py-2 px-4 text-center text-sm text-amber-800 shadow-md">
          <div className="flex items-center justify-center">
            <WifiOff size={16} className="mr-2" />
            You're offline. Messages will send when you reconnect.
          </div>
        </div>
      )}

      {/* Media Viewer */}
      {viewerUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setViewerUrl(null)}
        >
          <button
            onClick={() => setViewerUrl(null)}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-gray-800"
          >
            <X size={24} />
          </button>
          <div className="max-w-4xl max-h-[90vh] p-2">
            {viewerType === "image" ? (
              <img
                src={viewerUrl}
                alt="Full size"
                className="max-w-full max-h-[90vh] object-contain"
              />
            ) : viewerType === "video" ? (
              <video
                src={viewerUrl}
                controls
                autoPlay
                className="max-w-full max-h-[90vh]"
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationPage;
