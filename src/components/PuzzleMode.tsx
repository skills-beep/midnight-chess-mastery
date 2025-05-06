
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Puzzle } from "lucide-react";
import { useState } from "react";

interface PuzzleCategory {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  count: number;
  completed: number;
}

interface PuzzleModeProps {
  categories: PuzzleCategory[];
  onSelectCategory: (categoryId: string) => void;
}

export default function PuzzleMode({ categories, onSelectCategory }: PuzzleModeProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-lg font-medium">Chess Puzzles</h3>
        <Puzzle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="p-3 rounded-md border flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onSelectCategory(category.id)}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{category.name}</h4>
                  <Badge variant={
                    category.difficulty === 'beginner' ? 'secondary' : 
                    category.difficulty === 'intermediate' ? 'default' : 
                    'destructive'
                  }>
                    {category.difficulty}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {category.completed}/{category.count} completed
                </div>
              </div>
              
              <Button size="sm" variant="ghost">
                {category.completed === category.count ? "Practice" : "Continue"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
