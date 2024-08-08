import { io, Socket } from 'socket.io-client'
import { EventsMap } from '@socket.io/component-emitter'

export type EventNames<Map extends EventsMap> = keyof Map & (string | symbol)

export type EventParams<
    Map extends EventsMap,
    Ev extends EventNames<Map>
> = Parameters<Map[Ev]>

type EventHandlerArgs<T> = T extends (string | null)[]
    ? (data: string) => void
    : (data: T) => void

type DefaultServerEvents = {
    connect: () => void
    disconnect: () => void
}

export interface BaseWebSocket<
    ServerEvents extends Record<string, (...args: never[]) => void>,
    ClientEvents extends Record<string, (...args: never[]) => void>
> {
    connect(): void

    send<T extends EventNames<ClientEvents>>(
        event: T,
        ...args: EventParams<ClientEvents, T>
    ): void

    on<T extends EventNames<DefaultServerEvents & ServerEvents>>(
        event: T,
        listener: (
            data: EventParams<DefaultServerEvents & ServerEvents, T>[0]
        ) => void
    ): void

    off<T extends EventNames<DefaultServerEvents & ServerEvents>>(
        event: T,
        listener: (
            data: EventParams<DefaultServerEvents & ServerEvents, T>[0]
        ) => void
    ): void

    close(): void
}

export class BaseWebSocketImpl<
    ServerEvents extends Record<
        string,
        (...args: never[]) => void
    > = DefaultServerEvents,
    ClientEvents extends Record<string, (...args: never[]) => void> = Record<
        string,
        () => void
    >
> implements BaseWebSocket<ServerEvents, ClientEvents>
{
    protected socket: Socket<ServerEvents, ClientEvents> | null = null
    private readonly endpoint: string
    private readonly token: string
    private readonly eventListeners: {
        [key in EventNames<DefaultServerEvents & ServerEvents>]?: ((
            data: EventParams<DefaultServerEvents & ServerEvents, key>[0]
        ) => void)[]
    } = {}

    constructor(endpoint: string, token: string) {
        this.endpoint = endpoint
        this.token = token
    }

    public connect(): void {
        if (this.socket) {
            console.warn('Already connected.')
            return
        }

        this.socket = io(this.endpoint, {
            auth: { token: this.token },
            transports: ['websocket'],
            reconnection: true
        })

        this.socket.on('connect', () => {
            this.emit('connect', {} as EventParams<ServerEvents, 'connect'>[0])
        })

        this.socket.on('disconnect', () => {
            this.emit(
                'disconnect',
                {} as EventParams<ServerEvents, 'disconnect'>[0]
            )
            this.socket = null
        })

        for (const [event, listeners] of Object.entries(this.eventListeners)) {
            listeners?.forEach((listener: never) => {
                if (this.socket) {
                    this.socket.on(event, listener)
                }
            })
        }
    }

    public send<T extends EventNames<ClientEvents>>(
        event: T,
        ...args: EventParams<ClientEvents, T>
    ): void {
        if (this.socket && this.socket.connected) {
            this.socket.emit(event, ...args)
        } else {
            console.warn('WebSocket is not connected.')
        }
    }

    public on<T extends EventNames<DefaultServerEvents & ServerEvents>>(
        event: T,
        listener: (
            data: EventParams<DefaultServerEvents & ServerEvents, T>[0]
        ) => void
    ): void {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = []
        }
        if (this.socket) {
            this.socket.on(event as string, listener as never)
        }
    }

    public off<T extends EventNames<DefaultServerEvents & ServerEvents>>(
        event: T,
        listener: (
            data: EventParams<DefaultServerEvents & ServerEvents, T>[0]
        ) => void
    ): void {
        if (!this.eventListeners[event]) {
            return
        }

        this.eventListeners[event] = this.eventListeners[event]?.filter(
            (l) => l !== listener
        )

        if (this.socket) {
            this.socket.off(event as string, listener as never)
        }
    }

    public close(): void {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    private emit<T extends EventNames<DefaultServerEvents & ServerEvents>>(
        event: T,
        data: EventParams<DefaultServerEvents & ServerEvents, T>[0]
    ): void {
        if (this.eventListeners[event]) {
            this.eventListeners[event]?.forEach((listener) => listener(data))
        }
    }
}

export type { EventHandlerArgs }
