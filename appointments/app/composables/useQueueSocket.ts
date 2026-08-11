import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useQueueSocket = () => {
    const connectSocket = () => {
        if (!socket) {
            const { token } = useUser();
            const config = useRuntimeConfig();

            socket = io(`${config.public.WS_BASE}/queue`, {
                withCredentials: true,
                auth: { token: token.value },
            });
        }
        return socket;
    };

    const reconnectWithFreshToken = (newToken: string) => {
        if (socket) {
            socket.auth = { token: newToken };
            socket.disconnect();
            socket.connect();
        }
    };

    return { connectSocket, reconnectWithFreshToken };
};
