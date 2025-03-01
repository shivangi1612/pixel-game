import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function GameOver({ score, onRestart }) {
  return (
    <div className="game-over-screen">
      <Card className="bg-gray-900 border-red-600 border-2">
        <CardContent className="pt-6 flex flex-col items-center">
          <h2 className="text-4xl font-bold text-red-500 mb-4 font-pixel">GAME OVER</h2>
          <p className="text-xl mb-4 font-pixel">YOUR SCORE: {score}</p>
          <p className="text-gray-400 mb-6">The ball went out of bounds!</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={onRestart} 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 font-pixel"
          >
            PLAY AGAIN
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}