
export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface ChessSquare {
  row: number;
  col: number;
}

export interface ChessMove {
  from: ChessSquare;
  to: ChessSquare;
  piece: ChessPiece;
  captured?: ChessPiece;
  promotion?: PieceType;
  notation: string;
}

export type ChessBoard = (ChessPiece | null)[][];

export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';

export interface GameState {
  board: ChessBoard;
  currentPlayer: PieceColor;
  moves: ChessMove[];
  status: GameStatus;
  whiteTime: number;
  blackTime: number;
  selectedSquare: ChessSquare | null;
  legalMoves: ChessSquare[];
  whiteInCheck: boolean;
  blackInCheck: boolean;
  winner: PieceColor | null;
}

// Helper function to clone the board
export const cloneBoard = (board: ChessBoard): ChessBoard => {
  return board.map(row => [...row]);
};

// Initialize a new chess board
export const initialBoard = (): ChessBoard => {
  const board: ChessBoard = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Set up pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'white' };
    board[6][i] = { type: 'pawn', color: 'black' };
  }
  
  // Set up rooks
  board[0][0] = { type: 'rook', color: 'white' };
  board[0][7] = { type: 'rook', color: 'white' };
  board[7][0] = { type: 'rook', color: 'black' };
  board[7][7] = { type: 'rook', color: 'black' };
  
  // Set up knights
  board[0][1] = { type: 'knight', color: 'white' };
  board[0][6] = { type: 'knight', color: 'white' };
  board[7][1] = { type: 'knight', color: 'black' };
  board[7][6] = { type: 'knight', color: 'black' };
  
  // Set up bishops
  board[0][2] = { type: 'bishop', color: 'white' };
  board[0][5] = { type: 'bishop', color: 'white' };
  board[7][2] = { type: 'bishop', color: 'black' };
  board[7][5] = { type: 'bishop', color: 'black' };
  
  // Set up queens
  board[0][3] = { type: 'queen', color: 'white' };
  board[7][3] = { type: 'queen', color: 'black' };
  
  // Set up kings
  board[0][4] = { type: 'king', color: 'white' };
  board[7][4] = { type: 'king', color: 'black' };
  
  return board;
};

// Initialize a new game state
export const initialGameState = (): GameState => {
  return {
    board: initialBoard(),
    currentPlayer: 'white',
    moves: [],
    status: 'playing',
    whiteTime: 600, // 10 minutes in seconds
    blackTime: 600,
    selectedSquare: null,
    legalMoves: [],
    whiteInCheck: false,
    blackInCheck: false,
    winner: null
  };
};

// Check if a square is on the board
export const isValidSquare = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};

// Get all possible moves for a pawn
const getPawnMoves = (
  board: ChessBoard,
  row: number,
  col: number,
  color: PieceColor
): ChessSquare[] => {
  const moves: ChessSquare[] = [];
  const direction = color === 'white' ? 1 : -1;
  const startingRow = color === 'white' ? 1 : 6;
  
  // Move forward one square
  if (isValidSquare(row + direction, col) && !board[row + direction][col]) {
    moves.push({ row: row + direction, col });
    
    // Move forward two squares from starting position
    if (row === startingRow && !board[row + 2 * direction][col]) {
      moves.push({ row: row + 2 * direction, col });
    }
  }
  
  // Capture diagonally
  for (const colOffset of [-1, 1]) {
    const newCol = col + colOffset;
    const newRow = row + direction;
    
    if (isValidSquare(newRow, newCol) && board[newRow][newCol] && board[newRow][newCol]?.color !== color) {
      moves.push({ row: newRow, col: newCol });
    }
  }
  
  return moves;
};

// Get all possible moves for a knight
const getKnightMoves = (
  board: ChessBoard,
  row: number,
  col: number,
  color: PieceColor
): ChessSquare[] => {
  const moves: ChessSquare[] = [];
  const offsets = [
    { row: 2, col: 1 },
    { row: 2, col: -1 },
    { row: -2, col: 1 },
    { row: -2, col: -1 },
    { row: 1, col: 2 },
    { row: 1, col: -2 },
    { row: -1, col: 2 },
    { row: -1, col: -2 },
  ];
  
  for (const offset of offsets) {
    const newRow = row + offset.row;
    const newCol = col + offset.col;
    
    if (isValidSquare(newRow, newCol) && (!board[newRow][newCol] || board[newRow][newCol]?.color !== color)) {
      moves.push({ row: newRow, col: newCol });
    }
  }
  
  return moves;
};

// Get all possible moves for a bishop
const getBishopMoves = (
  board: ChessBoard,
  row: number,
  col: number,
  color: PieceColor
): ChessSquare[] => {
  const moves: ChessSquare[] = [];
  const directions = [
    { row: 1, col: 1 },
    { row: 1, col: -1 },
    { row: -1, col: 1 },
    { row: -1, col: -1 },
  ];
  
  for (const direction of directions) {
    let newRow = row + direction.row;
    let newCol = col + direction.col;
    
    while (isValidSquare(newRow, newCol)) {
      if (!board[newRow][newCol]) {
        moves.push({ row: newRow, col: newCol });
      } else {
        if (board[newRow][newCol]?.color !== color) {
          moves.push({ row: newRow, col: newCol });
        }
        break;
      }
      
      newRow += direction.row;
      newCol += direction.col;
    }
  }
  
  return moves;
};

