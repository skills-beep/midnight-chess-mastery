
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { Settings, Trophy } from "lucide-react";
import { AIDifficulty, getAiRating } from "@/lib/chess-engine";

interface AISettingsProps {
  currentDifficulty: AIDifficulty;
  onDifficultyChange: (difficulty: AIDifficulty) => void;
}

export default function AISettings({ currentDifficulty, onDifficultyChange }: AISettingsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-lg font-medium">AI Opponent</h3>
        <Settings className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RadioGroup 
            value={currentDifficulty} 
            onValueChange={(value) => onDifficultyChange(value as AIDifficulty)}
            className="gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="easy" id="easy" />
              <Label htmlFor="easy" className="flex-1">
                <div className="flex items-center justify-between">
                  <span>Easy</span>
                  <DifficultyBars level={1} />
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="flex-1">
                <div className="flex items-center justify-between">
                  <span>Medium</span>
                  <DifficultyBars level={2} />
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard" className="flex-1">
                <div className="flex items-center justify-between">
                  <span>Hard</span>
                  <DifficultyBars level={3} />
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expert" id="expert" />
              <Label htmlFor="expert" className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>Expert</span>
                    <Trophy className="h-3 w-3 text-yellow-500" />
                  </div>
                  <DifficultyBars level={4} />
                </div>
              </Label>
            </div>
          </RadioGroup>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <div>
              {currentDifficulty === 'easy' && "Perfect for beginners or casual play."}
              {currentDifficulty === 'medium' && "Balanced challenge for intermediate players."}
              {currentDifficulty === 'hard' && "Prepare for a tough match against our advanced AI!"}
              {currentDifficulty === 'expert' && "Master-level AI that will challenge even experienced players."}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium">AI Rating:</span>
              <span className="px-2 py-1 bg-muted rounded text-foreground font-mono">
                {getAiRating(currentDifficulty)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DifficultyBars({ level }: { level: 1 | 2 | 3 | 4 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4].map((bar) => (
        <motion.div
          key={bar}
          initial={{ height: 0 }}
          animate={{ height: 16 }}
          transition={{ delay: bar * 0.1 }}
          className={`w-1.5 rounded-full ${
            bar <= level 
              ? bar === 1 
                ? 'bg-green-500' 
                : bar === 2 
                  ? 'bg-yellow-500' 
                  : bar === 3
                    ? 'bg-red-500'
                    : 'bg-purple-500'
              : 'bg-muted'
          }`}
        />
      ))}
    </div>
  );
}
