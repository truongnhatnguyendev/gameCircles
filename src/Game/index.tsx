import React, { useState, useEffect } from "react";
import "./game.css";

interface Circle {
  id: number;
  position: { top: number; left: number };
  visible: boolean;
  color: string;
}

enum StatusEnum {
  default = "LET'S PLAY",
  WIN = "ALL CLEARED",
  LOSE = "GAME OVER",
}

export function Game() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [points, setPoints] = useState<number>();
  const [time, setTime] = useState<number>(0.0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [nextCircleId, setNextCircleId] = useState<number>(1);
  const [gameStatus, setGameStatus] = useState<string>(StatusEnum.default);

  useEffect(() => {
    if (gameStarted) {
      startGame();
    }
  }, [gameStarted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => (prevTime as number) + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const startGame = () => {
    setCircles(
      Array.from({ length: points as number }, (_, i) => ({
        id: i + 1,
        position: {
          top: Math.random() * 95,
          left: Math.random() * 95,
        },
        visible: true,
        color: "white",
      }))
    );
    setTimerRunning(true);
  };

  const handleCircleClick = (id: number) => {
    if (id === nextCircleId && gameStatus !== StatusEnum.LOSE) {
      setCircles((prevCircles) =>
        prevCircles.map((circle) =>
          circle.id === id ? { ...circle, color: "red" } : circle
        )
      );

      setTimeout(() => {
        setCircles((prevCircles) =>
          prevCircles.map((circle) =>
            circle.id === id ? { ...circle, visible: false } : circle
          )
        );
      }, 300);

      setNextCircleId((prevId) => prevId + 1);

      if (id === points) {
        setGameStatus(StatusEnum.WIN);
        setTimerRunning(false);
      }
    } else {
      setGameStatus(StatusEnum.LOSE);
      setTimerRunning(false);
    }
  };

  const handlePlay = () => {
    setGameStarted(true);
  };

  const handleRestart = () => {
    setTime(0.0);
    setTimerRunning(false);
    setCircles([]);
    setNextCircleId(1);
    startGame();
    setGameStatus(StatusEnum.default);
  };

  const handleChangePoints = (points: number) => {
    setPoints(points);
  };

  return (
    <div className="game-container">
      <div style={{ margin: "0 auto", width: "50vw" }}>
        <h3
          style={{
            color:
              gameStatus === StatusEnum.WIN
                ? "green"
                : gameStatus === StatusEnum.LOSE
                ? "red"
                : "",
          }}
        >
          {gameStatus}
        </h3>
        <div className="scoreboard">
          <div>
            Points:
            <input
              style={{ marginLeft: "10px" }}
              type="number"
              value={points}
              onChange={(e) => handleChangePoints(parseInt(e.target.value))}
            />
          </div>
          <div>Time: {time && time.toFixed(1) + "s"}</div>
          <button onClick={gameStarted ? handleRestart : handlePlay}>
            {gameStarted ? "Restart" : "Play"}
          </button>
        </div>
      </div>
      <div className="game-board">
        {circles
          .filter((circle) => circle.visible)
          .map((circle) => (
            <div
              key={circle.id}
              className="circle"
              style={{
                top: `${circle.position.top}%`,
                left: `${circle.position.left}%`,
                backgroundColor: circle.color,
                zIndex: points! - circle.id,
              }}
              onClick={() => handleCircleClick(circle.id)}
            >
              {circle.id}
            </div>
          ))}
      </div>
    </div>
  );
}
