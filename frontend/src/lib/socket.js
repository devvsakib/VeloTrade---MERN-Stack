import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
});

// Connect socket when user is authenticated
export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

// Disconnect socket
export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

// Listen for events
export const onOrderUpdate = (callback) => {
    socket.on('order_update', callback);
};

export const onNewOrder = (callback) => {
    socket.on('new_order', callback);
};

// Cleanup listeners
export const offOrderUpdate = () => {
    socket.off('order_update');
};

export const offNewOrder = () => {
    socket.off('new_order');
};

export default socket;
