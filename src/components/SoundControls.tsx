
import { useState } from "react";
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

export default function SoundControls() {
  const [sfxVolume, setSfxVolume] = useState(70);
  const [musicVolume, setMusicVolume] = useState(30);
  const [sfxMuted, setSfxMuted] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  
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
                onClick={() => setSfxMuted(!sfxMuted)}
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
          onValueChange={(val) => {
            setSfxVolume(val[0]);
            if (val[0] === 0) setSfxMuted(true);
            else if (sfxMuted) setSfxMuted(false);
          }}
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
                onClick={() => setMusicMuted(!musicMuted)}
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
          onValueChange={(val) => {
            setMusicVolume(val[0]);
            if (val[0] === 0) setMusicMuted(true);
            else if (musicMuted) setMusicMuted(false);
          }}
        />
      </div>
    </div>
  );
}
