import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { User, Trophy, Calendar, Clock, Target, TrendingUp, Medal, Flame } from 'lucide-react';
import GameDataManager, { UserProfile, GameResult, Achievement } from '@/lib/gameData';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdate?: (profile: UserProfile) => void;
}

export default function UserProfileDialog({ open, onOpenChange, onProfileUpdate }: UserProfileDialogProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', avatar: '' });
  
  const gameData = GameDataManager.getInstance();

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

  const loadProfile = () => {
    let userProfile = gameData.getUserProfile();
    
    if (!userProfile) {
      // Create a new profile if none exists
      userProfile = gameData.createUserProfile('New Player');
      toast.success('Welcome! A new profile has been created for you.');
    }
    
    setProfile(userProfile);
    setEditForm({ name: userProfile.name, avatar: userProfile.avatar || '' });
    
    const history = gameData.getGameHistory();
    setGameHistory(history);
  };

  const handleSaveProfile = () => {
    if (!profile || !editForm.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    const updatedProfile = gameData.updateUserProfile({
      name: editForm.name.trim(),
      avatar: editForm.avatar.trim() || undefined
    });

    if (updatedProfile) {
      setProfile(updatedProfile);
      setIsEditing(false);
      onProfileUpdate?.(updatedProfile);
      toast.success('Profile updated successfully!');
    }
  };

  const handleResetStats = () => {
    if (confirm('Are you sure you want to reset all your statistics? This action cannot be undone.')) {
      // Create a new profile with same name but reset stats
      const newProfile = gameData.createUserProfile(profile?.name || 'Player');
      setProfile(newProfile);
      setGameHistory([]);
      onProfileUpdate?.(newProfile);
      toast.success('Statistics have been reset.');
    }
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return 'text-green-600';
    if (winRate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 1800) return 'text-purple-600';
    if (rating >= 1500) return 'text-blue-600';
    if (rating >= 1200) return 'text-green-600';
    return 'text-gray-600';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="history">Game History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Profile Information</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  >
                    {isEditing ? 'Save' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-lg">
                      {profile.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="avatar">Avatar URL</Label>
                          <Input
                            id="avatar"
                            value={editForm.avatar}
                            onChange={(e) => setEditForm(prev => ({ ...prev, avatar: e.target.value }))}
                            placeholder="Enter avatar URL (optional)"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined {formatDate(profile.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Last active {formatDate(profile.lastActive)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className={`text-2xl font-bold ${getRatingColor(profile.rating)}`}>
                      {profile.rating}
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {profile.gamesPlayed}
                    </div>
                    <div className="text-sm text-muted-foreground">Games Played</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className={`text-2xl font-bold ${getWinRateColor(profile.winRate)}`}>
                      {profile.winRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {profile.currentWinStreak}
                    </div>
                    <div className="text-sm text-muted-foreground">Win Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Recent Achievements
                  </h4>
                </CardHeader>
                <CardContent>
                  {profile.achievements.length > 0 ? (
                    <div className="space-y-2">
                      {profile.achievements.slice(0, 3).map((achievement) => (
                        <div key={achievement.id} className="flex items-center gap-2">
                          <span className="text-lg">{achievement.icon}</span>
                          <div>
                            <p className="font-medium text-sm">{achievement.name}</p>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No achievements yet</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Quick Stats
                  </h4>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Wins</span>
                    <span className="font-medium text-green-600">{profile.wins}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Losses</span>
                    <span className="font-medium text-red-600">{profile.losses}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Draws</span>
                    <span className="font-medium text-yellow-600">{profile.draws}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Play Time</span>
                    <span className="font-medium">{formatTime(profile.totalPlayTime)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Best Streak</span>
                    <span className="font-medium flex items-center gap-1">
                      <Flame className="h-3 w-3 text-orange-500" />
                      {profile.bestWinStreak}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Performance Metrics
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Win Rate</span>
                      <span className="text-sm font-medium">{profile.winRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={profile.winRate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Rating Progress</span>
                      <span className="text-sm font-medium">{profile.rating}/2400</span>
                    </div>
                    <Progress value={(profile.rating / 2400) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Experience</span>
                      <span className="text-sm font-medium">{profile.gamesPlayed}/100 games</span>
                    </div>
                    <Progress value={Math.min((profile.gamesPlayed / 100) * 100, 100)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Game Results Breakdown</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Wins</span>
                      </div>
                      <span className="font-medium">{profile.wins}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Losses</span>
                      </div>
                      <span className="font-medium">{profile.losses}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Draws</span>
                      </div>
                      <span className="font-medium">{profile.draws}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleResetStats}
                      className="w-full text-red-600 hover:text-red-700"
                    >
                      Reset Statistics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Recent Games</h3>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  {gameHistory.length > 0 ? (
                    <div className="space-y-2">
                      {gameHistory.map((game) => (
                        <div key={game.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={game.result === 'win' ? 'default' : game.result === 'loss' ? 'destructive' : 'secondary'}
                            >
                              {game.result.toUpperCase()}
                            </Badge>
                            <div>
                              <p className="font-medium text-sm">
                                vs {game.opponentName} ({game.opponent})
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(game.date)} • {game.moves} moves • {formatTime(game.timeElapsed)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {game.ratingChange > 0 ? '+' : ''}{game.ratingChange}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {game.gameMode}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No games played yet</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Medal className="h-4 w-4" />
                  Achievements ({profile.achievements.length})
                </h3>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  {profile.achievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {profile.achievements.map((achievement) => (
                        <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-medium">{achievement.name}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Unlocked {formatDate(achievement.unlockedAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No achievements unlocked yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Start playing games to earn achievements!
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}