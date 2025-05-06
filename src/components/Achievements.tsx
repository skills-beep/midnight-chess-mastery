
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Award } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

interface AchievementsProps {
  achievements: Achievement[];
}

export default function Achievements({ achievements }: AchievementsProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-lg font-medium">Achievements</h3>
        <div className="text-sm text-muted-foreground">
          {unlockedCount}/{totalCount} Unlocked
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {achievements.map((achievement) => (
            <Tooltip key={achievement.id}>
              <TooltipTrigger asChild>
                <div 
                  className={`aspect-square flex items-center justify-center rounded-md border ${
                    achievement.unlocked 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-muted/40 border-muted/50 opacity-50'
                  }`}
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  {achievement.unlocked && (
                    <div className="absolute bottom-1 right-1">
                      <Award className="h-3 w-3 text-yellow-500" />
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div className="text-center">
                  <p className="font-medium">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  {achievement.progress !== undefined && (
                    <div className="mt-1 text-xs">
                      Progress: {achievement.progress}/{achievement.total}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
