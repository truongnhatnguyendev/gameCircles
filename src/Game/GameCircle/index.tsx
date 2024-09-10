import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import "./game.css";

interface Circle {
  id: number;
  position: { top: number; left: number };
  color: string;
  backgroundColor: string;
}

enum StatusEnum {
  default = "LET'S PLAY",
  WIN = "ALL CLEARED",
  LOSE = "GAME OVER",
}

export function GameCircle() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [time, setTime] = useState<number>(0.0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [gameStatus, setGameStatus] = useState<string>(StatusEnum.default);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => (prevTime as number) + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const startGame = useCallback(() => {
    const newCircles = Array.from({ length: points }, (_, i) => ({
      id: i + 1,
      position: {
        top: Math.random() * 95,
        left: Math.random() * 95,
      },
      color: "black",
      backgroundColor: "white",
    }));
    setCircles(newCircles);
    setTimerRunning(true);
  }, [points]);

  const clickedIds = useRef<number[]>([]);
  const handleCircleClick = useCallback(
    (id: number) => {
      clickedIds.current.push(id);
      const temp = [...circles].filter(
        (item) => !clickedIds.current.includes(item.id)
      );
      const isSmallerId = temp.every((item) => item.id > id);
      if (isSmallerId && timerRunning === true) {
        setCircles((prevCircles) =>
          prevCircles.map((circle) =>
            circle.id === id
              ? { ...circle, backgroundColor: "red", color: "white" }
              : circle
          )
        );
        setTimeout(() => {
          setCircles((prevCircles) =>
            prevCircles.filter((circle) => circle.id !== id)
          );
          if (id === points) {
            setGameStatus(StatusEnum.WIN);
            setTimerRunning(false);
          }
        }, 1000);
      } else {
        timerRunning &&
          setCircles((prevCircles) =>
            prevCircles.map((circle) =>
              circle.id === id
                ? { ...circle, backgroundColor: "red", color: "white" }
                : circle
            )
          );
        setTimerRunning(false);
        setGameStatus(StatusEnum.LOSE);
      }
    },
    [circles, points, timerRunning]
  );

  const handlePlay = useCallback(() => {
    if (points > 0) {
      setGameStarted(true);
      startGame();
    }
  }, [points, startGame]);

  const handleRestart = useCallback(() => {
    setTime(0.0);
    setCircles([]);
    startGame();
    clickedIds.current = [];
    setGameStatus(StatusEnum.default);
  }, [startGame]);

  const handleChangePoints = (points: number) => {
    setPoints(points);
  };

  const memoizedCircles = useMemo(() => {
    return circles.map((circle) => (
      <div
        key={circle.id}
        className="circle"
        style={{
          top: `${circle.position.top}%`,
          left: `${circle.position.left}%`,
          backgroundColor: circle.backgroundColor,
          color: circle.color,
          zIndex: points - circle.id,
        }}
        onClick={() => handleCircleClick(circle.id)}
      >
        {circle.id}
      </div>
    ));
  }, [circles, points]);

  return (
    <div className="game-container">
      <div style={{ margin: "0 auto", width: "50vw" }}>
        {<GameStatus gameStatus={gameStatus} />}
        <div className="scoreboard">
          <div>
            Points:
            <input
              style={{ marginLeft: "10px" }}
              type="number"
              onChange={(e) => handleChangePoints(parseInt(e.target.value))}
            />
          </div>
          {<Timer time={time} />}
          <button onClick={gameStarted ? handleRestart : handlePlay}>
            {gameStarted ? "Restart" : "Play"}
          </button>
        </div>
      </div>
      <div className="game-board">{memoizedCircles}</div>
    </div>
  );
}

const GameStatus = React.memo(({ gameStatus }: { gameStatus: string }) => (
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
));

const Timer = React.memo(({ time }: { time: number }) => (
  <div>Time: {time.toFixed(1)}s</div>
));
