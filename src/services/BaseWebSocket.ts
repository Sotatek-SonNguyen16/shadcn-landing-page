import {io, Socket} from 'socket.io-client';

type DefaultServerEvents = {
    connect: () => void;
    disconnect: () => void;
}

export interface BaseWebSocket<
    ServerEvents extends Record<string, (...args: any[]) => void>,
    ClientEvents extends Record<string, (...args: any[]) => void>
> {
    connect(): void;

    send<T extends keyof ClientEvents>(event: T, ...args: Parameters<ClientEvents[T]>): void;

    on<T extends keyof (ServerEvents & DefaultServerEvents)>(event: T, listener: (data: Parameters<ServerEvents[T]>[0]) => void): void;

    off<T extends keyof (ServerEvents & DefaultServerEvents)>(event: T, listener: (data: Parameters<ServerEvents[T]>[0]) => void): void;

    close(): void;
}

export class BaseWebSocketImpl<
    ServerEvents extends Record<string, (...args: any[]) => void> = DefaultServerEvents,
    ClientEvents extends Record<string, (...args: any[]) => void> = Record<string, any>
> implements BaseWebSocket<ServerEvents, ClientEvents> {
    protected socket: Socket<ServerEvents, ClientEvents> | null = null;
    private readonly endpoint: string;
    private readonly token: string;
    private readonly eventListeners: { [key in keyof ServerEvents]?: ((data: Parameters<ServerEvents[key]>) => void)[] } = {};

    constructor(endpoint: string, token: string) {
        this.endpoint = endpoint;
        this.token = token;
    }

    public connect(): void {
        if (this.socket) {
            console.warn("Already connected.");
            return;
        }

        this.socket = io(this.endpoint, {
            auth: {token: this.token},
            transports: ["websocket"],
            reconnection: true
        });

        this.socket.on('connect', () => {
            this.emit('connect', {} as Parameters<ServerEvents['connect']>[0]);
        });

        this.socket.on('disconnect', () => {
            this.emit('disconnect', {} as Parameters<ServerEvents['disconnect']>[0]);
            this.socket = null;
        });

        for (const [event, listeners] of Object.entries(this.eventListeners)) {
            listeners?.forEach((listener: never) => {
                if (this.socket) {
                    this.socket.on(event, listener);
                }
            });
        }
    }

    public send<T extends keyof ClientEvents>(event: T, ...args: Parameters<ClientEvents[T]>): void {
        if (this.socket && this.socket.connected) {
            // @ts-ignore
            this.socket.emit(event as string, ...args);
        } else {
            console.warn("WebSocket is not connected.");
        }
    }

    public on<T extends keyof (DefaultServerEvents & ServerEvents)>(event: T, listener: (data: Parameters<ServerEvents[T]>[0]) => void): void {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        if (this.socket) {
            this.socket.on(event as string, listener as never);
        }
    }

    public off<T extends keyof (DefaultServerEvents & ServerEvents)>(event: T, listener: (data: Parameters<ServerEvents[T]>[0]) => void): void {
        if (!this.eventListeners[event]) {
            return;
        }

        this.eventListeners[event] = this.eventListeners[event]?.filter(l => l !== listener);

        if (this.socket) {
            this.socket.off(event as string, listener as never);
        }
    }

    public close(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    private emit<T extends keyof (DefaultServerEvents & ServerEvents)>(event: T, data: Parameters<ServerEvents[T]>[0]): void {
        if (this.eventListeners[event]) {
            // @ts-ignore
            this.eventListeners[event].forEach(listener => listener(data));
        }
    }
}
