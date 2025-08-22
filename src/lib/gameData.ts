export interface GameResult {
  id: string;
  date: string;
  playerColor: 'white' | 'black';
  opponent: 'ai' | 'human';
  opponentName: string;
  result: 'win' | 'loss' | 'draw';
  moves: number;
  timeElapsed: number;
  gameMode: 'classic' | 'blitz' | 'bullet' | 'custom';
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  rating: number;
  ratingChange: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  bestWinStreak: number;
  currentWinStreak: number;
  totalPlayTime: number;
  favoriteGameMode: string;
  achievements: Achievement[];
  createdAt: string;
  lastActive: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'wins' | 'games' | 'streak' | 'time' | 'special';
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  gamesPlayed: number;
  lastActive: string;
}

class GameDataManager {
  private static instance: GameDataManager | null = null;
  private readonly PROFILE_KEY = 'chess_user_profile';
  private readonly GAMES_KEY = 'chess_game_history';
  private readonly LEADERBOARD_KEY = 'chess_leaderboard';

  public static getInstance(): GameDataManager {
    if (!GameDataManager.instance) {
      GameDataManager.instance = new GameDataManager();
    }
    return GameDataManager.instance;
  }

  // User Profile Management
  public createUserProfile(name: string, avatar?: string): UserProfile {
    const profile: UserProfile = {
      id: this.generateId(),
      name,
      avatar,
      rating: 1200,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winRate: 0,
      bestWinStreak: 0,
      currentWinStreak: 0,
      totalPlayTime: 0,
      favoriteGameMode: 'classic',
      achievements: [],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    this.saveUserProfile(profile);
    return profile;
  }

  public getUserProfile(): UserProfile | null {
    const stored = localStorage.getItem(this.PROFILE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    }
    return null;
  }

  public saveUserProfile(profile: UserProfile): void {
    profile.lastActive = new Date().toISOString();
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
  }

  public updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
    const profile = this.getUserProfile();
    if (!profile) return null;

    const updatedProfile = { ...profile, ...updates };
    this.saveUserProfile(updatedProfile);
    return updatedProfile;
  }

  // Game Results Management
  public saveGameResult(result: Omit<GameResult, 'id' | 'date'>): GameResult {
    const gameResult: GameResult = {
      ...result,
      id: this.generateId(),
      date: new Date().toISOString()
    };

    const games = this.getGameHistory();
    games.unshift(gameResult);
    
    // Keep only last 100 games
    if (games.length > 100) {
      games.splice(100);
    }

    localStorage.setItem(this.GAMES_KEY, JSON.stringify(games));
    
    // Update user profile stats
    this.updateStatsFromGameResult(gameResult);
    
    return gameResult;
  }

