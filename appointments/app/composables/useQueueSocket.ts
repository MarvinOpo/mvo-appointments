import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function useQueueSocket() {
    const connectSocket = () => {
        if (!socket) {
            socket = io("/queue", {
                withCredentials: true,
            });
        }
        return socket;
    };

    return { connectSocket };
}
