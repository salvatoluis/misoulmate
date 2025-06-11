import socketService from "./services/socket.service";

export const initializeSocket = () => {
  try {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const parsedAuth = JSON.parse(authData);
      if (parsedAuth.token && parsedAuth.user?.id) {
        socketService.initialize(parsedAuth.token, parsedAuth.user.id);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error initializing socket:', error);
    return false;
  }
};

export const destroySocket = () => {
  socketService.disconnect();
};