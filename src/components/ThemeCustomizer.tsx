
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Palette } from "lucide-react";
import { motion } from "framer-motion";

export type BoardTheme = 'classic' | 'emerald' | 'midnight' | 'coral' | 'purple' | 'blue';
export type PieceSet = 'standard' | 'modern' | 'minimalist' | 'cartoon';

interface ThemeCustomizerProps {
  boardTheme: BoardTheme;
  pieceSet: PieceSet;
  onBoardThemeChange: (theme: BoardTheme) => void;
  onPieceSetChange: (set: PieceSet) => void;
}

const boardThemes = {
  classic: { light: '#F0D9B5', dark: '#B58863', name: 'Classic' },
  emerald: { light: '#ADEFD1', dark: '#00A36C', name: 'Emerald' },
  midnight: { light: '#DEE3E6', dark: '#556877', name: 'Midnight' },
  coral: { light: '#FFE4B5', dark: '#CD5C5C', name: 'Coral' },
  purple: { light: '#D6BCFA', dark: '#9B87F5', name: 'Purple' },
  blue: { light: '#BEE3F8', dark: '#3182CE', name: 'Blue' }
};

const pieceSets = {
  standard: { icon: '♟', name: 'Standard' },
  modern: { icon: '♙', name: 'Modern' },
  minimalist: { icon: '♞', name: 'Minimalist' },
  cartoon: { icon: '♘', name: 'Cartoon' }
};

export default function ThemeCustomizer({ 
  boardTheme, 
  pieceSet, 
  onBoardThemeChange, 
  onPieceSetChange 
}: ThemeCustomizerProps) {
  const [hoveredTheme, setHoveredTheme] = useState<BoardTheme | null>(null);
  const [hoveredPiece, setHoveredPiece] = useState<PieceSet | null>(null);
  
  return (
    <Card className="overflow-hidden border-primary/10 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-primary/5">
        <h3 className="text-lg font-medium">Customize</h3>
        <Palette className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="board" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="board">Board Theme</TabsTrigger>
            <TabsTrigger value="pieces">Piece Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="board" className="space-y-4">
            <RadioGroup 
              value={boardTheme} 
              onValueChange={(value) => onBoardThemeChange(value as BoardTheme)}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {(Object.keys(boardThemes) as BoardTheme[]).map((theme) => (
                <motion.div 
                  key={theme} 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onMouseEnter={() => setHoveredTheme(theme)}
                  onMouseLeave={() => setHoveredTheme(null)}
                >
                  <RadioGroupItem 
                    value={theme} 
                    id={`board-${theme}`} 
                    className="sr-only" 
                  />
                  <Label 
                    htmlFor={`board-${theme}`}
                    className="cursor-pointer w-full"
                  >
                    <div className={`
                      h-20 w-full rounded-lg grid grid-cols-2 grid-rows-2 overflow-hidden
                      ${boardTheme === theme ? 'ring-2 ring-primary shadow-lg' : 
                      hoveredTheme === theme ? 'ring-1 ring-primary/50 shadow-md' : 'ring-1 ring-border'}
                      transition-all duration-200
                    `}>
                      <div style={{ backgroundColor: boardThemes[theme].light }}></div>
                      <div style={{ backgroundColor: boardThemes[theme].dark }}></div>
                      <div style={{ backgroundColor: boardThemes[theme].dark }}></div>
                      <div style={{ backgroundColor: boardThemes[theme].light }}></div>
                    </div>
                    <p className="mt-1 text-center text-sm font-medium">{boardThemes[theme].name}</p>
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </TabsContent>
          
          <TabsContent value="pieces" className="space-y-4">
            <RadioGroup 
              value={pieceSet} 
              onValueChange={(value) => onPieceSetChange(value as PieceSet)}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {(Object.keys(pieceSets) as PieceSet[]).map((set) => (
                <motion.div 
                  key={set} 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onMouseEnter={() => setHoveredPiece(set)}
                  onMouseLeave={() => setHoveredPiece(null)}
                >
                  <RadioGroupItem 
                    value={set} 
                    id={`pieces-${set}`} 
                    className="sr-only" 
                  />
                  <Label 
                    htmlFor={`pieces-${set}`}
                    className="cursor-pointer w-full"
                  >
                    <div className={`
                      aspect-square flex items-center justify-center rounded-lg border
                      ${pieceSet === set ? 'ring-2 ring-primary bg-primary/5 shadow-lg' : 
                      hoveredPiece === set ? 'ring-1 ring-primary/50 bg-primary/5 shadow-md' : 
                      'ring-1 ring-border hover:bg-muted/50'}
                      transition-all duration-200
                    `}>
                      <div className="text-3xl">{pieceSets[set].icon}</div>
                    </div>
                    <p className="mt-1 text-center text-sm font-medium">{pieceSets[set].name}</p>
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
