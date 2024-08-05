import {useCallback, useEffect, useState} from 'react';
import {io, Socket} from 'socket.io-client';

interface UseSocketProps {
    endpoint: string;
    token: string;
}

interface UseSocketReturn {
    socket: Socket | null;
    isConnected: boolean;
    send: <T>(event: string, data: T) => void;
    on: <T>(event: string, callback: (data: T) => void) => void;
    off: <T>(event: string, callback: (data: T) => void) => void;
    disconnect: () => void;
}

export const useSocket = ({endpoint, token}: UseSocketProps): UseSocketReturn => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(endpoint, {
            transports: ['websocket'],
            reconnection: true,
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            setSocket(null);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [endpoint, token]);

    const send = useCallback(<T, >(event: string, data: T) => {
        if (socket && socket.connected) {
            socket.emit(event, data);
        } else {
            console.warn('Socket is not connected.');
        }
    }, [socket]);

    const on = useCallback(<T, >(event: string, callback: (data: T) => void) => {
        if (socket) {
            socket.on(event, callback);
        } else {
            console.warn('Socket is not initialized.');
        }
    }, [socket]);

    const off = useCallback(<T, >(event: string, callback: (data: T) => void) => {
        if (socket) {
            socket.off(event, callback);
        } else {
            console.warn('Socket is not initialized.');
        }
    }, [socket]);

    const disconnect = useCallback(() => {
        if (socket) {
            socket.disconnect();
        }
    }, [socket]);

    return {
        socket,
        isConnected,
        send,
        on,
        off,
        disconnect,
    };
};