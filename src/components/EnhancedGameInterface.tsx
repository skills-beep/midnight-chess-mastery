import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Users, Trophy, Settings, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

import UserProfileDialog from './UserProfileDialog';
import MultiplayerLobby from './MultiplayerLobby';
import SoundControls from './SoundControls';
import { AIDifficulty } from '@/lib/chess-engine';
import GameDataManager, { UserProfile } from '@/lib/gameData';
import SoundManager from '@/utils/soundManager';
import { GameRoom } from '@/lib/multiplayer';

interface EnhancedGameInterfaceProps {
  currentDifficulty: AIDifficulty;
  onDifficultyChange: (difficulty: AIDifficulty) => void;
  onNewGame: () => void;
  onStartAIGame: (difficulty: AIDifficulty) => void;
  onStartMultiplayerGame: (room: GameRoom) => void;
  userProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
  gameStats?: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    rating: number;
    winRate: number;
  };
}

export default function EnhancedGameInterface({
  currentDifficulty,
  onDifficultyChange,
  onNewGame,
  onStartAIGame,
  onStartMultiplayerGame,
  userProfile,
  onProfileUpdate,
  gameStats
}: EnhancedGameInterfaceProps) {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showMultiplayerLobby, setShowMultiplayerLobby] = useState(false);
  const [showSoundSettings, setShowSoundSettings] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);
  
  const gameData = GameDataManager.getInstance();
  const soundManager = SoundManager.getInstance();

  useEffect(() => {
    if (userProfile) {
      setAchievements(userProfile.achievements);
    }
  }, [userProfile]);

  const handleAIGameStart = (difficulty: AIDifficulty) => {
    onStartAIGame(difficulty);
    soundManager.playGameStartSequence();
    toast.success(`Starting AI game on ${difficulty} difficulty!`);
  };

  const handleMultiplayerGameStart = (room: GameRoom) => {
    onStartMultiplayerGame(room);
    setShowMultiplayerLobby(false);
    toast.success('Joined multiplayer game!');
  };

  const getDifficultyColor = (difficulty: AIDifficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRatingTier = (rating: number) => {
    if (rating >= 2000) return { name: 'Expert', color: 'text-purple-600', icon: '👑' };
    if (rating >= 1600) return { name: 'Advanced', color: 'text-blue-600', icon: '🏆' };
    if (rating >= 1200) return { name: 'Intermediate', color: 'text-green-600', icon: '⭐' };
    return { name: 'Beginner', color: 'text-gray-600', icon: '🌱' };
  };

  const tier = userProfile ? getRatingTier(userProfile.rating) : null;

  return (
    <div className="space-y-6">
      {/* User Profile Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Player Stats</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowProfileDialog(true)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {userProfile ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{userProfile.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className={tier?.color}>{tier?.icon} {tier?.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {userProfile.rating}
                    </Badge>
                  </div>
                </div>
                {userProfile.currentWinStreak > 0 && (
                  <Badge className="bg-orange-100 text-orange-800">
                    🔥 {userProfile.currentWinStreak} streak
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-green-50 rounded">
                  <div className="font-bold text-green-700">{userProfile.wins}</div>
                  <div className="text-xs text-green-600">Wins</div>
                </div>
                <div className="p-2 bg-red-50 rounded">
                  <div className="font-bold text-red-700">{userProfile.losses}</div>
                  <div className="text-xs text-red-600">Losses</div>
                </div>
                <div className="p-2 bg-yellow-50 rounded">
                  <div className="font-bold text-yellow-700">{userProfile.draws}</div>
                  <div className="text-xs text-yellow-600">Draws</div>
                </div>
              </div>
              
              {userProfile.winRate > 0 && (
                <div className="text-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Win Rate: </span>
                  <span className="font-semibold">{userProfile.winRate.toFixed(1)}%</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-2">Welcome to Chess Master!</p>
              <Button size="sm" onClick={() => setShowProfileDialog(true)}>
                Create Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Game Modes */}
      <Card>
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold">Game Modes</h3>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai">vs AI</TabsTrigger>
              <TabsTrigger value="multiplayer">Multiplayer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Difficulty</span>
                  <Badge className={getDifficultyColor(currentDifficulty)}>
                    {currentDifficulty}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {(['easy', 'medium', 'hard', 'expert'] as AIDifficulty[]).map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={currentDifficulty === difficulty ? "default" : "outline"}
                      size="sm"
                      onClick={() => onDifficultyChange(difficulty)}
                      className="capitalize"
                    >
                      {difficulty}
                    </Button>
                  ))}
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => handleAIGameStart(currentDifficulty)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play vs AI ({currentDifficulty})
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="multiplayer" className="space-y-4 mt-4">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Challenge players from around the world
                </p>
                
                <Button 
                  className="w-full" 
                  onClick={() => setShowMultiplayerLobby(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Enter Multiplayer Lobby
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Recent Achievements
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                  <span className="text-lg">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {achievements.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2" 
                onClick={() => setShowProfileDialog(true)}
              >
                View All Achievements
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full" onClick={onNewGame}>
            New Game
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={() => setShowSoundSettings(true)}
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Sound Settings
          </Button>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <UserProfileDialog 
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        onProfileUpdate={onProfileUpdate}
      />

      {showMultiplayerLobby && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <MultiplayerLobby 
            onGameStart={handleMultiplayerGameStart}
            onClose={() => setShowMultiplayerLobby(false)}
          />
        </div>
      )}

      <Dialog open={showSoundSettings} onOpenChange={setShowSoundSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sound Settings</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <SoundControls />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}