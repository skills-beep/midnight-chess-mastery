
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Volume2, 
  VolumeX,
  Music,
  Music2
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SoundManager from "@/utils/soundManager";

export default function SoundControls() {
  const [sfxVolume, setSfxVolume] = useState(70);
  const [musicVolume, setMusicVolume] = useState(30);
  const [sfxMuted, setSfxMuted] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  
  // Initialize sound manager
  useEffect(() => {
    const soundManager = SoundManager.getInstance();
    
    // Set initial values from sound manager
    setSfxVolume(soundManager.getSfxVolume());
    setMusicVolume(soundManager.getMusicVolume());
    setSfxMuted(soundManager.isSfxMuted());
    setMusicMuted(soundManager.isMusicMuted());
    
    // Start playing background music when component mounts
    if (!soundManager.isMusicMuted()) {
      soundManager.playMusic();
    }
    
    // Clean up when component unmounts
    return () => {
      soundManager.pauseMusic();
    };
  }, []);
  
  const handleSfxVolumeChange = (val: number[]) => {
    const volume = val[0];
    setSfxVolume(volume);
    const soundManager = SoundManager.getInstance();
    soundManager.setSfxVolume(volume);
    
    if (volume === 0) {
      setSfxMuted(true);
      soundManager.toggleSfxMute(true);
    } else if (sfxMuted) {
      setSfxMuted(false);
      soundManager.toggleSfxMute(false);
    }
    
    // Play a sound effect to demonstrate volume change
    if (volume > 0) {
      soundManager.playSoundEffect('move');
    }
  };
  
  const handleMusicVolumeChange = (val: number[]) => {
    const volume = val[0];
    setMusicVolume(volume);
    const soundManager = SoundManager.getInstance();
    soundManager.setMusicVolume(volume);
    
    if (volume === 0) {
      setMusicMuted(true);
      soundManager.toggleMusicMute(true);
    } else if (musicMuted) {
      setMusicMuted(false);
      soundManager.toggleMusicMute(false);
    }
  };
  
  const handleSfxMuteToggle = () => {
    const newMuteState = !sfxMuted;
    setSfxMuted(newMuteState);
    const soundManager = SoundManager.getInstance();
    soundManager.toggleSfxMute(newMuteState);
  };
  
  const handleMusicMuteToggle = () => {
    const newMuteState = !musicMuted;
    setMusicMuted(newMuteState);
    const soundManager = SoundManager.getInstance();
    soundManager.toggleMusicMute(newMuteState);
  };
  
  return (
    <div className="flex gap-6">
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Sound Effects</div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={handleSfxMuteToggle}
              >
                {sfxMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{sfxMuted ? "Unmute" : "Mute"} Sound Effects</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Slider 
          value={[sfxMuted ? 0 : sfxVolume]} 
          min={0} 
          max={100} 
          step={1}
          onValueChange={handleSfxVolumeChange}
        />
      </div>
      
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Music</div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={handleMusicMuteToggle}
              >
                {musicMuted ? <Music2 className="h-4 w-4" /> : <Music className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{musicMuted ? "Unmute" : "Mute"} Music</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Slider 
          value={[musicMuted ? 0 : musicVolume]} 
          min={0} 
          max={100} 
          step={1}
          onValueChange={handleMusicVolumeChange}
        />
      </div>
    </div>
  );
}
