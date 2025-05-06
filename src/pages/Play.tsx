import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import ChessBoard from "@/components/ChessBoard";
import ChessTimer from "@/components/ChessTimer";
import MoveHistory from "@/components/MoveHistory";
import GameControls from "@/components/GameControls";
import WinnerModal from "@/components/WinnerModal";
import { initialGameState, GameState, makeMove, getLegalMoves, generateAiMove, PieceColor } from "@/lib/chess-engine";
import { useTheme } from "@/components/ThemeProvider";

const Play = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isAIActive, setIsAIActive] = useState(false);
  const [winReason, setWinReason] = useState<'checkmate' | 'resignation' | 'timeout' | null>(null);
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

  // Handle square click
  const handleSquareClick = (row: number, col: number) => {
    if (winner) return;
    
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
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [isAIActive, winner, currentPlayer, gameState]);

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
        <h1 className="text-3xl font-bold text-center mb-8">Chess Game</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Chess board and timers */}
            <div className="bg-card p-4 rounded-lg shadow-md">
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
                />
              </div>
              
              {/* Player timer (white) */}
              <ChessTimer
                time={whiteTime}
                active={currentPlayer === 'white' && !winner}
                color="white"
                onTimeout={handleTimeout}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Game controls */}
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
            
            {/* Move history */}
            <MoveHistory moves={moves} />
          </div>
        </div>
      </main>
      
      {/* Winner modal */}
      {winner && (
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
