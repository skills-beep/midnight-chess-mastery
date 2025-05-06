
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Star } from "lucide-react";

export interface UserStats {
  name: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  avatar?: string;
}

interface UserProfileProps {
  userStats: UserStats;
  compact?: boolean;
}

export default function UserProfile({ userStats, compact = false }: UserProfileProps) {
  const { name, rating, wins, losses, draws, avatar } = userStats;
  const totalGames = wins + losses + draws;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium leading-none">{name}</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500" />
            {rating}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-medium">Player Profile</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <h4 className="text-xl font-semibold">{name}</h4>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{rating}</span>
              <span className="text-muted-foreground">Rating</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Win Rate</span>
              <span>{winRate}%</span>
            </div>
            <Progress value={winRate} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-muted rounded-md">
              <div className="text-xl font-semibold text-green-500">{wins}</div>
              <div className="text-xs text-muted-foreground">Wins</div>
            </div>
            <div className="p-2 bg-muted rounded-md">
              <div className="text-xl font-semibold text-red-500">{losses}</div>
              <div className="text-xs text-muted-foreground">Losses</div>
            </div>
            <div className="p-2 bg-muted rounded-md">
              <div className="text-xl font-semibold">{draws}</div>
              <div className="text-xs text-muted-foreground">Draws</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
