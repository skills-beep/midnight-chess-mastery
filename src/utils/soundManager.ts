
class SoundManager {
  private static instance: SoundManager | null = null;
  private backgroundMusic: HTMLAudioElement | null = null;
  private soundEffects: Map<string, HTMLAudioElement> = new Map();
  private musicVolume: number = 30;
  private sfxVolume: number = 70;
  private musicMuted: boolean = false;
  private sfxMuted: boolean = false;
  private isInitialized: boolean = false;
  private preloadPromise: Promise<void> | null = null;

  private constructor() {
    this.initializeAudio();
  }

  private async initializeAudio() {
    try {
      // Initialize background music with error handling
      this.backgroundMusic = new Audio('/sounds/chess-background.mp3');
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.musicVolume / 100;
      this.backgroundMusic.preload = 'auto';
      
      // Handle background music errors
      this.backgroundMusic.onerror = () => {
        console.warn('Background music failed to load, using silence');
        this.backgroundMusic = null;
      };

      // Initialize sound effects with better error handling
      const soundEffects = [
        { name: 'move', url: '/sounds/move.mp3', description: 'Piece move sound' },
        { name: 'capture', url: '/sounds/capture.mp3', description: 'Piece capture sound' },
        { name: 'check', url: '/sounds/check.mp3', description: 'Check alert sound' },
        { name: 'castle', url: '/sounds/castle.mp3', description: 'Castling move sound' },
        { name: 'promote', url: '/sounds/promote.mp3', description: 'Pawn promotion sound' },
        { name: 'victory', url: '/sounds/victory.mp3', description: 'Game victory sound' },
        { name: 'draw', url: '/sounds/draw.mp3', description: 'Game draw sound' },
        { name: 'timewarning', url: '/sounds/timewarning.mp3', description: 'Time warning sound' },
        { name: 'gamestart', url: '/sounds/gamestart.mp3', description: 'Game start sound' },
        { name: 'notification', url: '/sounds/notification.mp3', description: 'General notification sound' }
      ];

      this.preloadPromise = this.preloadSounds(soundEffects);
      await this.preloadPromise;
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing audio:', error);
      this.isInitialized = false;
    }
  }

  private async preloadSounds(sounds: Array<{name: string, url: string, description: string}>): Promise<void> {
    const loadPromises = sounds.map(async (sound) => {
      try {
        await this.loadSoundEffect(sound.name, sound.url);
      } catch (error) {
        console.warn(`Failed to load ${sound.description}: ${error}`);
        // Create a silent audio element as fallback
        this.createSilentAudio(sound.name);
      }
    });

    await Promise.allSettled(loadPromises);
  }

