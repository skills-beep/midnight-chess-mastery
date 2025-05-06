import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ChessBoard from "@/components/ChessBoard";
import ChessTimer from "@/components/ChessTimer";
import MoveHistory from "@/components/MoveHistory";
import GameControls from "@/components/GameControls";
import WinnerModal from "@/components/WinnerModal";
import Footer from "@/components/Footer";
import UserProfile, { UserStats } from "@/components/UserProfile";
import AISettings, { AIDifficulty } from "@/components/AISettings";
import ThemeCustomizer, { BoardTheme, PieceSet } from "@/components/ThemeCustomizer";
import PuzzleMode from "@/components/PuzzleMode";
import Leaderboard from "@/components/Leaderboard";
import MultiplayerMode from "@/components/MultiplayerMode";
import Achievements from "@/components/Achievements";
import SoundControls from "@/components/SoundControls";
import PostGameAnalysis from "@/components/PostGameAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { initialGameState, GameState, makeMove, getLegalMoves, generateAiMove, PieceColor } from "@/lib/chess-engine";
import { useTheme } from "@/components/ThemeProvider";

const Play = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isAIActive, setIsAIActive] = useState(false);
  const [aiDifficulty, setAIDifficulty] = useState<AIDifficulty>('medium');
  const [winReason, setWinReason] = useState<'checkmate' | 'resignation' | 'timeout' | null>(null);
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('classic');
  const [pieceSet, setPieceSet] = useState<PieceSet>('standard');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState("game");
  
  const { theme } = useTheme();
  
  const {
    board,
    currentPlayer,
    moves,
    status,
    whiteTime,
    blackTime,
    selectedSquare,
    legalMoves,
    whiteInCheck,
    blackInCheck,
    winner
  } = gameState;

  // Mock data for components
  const userStats: UserStats = {
    name: "Player",
    rating: 1200,
    wins: 24,
    losses: 12,
    draws: 8
  };
  
  const mockLeaderboardPlayers = [
    { id: '1', name: 'GrandMaster42', rating: 2305, wins: 352, losses: 121 },
    { id: '2', name: 'ChessWizard', rating: 2186, wins: 201, losses: 98 },
    { id: '3', name: 'QueenSlayer', rating: 2054, wins: 178, losses: 102 },
    { id: '4', name: 'KnightRider', rating: 1876, wins: 145, losses: 89 },
    { id: '5', name: 'BishopMove', rating: 1743, wins: 132, losses: 114 },
  ];
  
  const mockFriends = [
    { id: '1', name: 'Alice', status: 'online' as const },
    { id: '2', name: 'Bob', status: 'playing' as const },
    { id: '3', name: 'Charlie', status: 'online' as const },
  ];
  
  const mockPuzzleCategories = [
    { id: 'tactics', name: 'Tactical Puzzles', difficulty: 'beginner' as const, count: 20, completed: 8 },
    { id: 'endgame', name: 'Endgame Studies', difficulty: 'intermediate' as const, count: 15, completed: 3 },
    { id: 'opening', name: 'Opening Traps', difficulty: 'advanced' as const, count: 10, completed: 0 },
  ];
  
  const mockAchievements = [
    { id: '1', name: 'First Win', description: 'Win your first chess game', icon: '🏆', unlocked: true },
    { id: '2', name: 'Checkmate Master', description: 'Checkmate opponent in under 10 moves', icon: '⚡', unlocked: false },
    { id: '3', name: 'Strategist', description: 'Win 5 games in a row', icon: '🧠', unlocked: true },
    { id: '4', name: 'Puzzle Solver', description: 'Complete 10 puzzles', icon: '🧩', unlocked: false, progress: 8, total: 10 },
    { id: '5', name: 'Grandmaster', description: 'Reach 2000 rating', icon: '👑', unlocked: false, progress: 1200, total: 2000 },
    { id: '6', name: 'Dedicated', description: 'Play 50 games', icon: '🕒', unlocked: false, progress: 32, total: 50 },
  ];
  
  const mockGameStats = {
    accuracy: { white: 85, black: 73 },
    moveEvaluations: Array(10).fill(0).map((_, i) => ({
      move: i + 1,
      whiteEval: Math.random() * 2 - 1,
      blackEval: Math.random() * 2 - 1,
    })),
    piecesCaptured: { 
      white: { pawn: 3, knight: 1, bishop: 1, rook: 0, queen: 0 },
      black: { pawn: 2, knight: 1, bishop: 0, rook: 1, queen: 0 }
    },
    blunders: { white: 1, black: 3 },
    checks: { white: 4, black: 2 }
  };

  // Handle square click
  const handleSquareClick = (row: number, col: number) => {
    if (winner || showAnalysis) return;
    
    const piece = board[row][col];
    
    // If no square is selected and the clicked square has a piece of the current player
    if (!selectedSquare && piece && piece.color === currentPlayer) {
      const moves = getLegalMoves(board, row, col);
      setGameState(prev => ({
        ...prev,
        selectedSquare: { row, col },
        legalMoves: moves,
      }));
      return;
    }
    
    // If a square is selected and the clicked square is a legal move
    if (selectedSquare && legalMoves.some(move => move.row === row && move.col === col)) {
      const newGameState = makeMove(gameState, selectedSquare, { row, col });
      setGameState(newGameState);
      return;
    }
    
    // If a square is selected but the clicked square is not a legal move
    if (selectedSquare) {
      // If the clicked square has a piece of the current player, select it
      if (piece && piece.color === currentPlayer) {
        const moves = getLegalMoves(board, row, col);
        setGameState(prev => ({
          ...prev,
          selectedSquare: { row, col },
          legalMoves: moves,
        }));
        return;
      }
      
      // Otherwise, deselect the square
      setGameState(prev => ({
        ...prev,
        selectedSquare: null,
        legalMoves: [],
      }));
      return;
    }
  };
  
  // Handle new game
  const handleNewGame = () => {
    setGameState(initialGameState());
    setWinReason(null);
    setShowAnalysis(false);
  };
  
  // Handle resign
  const handleResign = () => {
    if (winner || status !== 'playing') return;
    
    setGameState(prev => ({
      ...prev,
      winner: prev.currentPlayer === 'white' ? 'black' : 'white',
      status: 'checkmate',
    }));
    
    setWinReason('resignation');
  };
  
  // Handle undo move
  const handleUndoMove = () => {
    if (moves.length === 0) return;
    
    const newMoves = [...moves];
    newMoves.pop();
    
    // Reconstruct the board from the initial state and moves
    let newBoard = initialGameState().board;
    let newCurrentPlayer: PieceColor = 'white';
    
    for (const move of newMoves) {
      const { from, to } = move;
      const piece = newBoard[from.row][from.col];
      
      if (piece) {
        newBoard[to.row][to.col] = { ...piece, hasMoved: true };
        newBoard[from.row][from.col] = null;
        newCurrentPlayer = newCurrentPlayer === 'white' ? 'black' : 'white';
      }
    }
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: newCurrentPlayer,
      moves: newMoves,
      selectedSquare: null,
      legalMoves: [],
      status: 'playing',
      winner: null,
    }));
    
    setWinReason(null);
    setShowAnalysis(false);
  };
  
  // Handle timeout
  const handleTimeout = () => {
    if (winner) return;
    
    setGameState(prev => ({
      ...prev,
      winner: prev.currentPlayer === 'white' ? 'black' : 'white',
      status: 'checkmate',
    }));
    
    setWinReason('timeout');
  };
  
  // Handle AI move
  const handleAIMove = useCallback(() => {
    if (!isAIActive || winner || currentPlayer === 'white') return;
    
    // Add a delay to make it feel more natural
    const timeoutId = setTimeout(() => {
      const aiMove = generateAiMove(gameState);
      
      if (aiMove) {
        const newGameState = makeMove(gameState, aiMove.from, aiMove.to);
        setGameState(newGameState);
      }
    }, aiDifficulty === 'easy' ? 800 : aiDifficulty === 'medium' ? 500 : 300);
    
    return () => clearTimeout(timeoutId);
  }, [isAIActive, winner, currentPlayer, gameState, aiDifficulty]);

  // Run AI move when it's black's turn and AI is active
  useEffect(() => {
    if (isAIActive && currentPlayer === 'black' && !winner) {
      handleAIMove();
    }
  }, [isAIActive, currentPlayer, winner, handleAIMove]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-8 md:container">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            className="text-3xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Chess Game
          </motion.h1>
          
          {showAnalysis ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <PostGameAnalysis 
                moves={moves}
                stats={mockGameStats}
                playerColor="white"
                onReplay={() => setShowAnalysis(false)}
              />
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowAnalysis(false)}>
                  Back to Game
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="mb-8">
                  <TabsList className="w-full justify-start border-b pb-px rounded-none">
                    <TabsTrigger value="game" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Game</TabsTrigger>
                    <TabsTrigger value="puzzle" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Puzzles</TabsTrigger>
                    <TabsTrigger value="leaderboard" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Leaderboard</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="game" className="m-0 outline-none">
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                      <UserProfile userStats={userStats} />
                      
                      <AISettings 
                        currentDifficulty={aiDifficulty}
                        onDifficultyChange={setAIDifficulty}
                      />
                      
                      <ThemeCustomizer
                        boardTheme={boardTheme}
                        pieceSet={pieceSet}
                        onBoardThemeChange={setBoardTheme}
                        onPieceSetChange={setPieceSet}
                      />
                    </div>
                    
                    {/* Chessboard (center) */}
                    <div className="lg:col-span-1 space-y-6">
                      {/* Chess board and timers */}
                      <motion.div 
                        className="bg-card p-4 rounded-lg shadow-md"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {/* Opponent timer (black) */}
                        <ChessTimer
                          time={blackTime}
                          active={currentPlayer === 'black' && !winner}
                          color="black"
                          onTimeout={handleTimeout}
                        />
                        
                        {/* Chess board */}
                        <div className="my-4">
                          <ChessBoard
                            board={board}
                            currentPlayer={currentPlayer}
                            selectedSquare={selectedSquare}
                            legalMoves={legalMoves}
                            onSquareClick={handleSquareClick}
                            whiteInCheck={whiteInCheck}
                            blackInCheck={blackInCheck}
                            boardTheme={boardTheme}
                            pieceSet={pieceSet}
                          />
                        </div>
                        
                        {/* Player timer (white) */}
                        <ChessTimer
                          time={whiteTime}
                          active={currentPlayer === 'white' && !winner}
                          color="white"
                          onTimeout={handleTimeout}
                        />
                      </motion.div>
                      
                      {/* Game controls */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <GameControls
                          onNewGame={handleNewGame}
                          onResign={handleResign}
                          onUndoMove={handleUndoMove}
                          canUndo={moves.length > 0}
                          status={status}
                          currentPlayer={currentPlayer}
                          onToggleAI={() => setIsAIActive(!isAIActive)}
                          isAIActive={isAIActive}
                        />
                      </motion.div>
                      
                      {/* Sound Controls */}
                      <motion.div
                        className="bg-card p-4 rounded-lg shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <h3 className="text-lg font-medium mb-4">Sound Controls</h3>
                        <SoundControls />
                      </motion.div>
                    </div>
                    
                    {/* Right sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                      {/* Move history */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <div className="bg-card p-4 rounded-lg shadow-md">
                          <h3 className="text-lg font-medium mb-4">Move History</h3>
                          <MoveHistory moves={moves} />
                          
                          {winner && (
                            <div className="mt-4 flex justify-center">
                              <Button onClick={() => setShowAnalysis(true)}>
                                View Analysis
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                      
                      <MultiplayerMode 
                        friends={mockFriends}
                        onFindMatch={() => {}}
                        onInviteFriend={() => {}}
                      />
                      
                      <Achievements achievements={mockAchievements} />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="puzzle" className="m-0 outline-none">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <PuzzleMode 
                        categories={mockPuzzleCategories}
                        onSelectCategory={() => {}}
                      />
                    </div>
                    
                    <div className="md:col-span-1 lg:col-span-2">
                      <div className="bg-card p-6 rounded-lg shadow-md text-center h-full flex flex-col justify-center items-center">
                        <h3 className="text-xl font-bold mb-4">Chess Puzzles</h3>
                        <p className="text-muted-foreground mb-6">
                          Select a puzzle category from the left panel to start solving chess puzzles.
                        </p>
                        <div className="text-7xl mb-6">🧩</div>
                        <p className="text-sm text-muted-foreground">
                          Puzzles help improve your tactical and strategic thinking
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="leaderboard" className="m-0 outline-none">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Leaderboard 
                        globalPlayers={mockLeaderboardPlayers}
                        friendsPlayers={mockLeaderboardPlayers.slice(2, 4)}
                      />
                    </div>
                    
                    <div className="lg:col-span-1">
                      <UserProfile userStats={userStats} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Winner modal */}
      {winner && !showAnalysis && (
        <WinnerModal
          winner={winner}
          reason={winReason}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
};

export default Play;
