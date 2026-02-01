"use client";

import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const GAME_SPEED = 100;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateRandomFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection({ x: 0, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
  };

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver || (direction.x === 0 && direction.y === 0)) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateRandomFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateRandomFood]);

  const handleKeyPress = useCallback((e) => {
    if (!isPlaying && !gameOver && e.key === ' ') {
      setIsPlaying(true);
      setDirection({ x: 1, y: 0 });
      return;
    }

    if (gameOver && e.key === 'r') {
      resetGame();
      return;
    }

    if (!isPlaying) return;

    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) {
          setDirection({ x: 0, y: -1 });
        }
        break;
      case 'ArrowDown':
        if (direction.y === 0) {
          setDirection({ x: 0, y: 1 });
        }
        break;
      case 'ArrowLeft':
        if (direction.x === 0) {
          setDirection({ x: -1, y: 0 });
        }
        break;
      case 'ArrowRight':
        if (direction.x === 0) {
          setDirection({ x: 1, y: 0 });
        }
        break;
    }
  }, [direction, isPlaying, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  const renderCell = (x, y) => {
    const isSnakeHead = snake[0].x === x && snake[0].y === y;
    const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;

    let cellClass = 'w-5 h-5 border border-gray-700 ';
    
    if (isSnakeHead) {
      cellClass += 'bg-green-500';
    } else if (isSnakeBody) {
      cellClass += 'bg-green-400';
    } else if (isFood) {
      cellClass += 'bg-red-500';
    } else {
      cellClass += 'bg-gray-800';
    }

    return cellClass;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Snake Game</h1>
        <div className="text-lg mb-2">Score: {score}</div>
        {!isPlaying && !gameOver && (
          <div className="text-sm text-gray-400 mb-2">Press SPACE to start</div>
        )}
        {gameOver && (
          <div className="text-red-500 mb-2">Game Over! Press R to restart</div>
        )}
        {isPlaying && (
          <div className="text-sm text-gray-400">Use arrow keys to control</div>
        )}
      </div>

      <div 
        className="grid bg-black p-2 rounded"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '1px'
        }}
      >
        {Array.from({ length: GRID_SIZE }, (_, y) =>
          Array.from({ length: GRID_SIZE }, (_, x) => (
            <div
              key={`${x}-${y}`}
              className={renderCell(x, y)}
            />
          ))
        )}
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={() => {
            if (!isPlaying && !gameOver) {
              setIsPlaying(true);
              setDirection({ x: 1, y: 0 });
            }
          }}
          disabled={isPlaying || gameOver}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded"
        >
          Start
        </button>
        <button
          onClick={() => setIsPlaying(false)}
          disabled={!isPlaying}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 rounded"
        >
          Pause
        </button>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}