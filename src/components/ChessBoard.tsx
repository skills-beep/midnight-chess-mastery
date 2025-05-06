
import { useState, useEffect } from "react";
import { ChessPiece, ChessSquare, PieceColor, ChessBoard as BoardType, getLegalMoves } from "@/lib/chess-engine";
import ChessPieceComponent from "./ChessPiece";
import { motion } from "framer-motion";
import { BoardTheme, PieceSet } from "./ThemeCustomizer";

interface ChessBoardProps {
  board: BoardType;
  currentPlayer: PieceColor;
  selectedSquare: ChessSquare | null;
  legalMoves: ChessSquare[];
  onSquareClick: (row: number, col: number) => void;
  whiteInCheck: boolean;
  blackInCheck: boolean;
  boardTheme?: BoardTheme;
  pieceSet?: PieceSet;
}

// Theme color mapping
const boardThemes = {
  classic: { light: '#F0D9B5', dark: '#B58863' },
  emerald: { light: '#ADEFD1', dark: '#00A36C' },
  midnight: { light: '#DEE3E6', dark: '#556877' },
  coral: { light: '#FFE4B5', dark: '#CD5C5C' },
  purple: { light: '#D6BCFA', dark: '#9B87F5' },
  blue: { light: '#BEE3F8', dark: '#3182CE' }
};

const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  currentPlayer,
  selectedSquare,
  legalMoves,
  onSquareClick,
  whiteInCheck,
  blackInCheck,
  boardTheme = "classic",
  pieceSet = "standard"
}) => {
  const [flipped, setFlipped] = useState(false);
  
  const isLegalMove = (row: number, col: number) => {
    return legalMoves.some(move => move.row === row && move.col === col);
  };
  
  const isSquareSelected = (row: number, col: number) => {
    return selectedSquare?.row === row && selectedSquare?.col === col;
  };
  
  const isInCheck = (row: number, col: number) => {
    const piece = board[row][col];
    if (!piece || piece.type !== 'king') return false;
    
    return (piece.color === 'white' && whiteInCheck) || 
           (piece.color === 'black' && blackInCheck);
  };
  
  const renderSquare = (row: number, col: number) => {
    const piece = board[row][col];
    const isLight = (row + col) % 2 === 0;
    const isSelected = isSquareSelected(row, col);
    const isLegal = isLegalMove(row, col);
    const inCheck = isInCheck(row, col);
    
    let displayRow = flipped ? 7 - row : row;
    let displayCol = flipped ? 7 - col : col;
    
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    
    const showRank = displayCol === 0;
    const showFile = displayRow === 7;
    
    // Get theme colors
    const theme = boardThemes[boardTheme] || boardThemes.classic;
    const squareColor = isLight ? theme.light : theme.dark;

    return (
      <motion.div 
        key={`${row}-${col}`}
        className={`
          relative w-full aspect-square
          ${isSelected ? 'ring-2 ring-primary shadow-inner' : ''}
          transition-all duration-150
        `}
        style={{ backgroundColor: squareColor }}
        onClick={() => onSquareClick(row, col)}
        whileHover={{ 
          scale: piece || isLegal ? 0.95 : 1,
          boxShadow: piece || isLegal ? "0 0 8px rgba(0,0,0,0.3)" : "none" 
        }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {isLegal && (
          <motion.div 
            className={`
              absolute inset-0 rounded-full m-auto z-10
              ${piece ? 'w-full h-full rounded-none border-2 border-primary/70' : 'w-1/4 h-1/4 bg-primary/40'}
            `}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          />
        )}
        
        {inCheck && (
          <motion.div 
            className="absolute inset-0 bg-red-500/30 z-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
          />
        )}
        
        {showRank && (
          <span className={`
            absolute top-0.5 left-0.5 text-xs font-bold z-20
            ${isLight ? 'text-black/70' : 'text-white/70'}
          `}>
            {ranks[displayRow]}
          </span>
        )}
        
        {showFile && (
          <span className={`
            absolute bottom-0.5 right-0.5 text-xs font-bold z-20
            ${isLight ? 'text-black/70' : 'text-white/70'}
          `}>
            {files[displayCol]}
          </span>
        )}
        
        {piece && (
          <ChessPieceComponent piece={piece} pieceSet={pieceSet} />
        )}
      </motion.div>
    );
  };
  
  const squares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let displayRow = flipped ? 7 - row : row;
      let displayCol = flipped ? 7 - col : col;
      squares.push(renderSquare(displayRow, displayCol));
    }
  }
  
  return (
    <motion.div 
      className="relative w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="chessboard-grid rounded-lg overflow-hidden shadow-xl">{squares}</div>
      <div className="mt-2 flex justify-center">
        <motion.button
          onClick={() => setFlipped(!flipped)}
          className="px-3 py-1 text-sm bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Flip Board
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ChessBoard;
