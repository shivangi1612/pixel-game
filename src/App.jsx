import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

const WORDS = [
  'REACT', 'PIXEL', 'GAME', 'CODE', 'PLAY', 
  'FUN', 'BALL', 'WORD', 'SCORE', 'WIN',
  'LEVEL', 'POINT', 'BONUS', 'SKILL', 'SPEED',
  'POWER', 'JUMP', 'MOVE', 'FAST', 'SLOW'
];

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [paddlePosition, setPaddlePosition] = useState(0);
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [ballDirection, setBallDirection] = useState({ x: 2, y: -2 });
  const [pixels, setPixels] = useState([]);
  const [ballSpeed, setBallSpeed] = useState(1);
  
  const boardRef = useRef(null);
  const requestRef = useRef();
  const paddleWidth = 100;
  const ballSize = 12; 
  const pixelSize = 16; 
  const pixelGap = 4; 

  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('pixelGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    // Save high score to localStorage when it changes
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('pixelGameHighScore', score.toString());
    }
    
    // Increase ball speed as score increases
    const newSpeed = 1 + Math.floor(score / 10) * 0.2;
    setBallSpeed(newSpeed);
  }, [score, highScore]);

  // Initialize the game board
  useEffect(() => {
    if (!currentWord || !gameStarted) return;
  
    const updateBoardSize = () => {
      if (boardRef.current) {
        const { width, height } = boardRef.current.getBoundingClientRect();
        setBoardSize({ width, height });
  
        // Reset ball position
        setBallPosition({
          x: width / 2 - ballSize / 2,
          y: height / 2 + 50
        });
  
        // Ensure paddleWidth is defined
        if (paddleWidth) {
          setPaddlePosition(width / 2 - paddleWidth / 2);
        }
  
        // Generate pixels for the word
        generatePixelsForWord(currentWord, width);
      }
    };
  
    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
  
    return () => {
      window.removeEventListener('resize', updateBoardSize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [currentWord, gameStarted, paddleWidth]); 

  // Handle keyboard events for pause and exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && gameStarted) {
        // Exit game
        exitGame();
      } else if (e.key === 'p' && gameStarted) {
        // Toggle pause
        togglePause();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gamePaused]);
  
  const handleMouseMove = (e) => {
    if (boardRef.current) {
      const boardRect = boardRef.current.getBoundingClientRect();
      let newPosition = e.clientX - boardRect.left - paddleWidth / 2;
      newPosition = Math.max(0, Math.min(newPosition, boardSize.width - paddleWidth));
      setPaddlePosition(newPosition);
    }
  };
  
  const handleTouchMove = (e) => {
    if (boardRef.current) {
      const boardRect = boardRef.current.getBoundingClientRect();
      let touchX = e.touches[0].clientX - boardRect.left;
      let newPosition = touchX - paddleWidth / 2;
      newPosition = Math.max(0, Math.min(newPosition, boardSize.width - paddleWidth));
      setPaddlePosition(newPosition);
    }
  };
  
  useEffect(() => {
    if (!gameStarted || gamePaused) return;
  
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
  
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [boardSize.width, paddleWidth, gameStarted, gamePaused]);
  
  useEffect(() => {
    const handleOrientationChange = () => {
      if (boardRef.current) {
        const { width } = boardRef.current.getBoundingClientRect();
        setPaddlePosition(width / 2 - paddleWidth / 2);
      }
    };
  
    window.addEventListener("orientationchange", handleOrientationChange);
  
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);
  
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
  };

  // Handle mouse movement for paddle control
  useEffect(() => {
    if (!gameStarted || gamePaused) return;
    
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
  }, [boardSize.width, paddleWidth, gameStarted, gamePaused]);

  // Game loop
  useEffect(() => {
    if (!boardSize.width || !boardSize.height || !gameStarted || gamePaused) return;
    
    const updateGameState = () => {
      setBallPosition(prevPos => {
        // Apply ball speed to direction
        let newX = prevPos.x + (ballDirection.x * ballSpeed);
        let newY = prevPos.y + (ballDirection.y * ballSpeed);
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
        
        if (!gameWon && newY + ballSize > boardSize.height) {
          cancelAnimationFrame(requestRef.current);
          setGameOver(true);
          setGameStarted(false);
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
            
            // Increase score
            setScore(prevScore => prevScore + 1);
            
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
            // Word completed - player wins this round
            setScore(prevScore => prevScore + 10); // Bonus points for completing a word
            
            // Generate a new word
            const newWord = getRandomWord();
            setCurrentWord(newWord);
            
            // If player reaches 50 points, they win the game
            if (score + 10 >= 50) {
              setTimeout(() => {
              setGameWon(true);
              setGameStarted(false);
              cancelAnimationFrame(requestRef.current);
            }, 0);
              return prevPos;
            }
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
    gameStarted,
    gamePaused,
    score,
    ballSpeed,
    gameWon
  ]);

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    return WORDS[randomIndex];
  };

  const startGame = () => {
    setGameStarted(true);
    setGamePaused(false);
    setGameOver(false);
    setGameWon(false);
    setScore(0);
    setCurrentWord(getRandomWord());
    setShowInstructions(false);
    setBallSpeed(1);
  };

  const togglePause = () => {
    setGamePaused(!gamePaused);
  };

  const exitGame = () => {
     // Cancel animation frame
    cancelAnimationFrame(requestRef.current);
    
    // Reset game state
    setGameStarted(false);
    setGamePaused(false);
    setGameOver(false);  // Reset game over state
    setGameWon(false);
    setScore(0);
    setCurrentWord('');
    setPixels([]);
    setShowInstructions(true); // Show instructions again if needed
    //Don't reset score so player can see their final score
     
    };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-3 pixel-text text-center">PIXEL WORD GAME</h1>
      
      <div className="w-full max-w-3xl ">
        <Card className="bg-white border-gray-700 mb-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 gap-3">
            <CardTitle className="text-xl font-pixel">SCOREBOARD</CardTitle>
            <div className="flex gap-4">
              <Badge variant="outline" className="text-lg px-3 py-1 font-pixel bg-black text-white">
                SCORE: {score}
              </Badge>
              <Badge variant="outline" className="text-lg px-3 py-1 font-pixel bg-black text-white">
                HIGH: {highScore}
              </Badge>
              {gameStarted && (
                <Badge variant="outline" className="text-lg px-3 py-1 font-pixel bg-yellow-500">
                  SPEED: x{ballSpeed.toFixed(1)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {currentWord && gameStarted && (
              <div className="text-center mb-2">
                <p className="text-xl font-pixel">CURRENT WORD:</p>
                <h2 className="text-3xl font-bold font-pixel tracking-wider">{currentWord}</h2>
              </div>
            )}
          </CardContent>
        </Card>

        {showInstructions && (
          <Card className="bg-white mb-3 mt-3">
            <CardHeader>
              <CardTitle className="text-xl font-pixel text-blue-400">HOW TO PLAY</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0">🖱️</div>
                <p className="instructions text-black">
                 Move your mouse left and right to control the paddle at the bottom of the screen.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0">🎯</div>
                <p className="instructions text-black">
                 Hit all the pixels of the word with the ball to complete the word and earn bonus points.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 text-red-400 mt-1 flex-shrink-0">⬇️</div>
                <p className="instructions text-black">
                  Don't let the ball fall below the paddle or the game will end!
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0">⚡</div>
                <p className="instructions text-black">
                  The ball speeds up as your score increases! Be ready for the challenge!
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0">⏯️</div>
                <p className="instructions text-black">
                  Press 'P' key to pause/resume the game. Press 'ESC' key to exit the game.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 text-red-400 mt-1 flex-shrink-0">🔄</div>
                <p className="instructions text-black">
                  Rotate to landscape view in mobile devices.
                </p>
              </div>
              
            </CardContent>
          </Card>
        )}
        
        {gameStarted && (
          <div 
            ref={boardRef} 
            className="game-board w-full h-[296px] rounded-lg relative"
          >
            {/* Render pixels */}
            {pixels.map((pixel) => (
              <div
                key={pixel.id}
                className={`pixel absolute ${pixel.hit ? "pixel-hit" : "pixel-on"}`}
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
            
            {/* Game controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button 
                onClick={togglePause} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 font-pixel"
              >
                {gamePaused ? "RESUME" : "PAUSE"}
              </Button>
              <Button 
                onClick={exitGame} 
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 font-pixel"
              >
                EXIT
              </Button>
            </div>
            
            {/* Pause overlay */}
            {gamePaused && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-6 font-pixel">PAUSED</h2>
                  <div className="flex gap-4">
                    <Button 
                      onClick={togglePause} 
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-pixel"
                    >
                      RESUME
                    </Button>
                    <Button 
                      onClick={exitGame} 
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-pixel"
                    >
                      EXIT
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {gameOver && (
          <div className="game-over-screen">
            <Card className=" border-red-600 border-2">
              <CardContent className="pt-6 flex flex-col items-center">
                <h2 className="text-4xl font-bold text-red-500 mb-4 font-pixel">GAME OVER</h2>
                <p className="text-xl mb-4 font-pixel">YOUR SCORE: {score}</p>
                <p className="text-gray-600 mb-6">The ball went out of bounds!</p>
              </CardContent>
              <CardFooter className="flex justify-center gap-4">
                <Button 
                  onClick={startGame} 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 font-pixel"
                >
                  PLAY AGAIN
                </Button>
                <Button 
                  onClick={() => (exitGame(true))} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 font-pixel"
                >
                  MAIN MENU
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {gameWon && (
          <div className="game-won-screen">
            <Card className=" border-yellow-400 border-2">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 text-yellow-400">✨</div>
                  <h2 className="text-4xl font-bold text-yellow-400 font-pixel">YOU WIN!</h2>
                  <div className="h-8 w-8 text-yellow-400">✨</div>
                </div>
                <p className="text-xl mb-4 font-pixel">FINAL SCORE: {score}</p>
                <p className="text-gray-600 mb-6">Congratulations! You've mastered the pixel word game!</p>
              </CardContent>
              <CardFooter className="flex justify-center gap-4">
                <Button 
                  onClick={startGame} 
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-4 font-pixel"
                >
                  PLAY AGAIN
                </Button>
                <Button 
                  onClick={() => (exitGame(true))} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 font-pixel"
                >
                  MAIN MENU
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        
        {showInstructions && !gameStarted && !gameOver && !gameWon && (
          <div className="flex justify-center mt-2">
            <Button 
              onClick={startGame} 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-xl font-pixel"
            >
              START GAME
            </Button>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default App;