
import { useState, useEffect } from "react";
import { ChessPiece, ChessSquare, PieceColor, ChessBoard as BoardType, getLegalMoves } from "@/lib/chess-engine";
import ChessPieceComponent from "./ChessPiece";

interface ChessBoardProps {
  board: BoardType;
  currentPlayer: PieceColor;
  selectedSquare: ChessSquare | null;
  legalMoves: ChessSquare[];
  onSquareClick: (row: number, col: number) => void;
  whiteInCheck: boolean;
  blackInCheck: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  currentPlayer,
  selectedSquare,
  legalMoves,
  onSquareClick,
  whiteInCheck,
  blackInCheck,
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
    
    return (
      <div 
        key={`${row}-${col}`}
        className={`
          relative w-full aspect-square
          ${isLight ? 'bg-chessWhite' : 'bg-chessDark'}
          ${isSelected ? 'ring-2 ring-primary' : ''}
          transition-all duration-150
        `}
        onClick={() => onSquareClick(row, col)}
      >
        {isLegal && (
          <div className={`
            absolute inset-0 bg-chessLegalMove rounded-full m-auto
            ${piece ? 'w-full h-full' : 'w-1/4 h-1/4'}
          `} />
        )}
        
        {inCheck && (
          <div className="absolute inset-0 bg-chessCheck" />
        )}
        
        {showRank && (
          <span className={`
            absolute top-0.5 left-0.5 text-xs font-bold
            ${isLight ? 'text-chessDark' : 'text-chessWhite'}
          `}>
            {ranks[displayRow]}
          </span>
        )}
        
        {showFile && (
          <span className={`
            absolute bottom-0.5 right-0.5 text-xs font-bold
            ${isLight ? 'text-chessDark' : 'text-chessWhite'}
          `}>
            {files[displayCol]}
          </span>
        )}
        
        {piece && <ChessPieceComponent piece={piece} />}
      </div>
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
    <div className="relative w-full max-w-md mx-auto">
      <div className="chessboard-grid">{squares}</div>
      <div className="mt-2 flex justify-center">
        <button
          onClick={() => setFlipped(!flipped)}
          className="px-3 py-1 text-sm bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
        >
          Flip Board
        </button>
      </div>
    </div>
  );
};

export default ChessBoard;
