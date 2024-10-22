import { Injectable, OnDestroy } from '@angular/core';
import { Client, IMessage, Stomp, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {

  private stompClient: Client;
  private subscription: StompSubscription | null = null;

  constructor(private snackbarService: SnackbarService) {
    console.log('websocket url: ' + environment.server + '/ws');
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(environment.server + '/ws'), // Use SockJS for the WebSocket connection
      reconnectDelay: 5000, // Reconnect automatically after 5 seconds if disconnected
      heartbeatIncoming: 4000, // Set the incoming heartbeat interval
      heartbeatOutgoing: 4000 // Set the outgoing heartbeat interval
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected: ', frame);

      // Subscribe to the topic after successful connection
      this.subscription = this.stompClient.subscribe('/topic/notifications', (message: IMessage) => {
        this.snackbarService.showMessage(message.body); // Show notification with message body
      });
    };

    // Handle connection errors
    this.stompClient.onWebSocketError = (error) => {
      console.error('WebSocket connection error: ', error);
      console.error('WebSocket connection error.');
    };

    // Handle STOMP protocol errors
    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ', frame.headers['message']);
      console.error('Additional details: ', frame.body);
    };

    // Handle WebSocket disconnection
    this.stompClient.onDisconnect = (frame) => {
      console.warn('WebSocket disconnected: ', frame);
      console.warn('WebSocket connection disconnected.');
    };

    // Activate the client to establish connection
    this.stompClient.activate();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Unsubscribe from the topic
      console.log('Unsubscribed from /topic/file-processed');
    }

    if (this.stompClient.active) {
      this.stompClient.deactivate(); // Gracefully disconnect WebSocket
      console.log('WebSocket connection closed');
    }
  }
}
