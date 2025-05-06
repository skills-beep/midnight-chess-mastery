
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface LeaderboardPlayer {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  wins: number;
  losses: number;
}

interface LeaderboardProps {
  globalPlayers: LeaderboardPlayer[];
  friendsPlayers?: LeaderboardPlayer[];
}

export default function Leaderboard({ globalPlayers, friendsPlayers = [] }: LeaderboardProps) {
  const [tab, setTab] = useState<string>("global");

  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-medium">Leaderboard</h3>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="global" value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="global" className="space-y-1">
            {globalPlayers.map((player, index) => (
              <LeaderboardRow 
                key={player.id} 
                player={player} 
                rank={index + 1} 
                showMedal={index < 3}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="friends" className="space-y-1">
            {friendsPlayers.length > 0 ? (
              friendsPlayers.map((player, index) => (
                <LeaderboardRow 
                  key={player.id} 
                  player={player} 
                  rank={index + 1} 
                  showMedal={index < 3}
                />
              ))
            ) : (
              <div className="text-center p-4">
                <p className="text-sm text-muted-foreground">No friends added yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function LeaderboardRow({ 
  player, 
  rank, 
  showMedal = false 
}: { 
  player: LeaderboardPlayer; 
  rank: number; 
  showMedal?: boolean;
}) {
  const getMedalColor = (rank: number) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-zinc-400";
    if (rank === 3) return "text-amber-700";
    return "";
  };
  
  const initials = player.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
    
  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-6 text-center font-medium ${showMedal ? getMedalColor(rank) : ""}`}>
          {showMedal ? (
            <span>
              {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
            </span>
          ) : rank}
        </div>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src={player.avatar} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        
        <div>
          <p className="font-medium text-sm">{player.name}</p>
          <p className="text-xs text-muted-foreground">
            {player.wins}W / {player.losses}L
          </p>
        </div>
      </div>
      
      <div className="font-bold">{player.rating}</div>
    </div>
  );
}
