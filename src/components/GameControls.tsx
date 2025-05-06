
import React from "react";
import { Button } from "@/components/ui/button";
import { GameStatus, PieceColor } from "@/lib/chess-engine";

interface GameControlsProps {
  onNewGame: () => void;
  onResign: () => void;
  onUndoMove: () => void;
  canUndo: boolean;
  status: GameStatus;
  currentPlayer: PieceColor;
  onToggleAI: () => void;
  isAIActive: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onResign,
  onUndoMove,
  canUndo,
  status,
  currentPlayer,
  onToggleAI,
  isAIActive,
}) => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={onNewGame} className="w-full" variant="default">
          New Game
        </Button>
        
        <Button 
          onClick={onResign} 
          className="w-full" 
          variant="outline"
          disabled={status !== "playing"}
        >
          Resign
        </Button>
        
        <Button 
          onClick={onUndoMove} 
          className="w-full" 
          variant="outline"
          disabled={!canUndo || status !== "playing"}
        >
          Undo
        </Button>
        
        <Button 
          onClick={onToggleAI} 
          className="w-full" 
          variant={isAIActive ? "secondary" : "outline"}
        >
          {isAIActive ? "AI: On" : "AI: Off"}
        </Button>
      </div>
      
      <div className="mt-4 text-center">
        {status === "playing" && (
          <p>
            <span className="font-medium">Current turn: </span>
            <span className={currentPlayer === "white" ? "text-white bg-black px-2 py-0.5 rounded" : "text-black bg-white px-2 py-0.5 rounded"}>
              {currentPlayer === "white" ? "White" : "Black"}
            </span>
          </p>
        )}
        {status === "check" && (
          <p className="text-red-500 font-medium">Check!</p>
        )}
        {status === "checkmate" && (
          <p className="text-red-500 font-medium">Checkmate!</p>
        )}
        {status === "stalemate" && (
          <p className="font-medium">Stalemate!</p>
        )}
        {status === "draw" && (
          <p className="font-medium">Draw!</p>
        )}
      </div>
    </div>
  );
};

export default GameControls;
