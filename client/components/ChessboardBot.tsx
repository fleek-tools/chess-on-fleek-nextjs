"use client";

import React, { useState, useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square, ChessInstance, ShortMove } from "chess.js";
import {
  OptionSquares,
  RightClickedSquares,
  convertCSSPropertiesToStringObject,
} from "@/public/utils/types";
import { useBoardTheme } from "@/app/provider";
class Engine {
  private stockfish: Worker | null;

  constructor() {
    this.stockfish =
      typeof Worker !== "undefined" ? new Worker("/stockfish.js") : null;
    this.onMessage = this.onMessage.bind(this);

    if (this.stockfish) {
      this.sendMessage("uci");
      this.sendMessage("isready");
    }
  }

  onMessage(callback: (data: { bestMove: string }) => void) {
    if (this.stockfish) {
      this.stockfish.addEventListener("message", (e) => {
        const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];
        callback({ bestMove });
      });
    }
  }

  evaluatePosition(fen: string, depth: number) {
    if (this.stockfish) {
      this.stockfish.postMessage(`position fen ${fen}`);
      this.stockfish.postMessage(`go depth ${depth}`);
    }
  }

  stop() {
    this.sendMessage("stop");
  }

  quit() {
    this.sendMessage("quit");
  }

  private sendMessage(message: string) {
    if (this.stockfish) {
      this.stockfish.postMessage(message);
    }
  }
}

const ChessboardBot: React.FC = () => {
  const engine = useMemo(() => new Engine(), []);
  const [game, setGame] = useState<ChessInstance>(new Chess());
  const [stockfishLevel, setStockfishLevel] = useState(2);
  const { theme } = useBoardTheme();
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] =
    useState<RightClickedSquares>({});
  const moveSquares = {};
  const [optionSquares, setOptionSquares] = useState<OptionSquares>({});

  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: OptionSquares = {};
    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to)!.color !== game.get(square)!.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
      borderRadius: "",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function makeStockfishMove() {
    engine.evaluatePosition(game.fen(), stockfishLevel);
    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        const move = game.move({
          from: bestMove.substring(0, 2) as Square,
          to: bestMove.substring(2, 4) as Square,
          promotion: bestMove.substring(4, 5) as
            | "b"
            | "n"
            | "r"
            | "q"
            | undefined,
        });

        if (move) {
          setGame(game);
        }
      }
    });
  }

  function onSquareClick(square: Square) {
    setRightClickedSquares({});

    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    if (!moveTo) {
      const piece = game.get(moveFrom);
      const moves = game.moves({
        square: moveFrom,
        verbose: true,
      }) as ShortMove[];
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      if (!foundMove) {
        const hasMoveOptions = getMoveOptions(square);
        setMoveFrom(hasMoveOptions ? square : null);
        return;
      }

      setMoveTo(square);

      if (
        (piece?.color === "w" && piece?.type === "p" && square[1] === "8") ||
        (piece?.color === "b" && piece?.type === "p" && square[1] === "1")
      ) {
        setShowPromotionDialog(true);
        return;
      }

      const gameCopy = { ...game };
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      setGame(gameCopy);

      setTimeout(makeStockfishMove, 1000);
      setMoveFrom(null);
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  }

  function onPromotionPieceSelect(piece: any) {
    if (piece) {
      const gameCopy = { ...game };
      gameCopy.move({
        from: moveFrom!,
        to: moveTo!,
        promotion: piece[1].toLowerCase() ?? "q",
      });
      setGame(gameCopy);
      setTimeout(makeStockfishMove, 1000);
    }

    setMoveFrom(null);
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return true;
  }

  function onSquareRightClick(square: Square) {
    const colour = "rgba(255, 0, 0, 0.5)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square]!.backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }
  return (
    <>
      <Chessboard
        animationDuration={200}
        arePiecesDraggable={false}
        position={game.fen()}
        boardWidth={560}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        onPromotionPieceSelect={onPromotionPieceSelect}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        customSquareStyles={{
          ...moveSquares,
          ...optionSquares,
          ...rightClickedSquares,
        }}
        promotionToSquare={moveTo}
        showPromotionDialog={showPromotionDialog}
        customDarkSquareStyle={convertCSSPropertiesToStringObject(
          theme.darkSquareStyle
        )}
        customLightSquareStyle={convertCSSPropertiesToStringObject(
          theme.lightSquareStyle
        )}
      />
    </>
  );
};

export default ChessboardBot;