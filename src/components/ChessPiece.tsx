
import React from "react";
import { ChessPiece } from "@/lib/chess-engine";
import { PieceSet } from "./ThemeCustomizer";
import { motion } from "framer-motion";

interface ChessPieceProps {
  piece: ChessPiece;
  pieceSet?: PieceSet;
}

const ChessPieceComponent: React.FC<ChessPieceProps> = ({ piece, pieceSet = "standard" }) => {
  // Unicode chess pieces for different piece sets
  const pieceSets = {
    standard: {
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
    },
    modern: {
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
    },
    minimalist: {
      white: {
        king: "K",
        queen: "Q",
        rook: "R",
        bishop: "B",
        knight: "N",
        pawn: "P",
      },
      black: {
        king: "k",
        queen: "q",
        rook: "r",
        bishop: "b",
        knight: "n",
        pawn: "p",
      },
    },
    cartoon: {
      white: {
        king: "♚",
        queen: "♛",
        rook: "♜",
        bishop: "♝",
        knight: "♞",
        pawn: "♟",
      },
      black: {
        king: "♔",
        queen: "♕",
        rook: "♖",
        bishop: "♗",
        knight: "♘",
        pawn: "♙",
      },
    },
  };

  const pieceSymbol = pieceSets[pieceSet][piece.color][piece.type];
  
  // Custom styling for piece sets
  const getPieceStyle = () => {
    const baseStyle = "select-none";
    
    switch (pieceSet) {
      case 'modern':
        return `${baseStyle} text-4xl font-bold ${piece.color === 'white' ? 'text-white drop-shadow-lg' : 'text-black drop-shadow-md'}`;
      case 'minimalist':
        return `${baseStyle} text-3xl font-extrabold ${piece.color === 'white' ? 'text-white' : 'text-black'}`;
      case 'cartoon':
        return `${baseStyle} text-4xl ${piece.color === 'black' ? 'text-white drop-shadow-lg' : 'text-black drop-shadow-md'}`;
      default:
        return `${baseStyle} text-4xl ${piece.color === 'white' ? 'text-white drop-shadow-md' : 'text-black drop-shadow-sm'}`;
    }
  };

  return (
    <motion.div 
      className="w-full h-full flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <span className={getPieceStyle()}>
        {pieceSymbol}
      </span>
    </motion.div>
  );
};

export default ChessPieceComponent;
