import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function GameBoard({ word, onScoreIncrease, onGameOver, onWordCompleted }) {
  const boardRef = useRef(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [paddlePosition, setPaddlePosition] = useState(0);
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [ballDirection, setBallDirection] = useState({ x: 2, y: -2 });
  const [pixels, setPixels] = useState([]);
  const [pixelsHit, setPixelsHit] = useState([]);
  const requestRef = useRef();
  const paddleWidth = 100;
  const ballSize = 15;
  const pixelSize = 20;
  const pixelGap = 2;

  // Initialize the game board
  useEffect(() => {
    if (!word) return;
    
    const updateBoardSize = () => {
      if (boardRef.current) {
        const { width, height } = boardRef.current.getBoundingClientRect();
        setBoardSize({ width, height });
        
        // Reset ball position
        setBallPosition({
          x: width / 2 - ballSize / 2,
          y: height / 2 + 50
        });
        
        // Reset paddle position
        setPaddlePosition(width / 2 - paddleWidth / 2);
        
        // Generate pixels for the word
        generatePixelsForWord(word, width);
      }
    };
    
    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    
    return () => {
      window.removeEventListener('resize', updateBoardSize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [word]);

  // Generate pixels for the word
  const generatePixelsForWord = (word, boardWidth) => {
    const pixelMap = [];
    const letterMaps = {
      'A': [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1]
      ],
      'B': [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 1, 1, 0]
      ],
      'C': [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 0],
        [1, 0, 0, 1],
        [0, 1, 1, 0]
      ],
      'D': [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 0]
      ],
      'E': [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 1]
      ],
      'F': [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0]
      ],
      'G': [
        [0, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 0, 1, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0]
      ],
      'H': [
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1]
      ],
      'I': [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1]
      ],
      'J': [
        [0, 0, 1],
        [0, 0, 1],
        [0, 0, 1],
        [1, 0, 1],
        [0, 1, 0]
      ],
      'K': [
        [1, 0, 0, 1],
        [1, 0, 1, 0],
        [1, 1, 0, 0],
        [1, 0, 1, 0],
        [1, 0, 0, 1]
      ],
      'L': [
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 1]
      ],
      'M': [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1]
      ],
      'N': [
        [1, 0, 0, 1],
        [1, 1, 0, 1],
        [1, 0, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1]
      ],
      'O': [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0]
      ],
      'P': [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0]
      ],
      'Q': [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 1, 1],
        [0, 1, 1, 1]
      ],
      'R': [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 1, 1, 0],
        [1, 0, 1, 0],
        [1, 0, 0, 1]
      ],
      'S': [
        [0, 1, 1, 1],
        [1, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 1],
        [1, 1, 1, 0]
      ],
      'T': [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ],
      'U': [
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0]
      ],
      'V': [
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
        [0, 0, 1, 0]
      ],
      'W': [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 1, 1],
        [1, 0, 0, 0, 1]
      ],
      'X': [
        [1, 0, 0, 1],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 0, 0, 1]
      ],
      'Y': [
        [1, 0, 0, 1],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
      ],
      'Z': [
        [1, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [1, 1, 1, 1]
      ]
    };

    let totalWidth = 0;
    const letterWidths = [];
    
    // Calculate total width needed for the word
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      const letterMap = letterMaps[letter];
      if (letterMap) {
        const letterWidth = letterMap[0].length * (pixelSize + pixelGap);
        letterWidths.push(letterWidth);
        totalWidth += letterWidth;
      }
    }
    
    // Add spacing between letters
    totalWidth += (word.length - 1) * 15;
    
    // Calculate starting X position to center the word
    let startX = (boardWidth - totalWidth) / 2;
    
    // Generate pixels for each letter
    let pixelId = 0;
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      const letterMap = letterMaps[letter];
      
      if (letterMap) {
        for (let row = 0; row < letterMap.length; row++) {
          for (let col = 0; col < letterMap[row].length; col++) {
            if (letterMap[row][col] === 1) {
              pixelMap.push({
                id: pixelId++,
                x: startX + col * (pixelSize + pixelGap),
                y: 50 + row * (pixelSize + pixelGap),
                width: pixelSize,
                height: pixelSize,
                hit: false
              });
            }
          }
        }
        
        // Move to the next letter position
        startX += letterWidths[i] + 15;
      }
    }
    
    setPixels(pixelMap);
    setPixelsHit([]);
  };

  // Handle mouse movement for paddle control
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (boardRef.current) {
        const boardRect = boardRef.current.getBoundingClientRect();
        const relativeX = e.clientX - boardRect.left;
        
        // Keep paddle within board boundaries
        let newPosition = relativeX - paddleWidth / 2;
        newPosition = Math.max(0, Math.min(newPosition, boardSize.width - paddleWidth));
        
        setPaddlePosition(newPosition);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [boardSize.width, paddleWidth]);

  // Game loop
  useEffect(() => {
    if (!boardSize.width || !boardSize.height) return;
    
    const updateGameState = () => {
      setBallPosition(prevPos => {
        let newX = prevPos.x + ballDirection.x;
        let newY = prevPos.y + ballDirection.y;
        let newDirX = ballDirection.x;
        let newDirY = ballDirection.y;
        
        // Wall collision (left/right)
        if (newX <= 0 || newX + ballSize >= boardSize.width) {
          newDirX = -newDirX;
        }
        
        // Wall collision (top)
        if (newY <= 0) {
          newDirY = -newDirY;
        }
        
        // Paddle collision
        if (
          newY + ballSize >= boardSize.height - 25 && 
          newY + ballSize <= boardSize.height - 10 &&
          newX + ballSize >= paddlePosition && 
          newX <= paddlePosition + paddleWidth
        ) {
          // Calculate bounce angle based on where the ball hits the paddle
          const hitPosition = (newX + ballSize / 2) - (paddlePosition + paddleWidth / 2);
          const normalizedHit = hitPosition / (paddleWidth / 2);
          
          // Change direction based on hit position
          newDirX = normalizedHit * 3;
          newDirY = -Math.abs(newDirY);
        }
        
        // Game over if ball goes below paddle
        if (newY + ballSize > boardSize.height) {
          cancelAnimationFrame(requestRef.current);
          onGameOver();
          return prevPos;
        }
        
        // Check pixel collisions
        let pixelHit = false;
        const updatedPixels = [...pixels];
        
        for (let i = 0; i < updatedPixels.length; i++) {
          const pixel = updatedPixels[i];
          
          if (!pixel.hit && 
              newX + ballSize > pixel.x && 
              newX < pixel.x + pixel.width &&
              newY + ballSize > pixel.y && 
              newY < pixel.y + pixel.height) {
            
            // Mark pixel as hit
            updatedPixels[i] = { ...pixel, hit: true };
            setPixelsHit(prev => [...prev, pixel.id]);
            
            // Increase score
            onScoreIncrease();
            
            // Determine bounce direction
            const overlapLeft = (newX + ballSize) - pixel.x;
            const overlapRight = (pixel.x + pixel.width) - newX;
            const overlapTop = (newY + ballSize) - pixel.y;
            const overlapBottom = (pixel.y + pixel.height) - newY;
            
            // Find smallest overlap to determine bounce direction
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
            
            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
              newDirX = -newDirX;
            } else {
              newDirY = -newDirY;
            }
            
            pixelHit = true;
            break;
          }
        }
        
        if (pixelHit) {
          setPixels(updatedPixels);
          
          // Check if all pixels are hit
          const allHit = updatedPixels.every(pixel => pixel.hit);
          if (allHit) {
            onWordCompleted();
          }
        }
        
        // Update ball direction
        setBallDirection({ x: newDirX, y: newDirY });
        
        return { x: newX, y: newY };
      });
      
      requestRef.current = requestAnimationFrame(updateGameState);
    };
    
    requestRef.current = requestAnimationFrame(updateGameState);
    return () => cancelAnimationFrame(requestRef.current);
  }, [
    boardSize, 
    ballDirection, 
    paddlePosition, 
    pixels, 
    onScoreIncrease, 
    onGameOver, 
    onWordCompleted
  ]);

  return (
    <div 
      ref={boardRef} 
      className="game-board w-full h-[500px] rounded-lg"
    >
      {/* Render pixels */}
      {pixels.map((pixel) => (
        <div
          key={pixel.id}
          className={cn(
            "pixel absolute",
            pixel.hit ? "pixel-hit" : "pixel-on"
          )}
          style={{
            left: `${pixel.x}px`,
            top: `${pixel.y}px`,
            width: `${pixel.width}px`,
            height: `${pixel.height}px`
          }}
        />
      ))}
      
      {/* Render ball */}
      <div
        className="ball"
        style={{
          left: `${ballPosition.x}px`,
          top: `${ballPosition.y}px`,
          width: `${ballSize}px`,
          height: `${ballSize}px`
        }}
      />
      
      {/* Render paddle */}
      <div
        className="paddle"
        style={{
          left: `${paddlePosition}px`,
          width: `${paddleWidth}px`
        }}
      />
    </div>
  );
}