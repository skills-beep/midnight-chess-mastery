
import React from "react";
import { ChessPiece } from "@/lib/chess-engine";

interface ChessPieceProps {
  piece: ChessPiece;
}

const ChessPieceComponent: React.FC<ChessPieceProps> = ({ piece }) => {
  // Unicode chess pieces
  const pieceSymbols = {
    white: {
      king: "♔",
      queen: "♕",
      rook: "♖",
      bishop: "♗",
      knight: "♘",
      pawn: "♙",
    },
    black: {
      king: "♚",
      queen: "♛",
      rook: "♜",
      bishop: "♝",
      knight: "♞",
      pawn: "♟",
    },
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className={`text-4xl select-none ${piece.color === 'white' ? 'text-white drop-shadow-md' : 'text-black drop-shadow-sm'}`}>
        {pieceSymbols[piece.color][piece.type]}
      </span>
    </div>
  );
};

export default ChessPieceComponent;
