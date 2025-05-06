
class SoundManager {
  private static instance: SoundManager | null = null;
  private backgroundMusic: HTMLAudioElement | null = null;
  private soundEffects: Map<string, HTMLAudioElement> = new Map();
  private musicVolume: number = 30;
  private sfxVolume: number = 70;
  private musicMuted: boolean = false;
  private sfxMuted: boolean = false;

  private constructor() {
    // Initialize background music
    this.backgroundMusic = new Audio('/sounds/chess-background.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = this.musicVolume / 100;

    // Initialize sound effects
    this.loadSoundEffect('move', '/sounds/move.mp3');
    this.loadSoundEffect('capture', '/sounds/capture.mp3');
    this.loadSoundEffect('check', '/sounds/check.mp3');
    this.loadSoundEffect('castle', '/sounds/castle.mp3');
    this.loadSoundEffect('promote', '/sounds/promote.mp3');
    this.loadSoundEffect('victory', '/sounds/victory.mp3');
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private loadSoundEffect(name: string, path: string): void {
    const audio = new Audio(path);
    audio.volume = this.sfxVolume / 100;
    this.soundEffects.set(name, audio);
  }

  public playMusic(): void {
    if (this.backgroundMusic && !this.musicMuted) {
      this.backgroundMusic.play().catch(error => {
        console.error('Error playing background music:', error);
      });
    }
  }

  public pauseMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  public playSoundEffect(name: string): void {
    if (this.sfxMuted) return;
    
    const sound = this.soundEffects.get(name);
    if (sound) {
      // Clone the audio to allow overlapping sounds
      const soundClone = sound.cloneNode(true) as HTMLAudioElement;
      soundClone.volume = this.sfxVolume / 100;
      soundClone.play().catch(error => {
        console.error(`Error playing sound effect ${name}:`, error);
      });
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
}

export default SoundManager;
