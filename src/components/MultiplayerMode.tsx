
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'playing';
}

interface MultiplayerModeProps {
  friends: Friend[];
  onFindMatch: () => void;
  onInviteFriend: (friendId: string) => void;
}

export default function MultiplayerMode({ friends, onFindMatch, onInviteFriend }: MultiplayerModeProps) {
  const [inviteCode, setInviteCode] = useState('');
  const onlineFriends = friends.filter(f => f.status !== 'offline');
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-lg font-medium">Multiplayer</h3>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button className="w-full" onClick={onFindMatch}>
            Find Match
          </Button>
          
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
            <Button variant="outline">Join</Button>
          </div>
          
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">Online Friends</h4>
            {onlineFriends.length > 0 ? (
              <div className="space-y-2">
                {onlineFriends.map((friend) => (
                  <FriendRow 
                    key={friend.id} 
                    friend={friend}
                    onInvite={() => onInviteFriend(friend.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-center text-muted-foreground py-2">
                No friends online.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FriendRow({ friend, onInvite }: { friend: Friend, onInvite: () => void }) {
  const initials = friend.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
    
  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={friend.avatar} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ${
            friend.status === 'online' ? 'bg-green-500' : 
            friend.status === 'playing' ? 'bg-yellow-500' : 'bg-gray-500'
          }`} />
        </div>
        
        <div>
          <p className="font-medium text-sm">{friend.name}</p>
          {friend.status === 'playing' && (
            <Badge variant="outline" className="text-xs">In Game</Badge>
          )}
        </div>
      </div>
      
      <Button size="sm" variant="outline" onClick={onInvite} disabled={friend.status === 'playing'}>
        {friend.status === 'playing' ? "Spectate" : "Invite"}
      </Button>
    </div>
  );
}