// Get all possible moves for a rook
const getRookMoves = (
  board: ChessBoard,
  row: number,
  col: number,
  color: PieceColor
): ChessSquare[] => {
  const moves: ChessSquare[] = [];
  const directions = [
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
  ];
  
  for (const direction of directions) {
    let newRow = row + direction.row;
    let newCol = col + direction.col;
    
    while (isValidSquare(newRow, newCol)) {
      if (!board[newRow][newCol]) {
        moves.push({ row: newRow, col: newCol });
      } else {
        if (board[newRow][newCol]?.color !== color) {
          moves.push({ row: newRow, col: newCol });
        }
        break;
      }
      
      newRow += direction.row;
      newCol += direction.col;
    }
  }
  
  return moves;
};

// Get all possible moves for a queen
const getQueenMoves = (
  board: ChessBoard,
  row: number,
  col: number,
  color: PieceColor
): ChessSquare[] => {
  return [
    ...getBishopMoves(board, row, col, color),
    ...getRookMoves(board, row, col, color),
  ];
};

// Get all possible moves for a king
const getKingMoves = (
  board: ChessBoard,
  row: number,
  col: number,
  color: PieceColor
): ChessSquare[] => {
  const moves: ChessSquare[] = [];
  const offsets = [
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
    { row: 1, col: 1 },
    { row: 1, col: -1 },
    { row: -1, col: 1 },
    { row: -1, col: -1 },
  ];
  
  for (const offset of offsets) {
    const newRow = row + offset.row;
    const newCol = col + offset.col;
    
    if (isValidSquare(newRow, newCol) && (!board[newRow][newCol] || board[newRow][newCol]?.color !== color)) {
      moves.push({ row: newRow, col: newCol });
    }
  }
  
  return moves;
};

// Get legal moves for a piece
export const getLegalMoves = (
  board: ChessBoard,
  row: number,
  col: number
): ChessSquare[] => {
  const piece = board[row][col];
  
  if (!piece) return [];
  
  let moves: ChessSquare[] = [];
  
  switch (piece.type) {
    case 'pawn':
      moves = getPawnMoves(board, row, col, piece.color);
      break;
    case 'knight':
      moves = getKnightMoves(board, row, col, piece.color);
      break;
    case 'bishop':
      moves = getBishopMoves(board, row, col, piece.color);
      break;
    case 'rook':
      moves = getRookMoves(board, row, col, piece.color);
      break;
    case 'queen':
      moves = getQueenMoves(board, row, col, piece.color);
      break;
    case 'king':
      moves = getKingMoves(board, row, col, piece.color);
      break;
  }
  
  return moves;
};

// Generate move notation
export const generateMoveNotation = (
  board: ChessBoard,
  from: ChessSquare,
  to: ChessSquare,
  piece: ChessPiece,
  captured?: ChessPiece
): string => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
  
  const fromFile = files[from.col];
  const fromRank = ranks[from.row];
  const toFile = files[to.col];
  const toRank = ranks[to.row];
  
  let notation = '';
  
  switch (piece.type) {
    case 'king':
      notation = 'K';
      break;
    case 'queen':
      notation = 'Q';
      break;
    case 'rook':
      notation = 'R';
      break;
    case 'bishop':
      notation = 'B';
      break;
    case 'knight':
      notation = 'N';
      break;
    case 'pawn':
      notation = captured ? fromFile : '';
      break;
  }
  
  if (captured) {
    notation += 'x';
  }
  
  notation += toFile + toRank;
  
  return notation;
};

// Make a move on the board
export const makeMove = (
  gameState: GameState,
  from: ChessSquare,
  to: ChessSquare
): GameState => {
  const { board, currentPlayer, moves } = gameState;
  const newBoard = cloneBoard(board);
  const piece = newBoard[from.row][from.col];
  
  if (!piece || piece.color !== currentPlayer) {
    return gameState;
  }
  
  const captured = newBoard[to.row][to.col];
  
  // Make the move
  newBoard[to.row][to.col] = { ...piece, hasMoved: true };
  newBoard[from.row][from.col] = null;
  
  // Create move notation
  const notation = generateMoveNotation(board, from, to, piece, captured || undefined);
  
  // Add to move history
  const newMove: ChessMove = {
    from,
    to,
    piece,
    captured: captured || undefined,
    notation,
  };
  
  // Return new game state
  return {
    ...gameState,
    board: newBoard,
    currentPlayer: currentPlayer === 'white' ? 'black' : 'white',
    moves: [...moves, newMove],
    selectedSquare: null,
    legalMoves: [],
  };
};

// Generate a simple AI move
export const generateAiMove = (gameState: GameState): { from: ChessSquare, to: ChessSquare } | null => {
  const { board, currentPlayer } = gameState;
  const aiPieces: { piece: ChessPiece, row: number, col: number }[] = [];
  
  // Find all AI pieces
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        aiPieces.push({ piece, row, col });
      }
    }
  }
  
  // Shuffle the pieces array
  const shuffledPieces = [...aiPieces].sort(() => Math.random() - 0.5);
  
  // Try to find a piece with legal moves
  for (const { row, col } of shuffledPieces) {
    const legalMoves = getLegalMoves(board, row, col);
    if (legalMoves.length > 0) {
      // Choose a random legal move
      const targetMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
      return {
        from: { row, col },
        to: targetMove
      };
    }
  }
  
  return null;
};
