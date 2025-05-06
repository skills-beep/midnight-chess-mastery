import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2 } from "lucide-react";
import { ChessMove } from "@/lib/chess-engine";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface GameStats {
  accuracy: {
    white: number;
    black: number;
  };
  moveEvaluations: {
    move: number;
    whiteEval: number;
    blackEval: number;
  }[];
  piecesCaptured: {
    white: { [key: string]: number };
    black: { [key: string]: number };
  };
  blunders: {
    white: number;
    black: number;
  };
  checks: {
    white: number;
    black: number;
  };
}

interface PostGameAnalysisProps {
  moves: ChessMove[];
  stats: GameStats;
  playerColor: 'white' | 'black';
  onReplay: () => void;
}

export default function PostGameAnalysis({ 
  moves, 
  stats, 
  playerColor, 
  onReplay 
}: PostGameAnalysisProps) {
  const capturedPiecesData = Object.entries(stats.piecesCaptured.white).map(([piece, count]) => ({
    name: piece,
    white: count,
    black: stats.piecesCaptured.black[piece] || 0,
  }));

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-lg font-medium">Game Analysis</h3>
        <BarChart2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="moves">Moves</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium">Your Accuracy</p>
                <p className="text-2xl font-bold">
                  {playerColor === 'white' ? stats.accuracy.white : stats.accuracy.black}%
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Opponent Accuracy</p>
                <p className="text-2xl font-bold">
                  {playerColor === 'white' ? stats.accuracy.black : stats.accuracy.white}%
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Blunders</p>
                <p className="text-2xl font-bold">
                  {playerColor === 'white' ? stats.blunders.white : stats.blunders.black}
                </p>
              </div>
            </div>
            
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.moveEvaluations}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="move" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="whiteEval" stackId="1" stroke="#f8fafc" fill="#f8fafc" />
                  <Area type="monotone" dataKey="blackEval" stackId="1" stroke="#1e293b" fill="#1e293b" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button onClick={onReplay}>
                Replay Game
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="moves" className="pt-4">
            <div className="max-h-[400px] overflow-y-auto space-y-1">
              {moves.map((move, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-md ${
                    move.evaluation && move.evaluation < -0.5 ? 'bg-red-500/10' : 
                    move.evaluation && move.evaluation > 0.5 ? 'bg-green-500/10' : 
                    'hover:bg-muted/50'
                  } transition-colors`}
                >
                  <div>
                    <span className="font-mono text-muted-foreground mr-2">{Math.floor(idx/2) + 1}.</span>
                    {move.notation}
                  </div>
                  {move.suggestion && (
                    <div className="text-sm text-muted-foreground">
                      Better: {move.suggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="pt-4">
            <div className="space-y-6">
              <div className="h-[200px]">
                <h4 className="text-sm font-medium mb-2">Captured Pieces</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={capturedPiecesData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="white" fill="#f8fafc" name="White" />
                    <Bar dataKey="black" fill="#1e293b" name="Black" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">White</h4>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Checks Given:</span>
                      <span>{stats.checks.white}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Blunders:</span>
                      <span>{stats.blunders.white}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Black</h4>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Checks Given:</span>
                      <span>{stats.checks.black}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Blunders:</span>
                      <span>{stats.blunders.black}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