  public getGameHistory(): GameResult[] {
    const stored = localStorage.getItem(this.GAMES_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing game history:', error);
      }
    }
    return [];
  }

  private updateStatsFromGameResult(result: GameResult): void {
    const profile = this.getUserProfile();
    if (!profile) return;

    profile.gamesPlayed++;
    profile.totalPlayTime += result.timeElapsed;

    if (result.result === 'win') {
      profile.wins++;
      profile.currentWinStreak++;
      profile.bestWinStreak = Math.max(profile.bestWinStreak, profile.currentWinStreak);
      profile.rating += result.ratingChange;
    } else if (result.result === 'loss') {
      profile.losses++;
      profile.currentWinStreak = 0;
      profile.rating += result.ratingChange; // Usually negative
    } else {
      profile.draws++;
      profile.currentWinStreak = 0;
      profile.rating += result.ratingChange; // Usually small positive or zero
    }

    profile.winRate = profile.gamesPlayed > 0 ? (profile.wins / profile.gamesPlayed) * 100 : 0;
    profile.rating = Math.max(600, profile.rating); // Minimum rating

    // Check for achievements
    this.checkAchievements(profile);

    this.saveUserProfile(profile);
    this.updateLeaderboard(profile);
  }

  // Leaderboard Management
  public getLeaderboard(): LeaderboardEntry[] {
    const stored = localStorage.getItem(this.LEADERBOARD_KEY);
    if (stored) {
      try {
        const leaderboard = JSON.parse(stored);
        return leaderboard.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.rating - a.rating);
      } catch (error) {
        console.error('Error parsing leaderboard:', error);
      }
    }
    return this.getDefaultLeaderboard();
  }

  private updateLeaderboard(profile: UserProfile): void {
    const leaderboard = this.getLeaderboard();
    const existingIndex = leaderboard.findIndex(entry => entry.userId === profile.id);

    const leaderboardEntry: LeaderboardEntry = {
      userId: profile.id,
      name: profile.name,
      avatar: profile.avatar,
      rating: profile.rating,
      wins: profile.wins,
      losses: profile.losses,
      draws: profile.draws,
      winRate: profile.winRate,
      gamesPlayed: profile.gamesPlayed,
      lastActive: profile.lastActive
    };

    if (existingIndex >= 0) {
      leaderboard[existingIndex] = leaderboardEntry;
    } else {
      leaderboard.push(leaderboardEntry);
    }

    // Keep top 50 players
    leaderboard.sort((a, b) => b.rating - a.rating);
    if (leaderboard.length > 50) {
      leaderboard.splice(50);
    }

    localStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(leaderboard));
  }

  private getDefaultLeaderboard(): LeaderboardEntry[] {
    return [
      {
        userId: 'ai_grandmaster',
        name: 'Chess Grandmaster',
        rating: 2400,
        wins: 1250,
        losses: 200,
        draws: 150,
        winRate: 78.1,
        gamesPlayed: 1600,
        lastActive: new Date().toISOString()
      },
      {
        userId: 'ai_master',
        name: 'Chess Master',
        rating: 2100,
        wins: 890,
        losses: 310,
        draws: 100,
        winRate: 68.5,
        gamesPlayed: 1300,
        lastActive: new Date().toISOString()
      },
      {
        userId: 'ai_expert',
        name: 'Chess Expert',
        rating: 1800,
        wins: 650,
        losses: 400,
        draws: 150,
        winRate: 54.2,
        gamesPlayed: 1200,
        lastActive: new Date().toISOString()
      }
    ];
  }

  // Achievements System
  private checkAchievements(profile: UserProfile): void {
    const achievements: Achievement[] = [];

    // First win achievement
    if (profile.wins === 1 && !profile.achievements.find(a => a.id === 'first_win')) {
      achievements.push({
        id: 'first_win',
        name: 'First Victory',
        description: 'Win your first game',
        icon: '🏆',
        unlockedAt: new Date().toISOString(),
        category: 'wins'
      });
    }

    // Win streak achievements
    if (profile.currentWinStreak === 5 && !profile.achievements.find(a => a.id === 'win_streak_5')) {
      achievements.push({
        id: 'win_streak_5',
        name: 'Winning Streak',
        description: 'Win 5 games in a row',
        icon: '🔥',
        unlockedAt: new Date().toISOString(),
        category: 'streak'
      });
    }

    // Games played achievements
    if (profile.gamesPlayed === 10 && !profile.achievements.find(a => a.id === 'games_10')) {
      achievements.push({
        id: 'games_10',
        name: 'Getting Started',
        description: 'Play 10 games',
        icon: '🎮',
        unlockedAt: new Date().toISOString(),
        category: 'games'
      });
    }

    // Rating achievements
    if (profile.rating >= 1500 && !profile.achievements.find(a => a.id === 'rating_1500')) {
      achievements.push({
        id: 'rating_1500',
        name: 'Rising Star',
        description: 'Reach 1500 rating',
        icon: '⭐',
        unlockedAt: new Date().toISOString(),
        category: 'wins'
      });
    }

    // Add new achievements to profile
    profile.achievements.push(...achievements);
  }

  // Rating Calculations
  public calculateRatingChange(
    playerRating: number,
    opponentRating: number,
    result: 'win' | 'loss' | 'draw'
  ): number {
    const K = 32; // K-factor for rating calculation
    const expected = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    
    let actual: number;
    switch (result) {
      case 'win': actual = 1; break;
      case 'loss': actual = 0; break;
      case 'draw': actual = 0.5; break;
    }

    return Math.round(K * (actual - expected));
  }

  // Utility functions
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  public getGameStats() {
    const profile = this.getUserProfile();
    const games = this.getGameHistory();
    
    if (!profile) return null;

    const last30Days = games.filter(game => {
      const gameDate = new Date(game.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return gameDate >= thirtyDaysAgo;
    });

    return {
      profile,
      recentGames: games.slice(0, 10),
      monthlyStats: {
        gamesPlayed: last30Days.length,
        wins: last30Days.filter(g => g.result === 'win').length,
        losses: last30Days.filter(g => g.result === 'loss').length,
        draws: last30Days.filter(g => g.result === 'draw').length,
      }
    };
  }
}

export default GameDataManager;