  private createSilentAudio(name: string): void {
    // Create a very short silent audio data URL
    const silentAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCSGH0fPTgjMGHm7A7+OZUQ0PVq3n77BdGAg+ltryxnkpBSl+zPLaizsIGWS57+OZURE');
    silentAudio.volume = 0;
    this.soundEffects.set(name, silentAudio);
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private async loadSoundEffect(name: string, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(path);
      audio.volume = this.sfxVolume / 100;
      audio.preload = 'auto';
      
      audio.oncanplaythrough = () => {
        this.soundEffects.set(name, audio);
        resolve();
      };
      
      audio.onerror = () => {
        reject(new Error(`Failed to load sound: ${path}`));
      };
      
      // Set a timeout to prevent hanging
      setTimeout(() => {
        reject(new Error(`Timeout loading sound: ${path}`));
      }, 5000);
    });
  }

  public async playMusic(): Promise<void> {
    if (this.backgroundMusic && !this.musicMuted && this.isInitialized) {
      try {
        // Fade in the music
        this.backgroundMusic.volume = 0;
        await this.backgroundMusic.play();
        
        const fadeIn = setInterval(() => {
          if (this.backgroundMusic && this.backgroundMusic.volume < this.musicVolume / 100) {
            this.backgroundMusic.volume = Math.min(this.backgroundMusic.volume + 0.02, this.musicVolume / 100);
          } else {
            clearInterval(fadeIn);
          }
        }, 100);
      } catch (error) {
        console.error('Error playing background music:', error);
      }
    }
  }

  public pauseMusic(): void {
    if (this.backgroundMusic) {
      // Fade out the music before pausing
      const fadeOut = setInterval(() => {
        if (this.backgroundMusic && this.backgroundMusic.volume > 0) {
          this.backgroundMusic.volume = Math.max(this.backgroundMusic.volume - 0.05, 0);
        } else {
          if (this.backgroundMusic) {
            this.backgroundMusic.pause();
          }
          clearInterval(fadeOut);
        }
      }, 50);
    }
  }

  public async playSoundEffect(name: string): Promise<void> {
    if (this.sfxMuted || !this.isInitialized) return;
    
    // Wait for initialization if still loading
    if (this.preloadPromise) {
      await this.preloadPromise;
    }
    
    const sound = this.soundEffects.get(name);
    if (sound) {
      try {
        // Clone the audio to allow overlapping sounds
        const soundClone = sound.cloneNode(true) as HTMLAudioElement;
        soundClone.volume = this.sfxVolume / 100;
        
        // Add fade in effect for better UX
        if (name === 'victory' || name === 'gamestart') {
          soundClone.volume = 0;
          const fadeIn = setInterval(() => {
            if (soundClone.volume < this.sfxVolume / 100) {
              soundClone.volume = Math.min(soundClone.volume + 0.1, this.sfxVolume / 100);
            } else {
              clearInterval(fadeIn);
            }
          }, 50);
        }
        
        await soundClone.play();
      } catch (error) {
        console.error(`Error playing sound effect ${name}:`, error);
      }
    }
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = volume;
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = volume / 100;
    }
  }

  public setSfxVolume(volume: number): void {
    this.sfxVolume = volume;
    this.soundEffects.forEach(sound => {
      sound.volume = volume / 100;
    });
  }

  public toggleMusicMute(muted: boolean): void {
    this.musicMuted = muted;
    if (this.backgroundMusic) {
      if (muted) {
        this.backgroundMusic.pause();
      } else {
        this.backgroundMusic.play().catch(error => {
          console.error('Error resuming background music:', error);
        });
      }
    }
  }

  public toggleSfxMute(muted: boolean): void {
    this.sfxMuted = muted;
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public isMusicMuted(): boolean {
    return this.musicMuted;
  }

  public isSfxMuted(): boolean {
    return this.sfxMuted;
  }

  // New methods for enhanced functionality
  public async ensureInitialized(): Promise<void> {
    if (this.preloadPromise) {
      await this.preloadPromise;
    }
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  public getLoadedSounds(): string[] {
    return Array.from(this.soundEffects.keys());
  }

  public playGameStartSequence(): void {
    this.playSoundEffect('gamestart');
    if (!this.musicMuted) {
      setTimeout(() => this.playMusic(), 1000);
    }
  }

  public playGameEndSequence(result: 'win' | 'loss' | 'draw'): void {
    this.pauseMusic();
    setTimeout(() => {
      switch (result) {
        case 'win':
          this.playSoundEffect('victory');
          break;
        case 'loss':
          this.playSoundEffect('defeat');
          break;
        case 'draw':
          this.playSoundEffect('draw');
          break;
      }
    }, 500);
  }

  public playMoveSound(moveType: 'normal' | 'capture' | 'check' | 'castle' | 'promote' = 'normal'): void {
    switch (moveType) {
      case 'capture':
        this.playSoundEffect('capture');
        break;
      case 'check':
        this.playSoundEffect('check');
        break;
      case 'castle':
        this.playSoundEffect('castle');
        break;
      case 'promote':
        this.playSoundEffect('promote');
        break;
      default:
        this.playSoundEffect('move');
    }
  }

  public playNotification(): void {
    this.playSoundEffect('notification');
  }

  public playTimeWarning(): void {
    this.playSoundEffect('timewarning');
  }
}

export default SoundManager;
