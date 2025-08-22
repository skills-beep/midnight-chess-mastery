import { GameState, ChessSquare, PieceColor } from './chess-engine';

export interface GameRoom {
  id: string;
  name: string;
  host: Player;
  guest?: Player;
  gameState: GameState;
  status: 'waiting' | 'playing' | 'finished';
  timeControl: TimeControl;
  isPrivate: boolean;
  password?: string;
  createdAt: string;
  spectators: Spectator[];
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  color?: PieceColor;
  connected: boolean;
  lastSeen: string;
}

export interface Spectator {
  id: string;
  name: string;
  joinedAt: string;
}

export interface GameMessage {
  type: 'move' | 'chat' | 'join' | 'leave' | 'offer_draw' | 'resign' | 'reconnect';
  playerId: string;
  data?: any;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: string;
  type: 'message' | 'system';
}

export type TimeControl = {
  initial: number; // seconds
  increment: number; // seconds per move
  name: string;
};

class MultiplayerManager {
  private static instance: MultiplayerManager | null = null;
  private rooms: Map<string, GameRoom> = new Map();
  private eventHandlers: Map<string, Function[]> = new Map();
  private currentPlayer: Player | null = null;
  private currentRoom: GameRoom | null = null;
  private connectionStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
  private simulatedLatency = 100; // ms

  public static getInstance(): MultiplayerManager {
    if (!MultiplayerManager.instance) {
      MultiplayerManager.instance = new MultiplayerManager();
    }
    return MultiplayerManager.instance;
  }

  // Connection Management
  public connect(player: Player): Promise<void> {
    return new Promise((resolve) => {
      this.connectionStatus = 'connecting';
      this.currentPlayer = player;
      
      // Simulate connection delay
      setTimeout(() => {
        this.connectionStatus = 'connected';
        this.emit('connected', { player });
        resolve();
      }, this.simulatedLatency);
    });
  }

  public disconnect(): void {
    if (this.currentRoom && this.currentPlayer) {
      this.leaveRoom(this.currentRoom.id);
    }
    this.connectionStatus = 'disconnected';
    this.currentPlayer = null;
    this.emit('disconnected', {});
  }

  public getConnectionStatus(): string {
    return this.connectionStatus;
  }

  // Room Management
  public createRoom(roomData: {
    name: string;
    timeControl: TimeControl;
    isPrivate?: boolean;
    password?: string;
  }): Promise<GameRoom> {
    return new Promise((resolve, reject) => {
      if (!this.currentPlayer) {
        reject(new Error('Player not connected'));
        return;
      }

      const room: GameRoom = {
        id: this.generateRoomId(),
        name: roomData.name,
        host: this.currentPlayer,
        gameState: this.createInitialGameState(roomData.timeControl),
        status: 'waiting',
        timeControl: roomData.timeControl,
        isPrivate: roomData.isPrivate || false,
        password: roomData.password,
        createdAt: new Date().toISOString(),
        spectators: []
      };

      this.rooms.set(room.id, room);
      this.currentRoom = room;
      
      setTimeout(() => {
        this.emit('roomCreated', { room });
        resolve(room);
      }, this.simulatedLatency);
    });
  }

  public joinRoom(roomId: string, password?: string): Promise<GameRoom> {
    return new Promise((resolve, reject) => {
      if (!this.currentPlayer) {
        reject(new Error('Player not connected'));
        return;
      }

      const room = this.rooms.get(roomId);
      if (!room) {
        reject(new Error('Room not found'));
        return;
      }

      if (room.isPrivate && room.password !== password) {
        reject(new Error('Invalid password'));
        return;
      }

      if (room.guest) {
        reject(new Error('Room is full'));
        return;
      }

      // Join as guest player
      room.guest = this.currentPlayer;
      room.status = 'playing';
      
      // Assign colors randomly
      const hostColor: PieceColor = Math.random() > 0.5 ? 'white' : 'black';
      room.host.color = hostColor;
      room.guest.color = hostColor === 'white' ? 'black' : 'white';
      
      this.currentRoom = room;
      
      setTimeout(() => {
        this.emit('roomJoined', { room });
        this.emit('gameStarted', { room });
        resolve(room);
      }, this.simulatedLatency);
    });
  }

