
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Palette } from "lucide-react";

export type BoardTheme = 'classic' | 'emerald' | 'midnight' | 'coral';
export type PieceSet = 'standard' | 'modern' | 'minimalist' | 'cartoon';

interface ThemeCustomizerProps {
  boardTheme: BoardTheme;
  pieceSet: PieceSet;
  onBoardThemeChange: (theme: BoardTheme) => void;
  onPieceSetChange: (set: PieceSet) => void;
}

const boardThemes = {
  classic: { light: '#F0D9B5', dark: '#B58863' },
  emerald: { light: '#ADEFD1', dark: '#00A36C' },
  midnight: { light: '#DEE3E6', dark: '#556877' },
  coral: { light: '#FFE4B5', dark: '#CD5C5C' }
};

export default function ThemeCustomizer({ 
  boardTheme, 
  pieceSet, 
  onBoardThemeChange, 
  onPieceSetChange 
}: ThemeCustomizerProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-lg font-medium">Customize</h3>
        <Palette className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="board" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="board">Board Theme</TabsTrigger>
            <TabsTrigger value="pieces">Piece Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="board" className="space-y-4">
            <RadioGroup 
              value={boardTheme} 
              onValueChange={(value) => onBoardThemeChange(value as BoardTheme)}
              className="flex flex-wrap gap-3"
            >
              {(Object.keys(boardThemes) as BoardTheme[]).map((theme) => (
                <div key={theme} className="flex items-center">
                  <RadioGroupItem 
                    value={theme} 
                    id={`board-${theme}`} 
                    className="sr-only" 
                  />
                  <Label 
                    htmlFor={`board-${theme}`}
                    className="cursor-pointer"
                  >
                    <div className={`h-16 w-16 rounded-md grid grid-cols-2 grid-rows-2 overflow-hidden border-2 ${boardTheme === theme ? 'ring-2 ring-primary' : 'ring-1 ring-border'}`}>
                      <div style={{ backgroundColor: boardThemes[theme].light }}></div>
                      <div style={{ backgroundColor: boardThemes[theme].dark }}></div>
                      <div style={{ backgroundColor: boardThemes[theme].dark }}></div>
                      <div style={{ backgroundColor: boardThemes[theme].light }}></div>
                    </div>
                    <p className="mt-1 text-center text-xs capitalize">{theme}</p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
          
          <TabsContent value="pieces" className="space-y-4">
            <RadioGroup 
              value={pieceSet} 
              onValueChange={(value) => onPieceSetChange(value as PieceSet)}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {['standard', 'modern', 'minimalist', 'cartoon'].map((set) => (
                <div key={set} className="flex items-center">
                  <RadioGroupItem 
                    value={set} 
                    id={`pieces-${set}`} 
                    className="sr-only" 
                  />
                  <Label 
                    htmlFor={`pieces-${set}`}
                    className="cursor-pointer w-full"
                  >
                    <div className={`aspect-square flex items-center justify-center rounded-md border ${pieceSet === set ? 'ring-2 ring-primary' : 'ring-1 ring-border'}`}>
                      <div className="text-2xl">{set === 'standard' ? '♟' : set === 'modern' ? '♙' : set === 'minimalist' ? '♞' : '♘'}</div>
                    </div>
                    <p className="mt-1 text-center text-xs capitalize">{set}</p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
