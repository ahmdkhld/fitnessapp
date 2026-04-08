import { JwtService } from '@nestjs/jwt';
import { WsGateway } from './ws.gateway';
import { Socket } from 'socket.io';

describe('WsGateway', () => {
  let gateway: WsGateway;
  let jwtService: JwtService;

  const makeSocket = (overrides: Partial<Socket> = {}): Socket => {
    const socket = {
      id: `socket-${Math.random().toString(36).slice(2, 8)}`,
      handshake: {
        auth: {},
        headers: {},
        query: {},
      },
      emit: jest.fn(),
      join: jest.fn(),
      disconnect: jest.fn(),
      ...overrides,
    } as unknown as Socket;
    return socket;
  };

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    jwtService = new JwtService({ secret: 'test-secret' });
    gateway = new WsGateway(jwtService);
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe('handleConnection', () => {
    it('rejects a connection with no token', async () => {
      const client = makeSocket();

      await gateway.handleConnection(client);

      expect(client.emit).toHaveBeenCalledWith('error', {
        message: 'Authentication required',
      });
      expect(client.disconnect).toHaveBeenCalledWith(true);
    });

    it('rejects a connection with an invalid token', async () => {
      const client = makeSocket({
        handshake: {
          auth: { token: 'bad-token' },
          headers: {},
          query: {},
        } as any,
      });

      await gateway.handleConnection(client);

      expect(client.emit).toHaveBeenCalledWith('error', {
        message: 'Invalid or expired token',
      });
      expect(client.disconnect).toHaveBeenCalledWith(true);
    });

    it('accepts a connection with a valid auth.token', async () => {
      const token = jwtService.sign({ sub: 'user-1', email: 'a@b.com', role: 'client' });
      const client = makeSocket({
        handshake: {
          auth: { token },
          headers: {},
          query: {},
        } as any,
      });

      await gateway.handleConnection(client);

      expect(client.disconnect).not.toHaveBeenCalled();
      expect(client.join).toHaveBeenCalledWith('user:user-1');
      expect(gateway.isUserOnline('user-1')).toBe(true);
    });

    it('accepts a connection with a Bearer header', async () => {
      const token = jwtService.sign({ sub: 'user-2', email: 'b@c.com', role: 'client' });
      const client = makeSocket({
        handshake: {
          auth: {},
          headers: { authorization: `Bearer ${token}` },
          query: {},
        } as any,
      });

      await gateway.handleConnection(client);

      expect(client.disconnect).not.toHaveBeenCalled();
      expect(gateway.isUserOnline('user-2')).toBe(true);
    });

    it('accepts a connection with a query param token', async () => {
      const token = jwtService.sign({ sub: 'user-3', email: 'c@d.com', role: 'client' });
      const client = makeSocket({
        handshake: {
          auth: {},
          headers: {},
          query: { token },
        } as any,
      });

      await gateway.handleConnection(client);

      expect(client.disconnect).not.toHaveBeenCalled();
      expect(gateway.isUserOnline('user-3')).toBe(true);
    });
  });

  describe('handleDisconnect', () => {
    it('removes the socket from the user map', async () => {
      const token = jwtService.sign({ sub: 'user-1', email: 'a@b.com', role: 'client' });
      const client = makeSocket({
        handshake: { auth: { token }, headers: {}, query: {} } as any,
      });

      await gateway.handleConnection(client);
      expect(gateway.isUserOnline('user-1')).toBe(true);

      gateway.handleDisconnect(client);
      expect(gateway.isUserOnline('user-1')).toBe(false);
    });

    it('keeps other sockets when one disconnects', async () => {
      const token = jwtService.sign({ sub: 'user-1', email: 'a@b.com', role: 'client' });
      const client1 = makeSocket({
        handshake: { auth: { token }, headers: {}, query: {} } as any,
      });
      const client2 = makeSocket({
        handshake: { auth: { token }, headers: {}, query: {} } as any,
      });

      await gateway.handleConnection(client1);
      await gateway.handleConnection(client2);
      expect(gateway.getConnectionCount()).toBe(2);

      gateway.handleDisconnect(client1);
      expect(gateway.isUserOnline('user-1')).toBe(true);
      expect(gateway.getConnectionCount()).toBe(1);
    });
  });

  describe('sendToUser', () => {
    it('emits the event to all of a users sockets', async () => {
      const token = jwtService.sign({ sub: 'user-1', email: 'a@b.com', role: 'client' });
      const client1 = makeSocket({
        handshake: { auth: { token }, headers: {}, query: {} } as any,
      });
      const client2 = makeSocket({
        handshake: { auth: { token }, headers: {}, query: {} } as any,
      });

      await gateway.handleConnection(client1);
      await gateway.handleConnection(client2);

      gateway.sendToUser('user-1', 'notification', { title: 'Hi' });

      expect(client1.emit).toHaveBeenCalledWith('notification', { title: 'Hi' });
      expect(client2.emit).toHaveBeenCalledWith('notification', { title: 'Hi' });
    });

    it('does not throw when user has no connected sockets', () => {
      expect(() =>
        gateway.sendToUser('nonexistent', 'notification', { title: 'test' }),
      ).not.toThrow();
    });
  });

  describe('emitNotification', () => {
    it('sends a notification event to the user', async () => {
      const token = jwtService.sign({ sub: 'user-1', email: 'a@b.com', role: 'client' });
      const client = makeSocket({
        handshake: { auth: { token }, headers: {}, query: {} } as any,
      });

      await gateway.handleConnection(client);
      gateway.emitNotification('user-1', { title: 'Meal time', body: 'Eat now' });

      expect(client.emit).toHaveBeenCalledWith('notification', {
        title: 'Meal time',
        body: 'Eat now',
      });
    });
  });

  describe('emitTimelineUpdate', () => {
    it('sends a timeline:update event', async () => {
      const token = jwtService.sign({ sub: 'user-1', email: 'a@b.com', role: 'client' });
      const client = makeSocket({
        handshake: { auth: { token }, headers: {}, query: {} } as any,
      });

      await gateway.handleConnection(client);
      gateway.emitTimelineUpdate('user-1', { itemId: '42', status: 'completed' });

      expect(client.emit).toHaveBeenCalledWith('timeline:update', {
        itemId: '42',
        status: 'completed',
      });
    });
  });

  describe('emitCoachClientUpdate', () => {
    it('sends a coach:client-update event', async () => {
      const token = jwtService.sign({ sub: 'coach-1', email: 'coach@x.com', role: 'coach' });
      const client = makeSocket({
        handshake: { auth: { token }, headers: {}, query: {} } as any,
      });

      await gateway.handleConnection(client);
      gateway.emitCoachClientUpdate('coach-1', {
        clientId: 'c1',
        item: 'workout',
        status: 'done',
      });

      expect(client.emit).toHaveBeenCalledWith('coach:client-update', {
        clientId: 'c1',
        item: 'workout',
        status: 'done',
      });
    });
  });

  describe('handlePing', () => {
    it('returns a pong with an ISO timestamp', () => {
      const client = makeSocket();
      const result = gateway.handlePing(client);
      expect(result.event).toBe('pong');
      expect(() => new Date(result.data)).not.toThrow();
    });
  });

  describe('getConnectionCount', () => {
    it('returns 0 when no clients are connected', () => {
      expect(gateway.getConnectionCount()).toBe(0);
    });
  });
});
