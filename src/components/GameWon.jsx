import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function GameWon({ score, onRestart }) {
  return (
    <div className="game-won-screen">
      <Card className="bg-gray-900 border-yellow-400 border-2">
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            <h2 className="text-4xl font-bold text-yellow-400 font-pixel">YOU WIN!</h2>
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-xl mb-4 font-pixel">FINAL SCORE: {score}</p>
          <p className="text-gray-300 mb-6">Congratulations! You've mastered the pixel word game!</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={onRestart} 
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-4 font-pixel"
          >
            PLAY AGAIN
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}