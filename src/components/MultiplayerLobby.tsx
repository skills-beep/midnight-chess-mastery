import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Users, Plus, Clock, Globe, Lock, Wifi, WifiOff, Crown } from 'lucide-react';
import MultiplayerManager, { GameRoom, Player, TimeControl, ChatMessage } from '@/lib/multiplayer';
import GameDataManager from '@/lib/gameData';

interface MultiplayerLobbyProps {
  onGameStart: (room: GameRoom) => void;
  onClose: () => void;
}

export default function MultiplayerLobby({ onGameStart, onClose }: MultiplayerLobbyProps) {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [availableRooms, setAvailableRooms] = useState<GameRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [joinRoomOpen, setJoinRoomOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<GameRoom | null>(null);
  const [roomPassword, setRoomPassword] = useState('');
  
  const multiplayer = MultiplayerManager.getInstance();
  const gameData = GameDataManager.getInstance();

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        setConnectionStatus('connecting');
        
        let userProfile = gameData.getUserProfile();
        if (!userProfile) {
          userProfile = gameData.createUserProfile('Player' + Math.floor(Math.random() * 1000));
        }

        const player: Player = {
          id: userProfile.id,
          name: userProfile.name,
          avatar: userProfile.avatar,
          rating: userProfile.rating,
          connected: true,
          lastSeen: new Date().toISOString()
        };

        await multiplayer.connect(player);
        setConnectionStatus('connected');
        loadAvailableRooms();
      } catch (error) {
        console.error('Failed to connect:', error);
        setConnectionStatus('disconnected');
        toast.error('Failed to connect to multiplayer service');
      }
    };

    initializeConnection();

    // Set up event listeners
    const handleRoomCreated = ({ room }: { room: GameRoom }) => {
      setCurrentRoom(room);
      toast.success('Room created successfully!');
    };

    const handleRoomJoined = ({ room }: { room: GameRoom }) => {
      setCurrentRoom(room);
      toast.success('Joined room successfully!');
    };

    const handleGameStarted = ({ room }: { room: GameRoom }) => {
      onGameStart(room);
    };

    const handleChatMessage = ({ message }: { message: ChatMessage }) => {
      setChatMessages(prev => [...prev, message]);
    };

    multiplayer.on('roomCreated', handleRoomCreated);
    multiplayer.on('roomJoined', handleRoomJoined);
    multiplayer.on('gameStarted', handleGameStarted);
    multiplayer.on('chatMessage', handleChatMessage);

    return () => {
      multiplayer.off('roomCreated', handleRoomCreated);
      multiplayer.off('roomJoined', handleRoomJoined);
      multiplayer.off('gameStarted', handleGameStarted);
      multiplayer.off('chatMessage', handleChatMessage);
    };
  }, [multiplayer, gameData, onGameStart]);

  const loadAvailableRooms = () => {
    const rooms = multiplayer.getAvailableRooms();
    setAvailableRooms(rooms);
  };

  const handleCreateRoom = async (roomData: {
    name: string;
    timeControl: TimeControl;
    isPrivate: boolean;
    password?: string;
  }) => {
    try {
      await multiplayer.createRoom(roomData);
      setCreateRoomOpen(false);
    } catch (error) {
      toast.error('Failed to create room');
    }
  };

  const handleJoinRoom = async (room: GameRoom, password?: string) => {
    try {
      await multiplayer.joinRoom(room.id, password);
      setJoinRoomOpen(false);
      setSelectedRoom(null);
      setRoomPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to join room');
    }
  };

  const handleSendMessage = () => {
    if (chatInput.trim() && currentRoom) {
      multiplayer.sendChatMessage(chatInput.trim());
      setChatInput('');
    }
  };

  const handleQuickMatch = () => {
    // Find a suitable room or create one
    const availableRoom = availableRooms[0];
    if (availableRoom) {
      handleJoinRoom(availableRoom);
    } else {
      // Create a quick match room
      handleCreateRoom({
        name: 'Quick Match',
        timeControl: { initial: 300, increment: 3, name: 'Blitz 5+3' },
        isPrivate: false
      });
    }
  };

  if (connectionStatus === 'connecting') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p>Connecting to multiplayer service...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (connectionStatus === 'disconnected') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <WifiOff className="h-12 w-12 text-muted-foreground mx-auto" />
            <p>Failed to connect to multiplayer service</p>
            <Button onClick={() => window.location.reload()}>Retry Connection</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentRoom) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-yellow-500" />
              <div>
                <h3 className="text-lg font-semibold">{currentRoom.name}</h3>
                <p className="text-sm text-muted-foreground">Room ID: {currentRoom.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {currentRoom.timeControl.name}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => {
                multiplayer.leaveRoom(currentRoom.id);
                setCurrentRoom(null);
                onClose();
              }}>
                Leave Room
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Players */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <PlayerCard 
                  player={currentRoom.host} 
                  isHost={true}
                  title="Host"
                />
                {currentRoom.guest ? (
                  <PlayerCard 
                    player={currentRoom.guest} 
                    isHost={false}
                    title="Guest"
                  />
                ) : (
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Users className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">Waiting for opponent...</p>
                      <Button size="sm" onClick={() => multiplayer.simulateOpponent(currentRoom)}>
                        Add AI Opponent
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {currentRoom.status === 'playing' && (
                <div className="text-center">
                  <Button onClick={() => onGameStart(currentRoom)}>
                    Enter Game
                  </Button>
                </div>
              )}
            </div>

            {/* Chat */}
            <div className="space-y-4">
              <h4 className="font-medium">Chat</h4>
              <div className="border rounded-lg">
                <ScrollArea className="h-48 p-3">
                  <div className="space-y-2">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="text-sm">
                        <span className="font-medium">{msg.playerName}:</span>
                        <span className="ml-2">{msg.message}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t p-2 flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button size="sm" onClick={handleSendMessage}>
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Multiplayer Lobby</h3>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rooms" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rooms">Available Rooms</TabsTrigger>
            <TabsTrigger value="create">Create/Join</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rooms" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Public Rooms</h4>
              <Button onClick={loadAvailableRooms} variant="outline" size="sm">
                Refresh
              </Button>
            </div>
            
            {availableRooms.length > 0 ? (
              <div className="grid gap-2">
                {availableRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onJoin={() => handleJoinRoom(room)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No public rooms available</p>
                <Button onClick={handleQuickMatch}>
                  Start Quick Match
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-medium">Quick Actions</h4>
                <Button className="w-full" size="lg" onClick={handleQuickMatch}>
                  Quick Match
                </Button>
                
                <CreateRoomDialog onCreateRoom={handleCreateRoom} />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Join Private Room</h4>
                <JoinPrivateRoomForm onJoinRoom={handleJoinRoom} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function PlayerCard({ player, isHost, title }: { player: Player; isHost: boolean; title: string }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={player.avatar} />
            <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {isHost && <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">{player.name}</p>
            <Badge variant={player.connected ? "default" : "secondary"}>
              {player.connected ? "Online" : "Offline"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Rating: {player.rating}</p>
          {player.color && (
            <p className="text-sm">Playing as {player.color}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function RoomCard({ room, onJoin }: { room: GameRoom; onJoin: () => void }) {
  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-medium">{room.name}</h5>
            <Badge variant="outline">{room.timeControl.name}</Badge>
            {room.isPrivate && <Lock className="h-3 w-3" />}
          </div>
          <p className="text-sm text-muted-foreground">
            Host: {room.host.name} ({room.host.rating})
          </p>
        </div>
        <Button onClick={onJoin}>
          Join
        </Button>
      </div>
    </div>
  );
}

function CreateRoomDialog({ onCreateRoom }: { onCreateRoom: (data: any) => void }) {
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControl | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  
  const timeControls = MultiplayerManager.getTimeControls();

  const handleCreate = () => {
    if (!roomName || !selectedTimeControl) return;
    
    onCreateRoom({
      name: roomName,
      timeControl: selectedTimeControl,
      isPrivate,
      password: isPrivate ? password : undefined
    });
    
    setOpen(false);
    setRoomName('');
    setSelectedTimeControl(null);
    setIsPrivate(false);
    setPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
            />
          </div>
          
          <div>
            <Label>Time Control</Label>
            <Select onValueChange={(value) => {
              const tc = timeControls.find(t => t.name === value);
              setSelectedTimeControl(tc || null);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select time control" />
              </SelectTrigger>
              <SelectContent>
                {timeControls.map((tc) => (
                  <SelectItem key={tc.name} value={tc.name}>
                    {tc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="private"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <Label htmlFor="private">Private Room</Label>
          </div>
          
          {isPrivate && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
          )}
          
          <Button className="w-full" onClick={handleCreate} disabled={!roomName || !selectedTimeControl}>
            Create Room
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function JoinPrivateRoomForm({ onJoinRoom }: { onJoinRoom: (room: GameRoom, password?: string) => void }) {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  
  const handleJoin = () => {
    // For demo purposes, we'll create a mock room
    // In a real implementation, this would fetch the room by ID
    const mockRoom: GameRoom = {
      id: roomId,
      name: 'Private Room',
      host: {
        id: 'host_id',
        name: 'Host Player',
        rating: 1400,
        connected: true,
        lastSeen: new Date().toISOString()
      },
      gameState: {} as any, // Would be properly initialized
      status: 'waiting',
      timeControl: { initial: 300, increment: 3, name: 'Blitz 5+3' },
      isPrivate: true,
      password: 'test',
      createdAt: new Date().toISOString(),
      spectators: []
    };
    
    onJoinRoom(mockRoom, password);
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value.toUpperCase())}
      />
      <Input
        type="password"
        placeholder="Password (if required)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button className="w-full" onClick={handleJoin} disabled={!roomId}>
        Join Private Room
      </Button>
    </div>
  );
}