
import React from "react";
import { Button } from "@/components/ui/button";
import { PieceColor } from "@/lib/chess-engine";

interface WinnerModalProps {
  winner: PieceColor | null;
  reason: 'checkmate' | 'resignation' | 'timeout' | null;
  onNewGame: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, reason, onNewGame }) => {
  if (!winner) return null;

  let reasonText = '';
  switch (reason) {
    case 'checkmate':
      reasonText = 'by checkmate';
      break;
    case 'resignation':
      reasonText = 'by resignation';
      break;
    case 'timeout':
      reasonText = 'on time';
      break;
    default:
      reasonText = '';
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4 animate-float-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 animate-winner-celebration">
            {winner === 'white' ? 'White' : 'Black'} wins {reasonText}!
          </h2>
          
          <div className="my-6 text-5xl">
            {winner === 'white' ? '♔' : '♚'}
          </div>
          
          <div className="grid gap-4">
            <Button onClick={onNewGame} size="lg">
              Play Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
