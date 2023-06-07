interface EventListener {
    (evt: Event): void;
}

class Socket {
    socket: WebSocket | null;

    constructor() {
        this.socket = null;
    }

    connect(url: string) {
        if (!this.socket) {
            this.socket = new WebSocket(url)
        }
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.close()
            this.socket = null
        }
    }

    send(message: object): void {
        if (this.socket) {
            this.socket.send(JSON.stringify(message))
        }
    }

    on(eventName: string, callback: EventListener): void {
        this.socket?.addEventListener(eventName, callback)
    }
}

export { Socket }