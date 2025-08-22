
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
export type GameMode = 'single' | 'multiplayer' | 'ai';
export type TimeControl = 'blitz' | 'rapid' | 'classical' | 'bullet';

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

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

// Piece values for evaluation
const PIECE_VALUES = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0
};

// Position evaluation tables
const PAWN_TABLE = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

// Evaluate board position
const evaluateBoard = (board: ChessBoard, color: PieceColor): number => {
  let score = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;
      
      let pieceValue = PIECE_VALUES[piece.type];
      
      // Add positional bonuses
      if (piece.type === 'pawn') {
        pieceValue += PAWN_TABLE[piece.color === 'white' ? row : 7 - row][col] / 100;
      } else if (piece.type === 'knight') {
        pieceValue += KNIGHT_TABLE[piece.color === 'white' ? row : 7 - row][col] / 100;
      }
      
      // Center control bonus
      if ((row >= 3 && row <= 4) && (col >= 3 && col <= 4)) {
        pieceValue += 0.3;
      }
      
      if (piece.color === color) {
        score += pieceValue;
      } else {
        score -= pieceValue;
      }
    }
  }
  
  return score;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (
  gameState: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  aiColor: PieceColor
): { score: number, move?: { from: ChessSquare, to: ChessSquare } } => {
  if (depth === 0 || gameState.status !== 'playing') {
    return { score: evaluateBoard(gameState.board, aiColor) };
  }
  
  const allMoves = getAllPossibleMoves(gameState.board, gameState.currentPlayer);
  
  if (maximizingPlayer) {
    let maxEval = -Infinity;
    let bestMove: { from: ChessSquare, to: ChessSquare } | undefined;
    
    for (const move of allMoves) {
      const newGameState = makeMove(gameState, move.from, move.to);
      const evaluation = minimax(newGameState, depth - 1, alpha, beta, false, aiColor);
      
      if (evaluation.score > maxEval) {
        maxEval = evaluation.score;
        bestMove = move;
      }
      
      alpha = Math.max(alpha, evaluation.score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    let bestMove: { from: ChessSquare, to: ChessSquare } | undefined;
    
    for (const move of allMoves) {
      const newGameState = makeMove(gameState, move.from, move.to);
      const evaluation = minimax(newGameState, depth - 1, alpha, beta, true, aiColor);
      
      if (evaluation.score < minEval) {
        minEval = evaluation.score;
        bestMove = move;
      }
      
      beta = Math.min(beta, evaluation.score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return { score: minEval, move: bestMove };
  }
};

// Get all possible moves for a color
const getAllPossibleMoves = (board: ChessBoard, color: PieceColor): { from: ChessSquare, to: ChessSquare }[] => {
  const moves: { from: ChessSquare, to: ChessSquare }[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const legalMoves = getLegalMoves(board, row, col);
        for (const move of legalMoves) {
          moves.push({ from: { row, col }, to: move });
        }
      }
    }
  }
  
  return moves;
};

// Enhanced AI move generation with difficulty levels
export const generateAiMove = (
  gameState: GameState,
  difficulty: AIDifficulty = 'medium'
): { from: ChessSquare, to: ChessSquare } | null => {
  const { board, currentPlayer } = gameState;
  
  // Get all possible moves
  const allMoves = getAllPossibleMoves(board, currentPlayer);
  if (allMoves.length === 0) return null;
  
  switch (difficulty) {
    case 'easy': {
      // 70% random moves, 30% slightly better moves
      if (Math.random() < 0.7) {
        return allMoves[Math.floor(Math.random() * allMoves.length)];
      }
      
      // Simple heuristic: prefer captures
      const captureMoves = allMoves.filter(move => 
        board[move.to.row][move.to.col] !== null
      );
      
      if (captureMoves.length > 0) {
        return captureMoves[Math.floor(Math.random() * captureMoves.length)];
      }
      return allMoves[Math.floor(Math.random() * allMoves.length)];
    }
    
    case 'medium': {
      // Use minimax with depth 2
      const result = minimax(gameState, 2, -Infinity, Infinity, true, currentPlayer);
      return result.move || allMoves[Math.floor(Math.random() * allMoves.length)];
    }
    
    case 'hard': {
      // Use minimax with depth 3, with some randomness
      const result = minimax(gameState, 3, -Infinity, Infinity, true, currentPlayer);
      
      // 90% best move, 10% second best for unpredictability
      if (Math.random() < 0.9) {
        return result.move || allMoves[Math.floor(Math.random() * allMoves.length)];
      }
      
      // Find second best move
      const moves = allMoves.map(move => {
        const newGameState = makeMove(gameState, move.from, move.to);
        const score = evaluateBoard(newGameState.board, currentPlayer);
        return { move, score };
      }).sort((a, b) => b.score - a.score);
      
      return moves[1]?.move || moves[0]?.move || null;
    }
    
    case 'expert': {
      // Use minimax with depth 4
      const result = minimax(gameState, 4, -Infinity, Infinity, true, currentPlayer);
      return result.move || allMoves[Math.floor(Math.random() * allMoves.length)];
    }
    
    default:
      return allMoves[Math.floor(Math.random() * allMoves.length)];
  }
};

// Get AI opponent rating based on difficulty
export const getAiRating = (difficulty: AIDifficulty): number => {
  switch (difficulty) {
    case 'easy': return 800;
    case 'medium': return 1200;
    case 'hard': return 1600;
    case 'expert': return 2000;
    default: return 1200;
  }
};
