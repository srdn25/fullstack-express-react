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
        debugger
        if (this.socket) {
            this.socket.send(JSON.stringify(message))
        }
    }

    on(eventName: string, callback: any) {
        this.socket?.addEventListener(eventName, callback)
    }
}

export { Socket }