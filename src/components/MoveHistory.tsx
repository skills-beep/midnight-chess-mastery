
import React from "react";
import { ChessMove } from "@/lib/chess-engine";

interface MoveHistoryProps {
  moves: ChessMove[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  // Group moves into pairs (white and black)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: i + 1 < moves.length ? moves[i + 1] : null,
    });
  }

  if (moves.length === 0) {
    return (
      <div className="bg-card p-4 rounded-lg shadow-md">
        <h3 className="font-medium border-b mb-2 pb-1">Move History</h3>
        <p className="text-center text-muted-foreground py-2">No moves yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h3 className="font-medium border-b mb-2 pb-1">Move History</h3>
      <div className="h-48 overflow-y-auto pr-2 custom-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="w-1/4 py-1">#</th>
              <th className="w-1/3 py-1">White</th>
              <th className="w-1/3 py-1">Black</th>
            </tr>
          </thead>
          <tbody>
            {movePairs.map(({ moveNumber, white, black }) => (
              <tr key={moveNumber} className="hover:bg-muted/50">
                <td className="py-1">{moveNumber}.</td>
                <td className="py-1 font-mono">{white.notation}</td>
                <td className="py-1 font-mono">{black?.notation || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoveHistory;