  public leaveRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room || !this.currentPlayer) return;

    if (room.host.id === this.currentPlayer.id) {
      // Host is leaving, end the game
      this.rooms.delete(roomId);
    } else if (room.guest && room.guest.id === this.currentPlayer.id) {
      // Guest is leaving
      room.guest = undefined;
      room.status = 'waiting';
    }

    this.currentRoom = null;
    this.emit('roomLeft', { roomId });
  }

  public getAvailableRooms(): GameRoom[] {
    return Array.from(this.rooms.values())
      .filter(room => !room.isPrivate && room.status === 'waiting')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getCurrentRoom(): GameRoom | null {
    return this.currentRoom;
  }

  // Game Actions
  public makeMove(from: ChessSquare, to: ChessSquare): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.currentRoom || !this.currentPlayer) {
        reject(new Error('No active game'));
        return;
      }

      const room = this.currentRoom;
      if (room.gameState.currentPlayer !== this.currentPlayer.color) {
        reject(new Error('Not your turn'));
        return;
      }

      // Simulate network delay for move
      setTimeout(() => {
        const message: GameMessage = {
          type: 'move',
          playerId: this.currentPlayer!.id,
          data: { from, to },
          timestamp: new Date().toISOString()
        };

        this.emit('moveReceived', { message, room });
        resolve();
      }, this.simulatedLatency);
    });
  }

  public sendChatMessage(message: string): void {
    if (!this.currentRoom || !this.currentPlayer) return;

    const chatMessage: ChatMessage = {
      id: this.generateId(),
      playerId: this.currentPlayer.id,
      playerName: this.currentPlayer.name,
      message,
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    setTimeout(() => {
      this.emit('chatMessage', { message: chatMessage, room: this.currentRoom });
    }, this.simulatedLatency / 2);
  }

  public offerDraw(): void {
    if (!this.currentRoom || !this.currentPlayer) return;

    const message: GameMessage = {
      type: 'offer_draw',
      playerId: this.currentPlayer.id,
      timestamp: new Date().toISOString()
    };

    setTimeout(() => {
      this.emit('drawOffered', { message, room: this.currentRoom });
    }, this.simulatedLatency);
  }

  public resign(): void {
    if (!this.currentRoom || !this.currentPlayer) return;

    const message: GameMessage = {
      type: 'resign',
      playerId: this.currentPlayer.id,
      timestamp: new Date().toISOString()
    };

    setTimeout(() => {
      this.emit('playerResigned', { message, room: this.currentRoom });
    }, this.simulatedLatency);
  }

  // Event System
  public on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  public off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  // Time Controls
  public static getTimeControls(): TimeControl[] {
    return [
      { initial: 180, increment: 2, name: "Blitz 3+2" },
      { initial: 300, increment: 3, name: "Blitz 5+3" },
      { initial: 600, increment: 5, name: "Rapid 10+5" },
      { initial: 900, increment: 10, name: "Rapid 15+10" },
      { initial: 1800, increment: 0, name: "Classical 30+0" }
    ];
  }

  // Utility Methods
  private createInitialGameState(timeControl: TimeControl): GameState {
    // Import and use the initialGameState from chess-engine
    const { initialGameState } = require('./chess-engine');
    const gameState = initialGameState();
    gameState.whiteTime = timeControl.initial;
    gameState.blackTime = timeControl.initial;
    return gameState;
  }

  private generateRoomId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // AI Simulation for testing
  public simulateOpponent(room: GameRoom): void {
    if (!room.guest) {
      // Add AI opponent
      const aiPlayer: Player = {
        id: 'ai_opponent',
        name: 'AI Opponent',
        rating: 1200,
        color: room.host.color === 'white' ? 'black' : 'white',
        connected: true,
        lastSeen: new Date().toISOString()
      };
      
      room.guest = aiPlayer;
      room.status = 'playing';
      
      this.emit('gameStarted', { room });
    }
  }
}

export default MultiplayerManager;