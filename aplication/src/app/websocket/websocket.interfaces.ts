import { Observable } from 'rxjs';

export interface IWebsocketService {
    on<T>(event: string): Observable<T>;
    send(event: string, to: any, data: any, token: string): void;
    status: Observable<boolean>;
}

export interface WebSocketConfig {
    url: string;
    reconnectInterval?: number;
    reconnectAttempts?: number;
}

export interface IWsMessage<T> {
    event: string;
    to: any;
    data: T;
    token: string;
}
