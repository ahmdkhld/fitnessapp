import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/strategies/jwt.strategy';

/**
 * Central WebSocket gateway for NutriTrack real-time events.
 *
 * Authenticates connections via JWT (passed as `auth.token` in the
 * Socket.IO handshake or as a `token` query parameter).  Once
 * authenticated the socket is stored in a per-user map so any backend
 * service can push events to all of a user's open connections.
 *
 * Supported outbound events (server -> client):
 *   - `notification`        — real-time notification delivery
 *   - `timeline:update`     — schedule item status changed
 *   - `coach:client-update` — a client completed an item (sent to coach)
 */
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3001'],
  },
  namespace: '/ws',
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WsGateway.name);

  /**
   * Map of userId -> array of connected sockets.
   * A single user may have multiple tabs / devices connected simultaneously.
   */
  private readonly userSockets = new Map<string, Socket[]>();

  constructor(private readonly jwtService: JwtService) {}

  // ------------------------------------------------------------------
  // Connection lifecycle
  // ------------------------------------------------------------------

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = this.extractToken(client);
      if (!token) {
        this.logger.warn(`Connection rejected — no token provided (${client.id})`);
        client.emit('error', { message: 'Authentication required' });
        client.disconnect(true);
        return;
      }

      const payload = await this.verifyToken(token);
      if (!payload) {
        this.logger.warn(`Connection rejected — invalid token (${client.id})`);
        client.emit('error', { message: 'Invalid or expired token' });
        client.disconnect(true);
        return;
      }

      const userId = payload.sub;
      // Attach userId to socket data for later lookups
      (client as any).userId = userId;

      const existing = this.userSockets.get(userId) || [];
      existing.push(client);
      this.userSockets.set(userId, existing);

      // Join a user-specific room for convenient broadcasting
      client.join(`user:${userId}`);

      this.logger.log(
        `Client connected: ${client.id} (user ${userId}) — ${existing.length} active socket(s)`,
      );
    } catch (err) {
      this.logger.error(`Connection error: ${(err as Error).message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = (client as any).userId as string | undefined;
    if (!userId) return;

    const sockets = this.userSockets.get(userId);
    if (sockets) {
      const filtered = sockets.filter((s) => s.id !== client.id);
      if (filtered.length > 0) {
        this.userSockets.set(userId, filtered);
      } else {
        this.userSockets.delete(userId);
      }
    }

    this.logger.log(`Client disconnected: ${client.id} (user ${userId})`);
  }

  // ------------------------------------------------------------------
  // Public API — used by other services to push events
  // ------------------------------------------------------------------

  /**
   * Send an event to every connected socket for the given user.
   */
  sendToUser(userId: string, event: string, data: unknown): void {
    const sockets = this.userSockets.get(userId);
    if (!sockets || sockets.length === 0) {
      this.logger.debug(`No active sockets for user ${userId} — event "${event}" dropped`);
      return;
    }
    for (const socket of sockets) {
      socket.emit(event, data);
    }
  }

  /**
   * Broadcast a timeline update to a specific user.
   */
  emitTimelineUpdate(userId: string, payload: Record<string, unknown>): void {
    this.sendToUser(userId, 'timeline:update', payload);
  }

  /**
   * Notify a coach that one of their clients completed an item.
   */
  emitCoachClientUpdate(coachUserId: string, payload: Record<string, unknown>): void {
    this.sendToUser(coachUserId, 'coach:client-update', payload);
  }

  /**
   * Push a real-time notification to the user.
   */
  emitNotification(userId: string, payload: { title: string; body: string; [key: string]: unknown }): void {
    this.sendToUser(userId, 'notification', payload);
  }

  /**
   * Returns true if the user has at least one connected socket.
   */
  isUserOnline(userId: string): boolean {
    return (this.userSockets.get(userId)?.length ?? 0) > 0;
  }

  /**
   * Returns the count of all connected sockets (useful for health checks).
   */
  getConnectionCount(): number {
    let count = 0;
    for (const sockets of this.userSockets.values()) {
      count += sockets.length;
    }
    return count;
  }

  // ------------------------------------------------------------------
  // Inbound message handlers
  // ------------------------------------------------------------------

  /**
   * Clients can subscribe to this to confirm the connection is alive.
   */
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket): { event: string; data: string } {
    return { event: 'pong', data: new Date().toISOString() };
  }

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  private extractToken(client: Socket): string | null {
    // 1. Socket.IO auth object (preferred)
    const authToken = (client.handshake.auth as Record<string, string>)?.token;
    if (authToken) return authToken;

    // 2. Authorization header (Bearer <token>)
    const authHeader = client.handshake.headers?.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    // 3. Query parameter fallback
    const queryToken = client.handshake.query?.token as string | undefined;
    if (queryToken) return queryToken;

    return null;
  }

  private async verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET ?? 'dev-secret',
      });
      return payload;
    } catch {
      return null;
    }
  }
}
