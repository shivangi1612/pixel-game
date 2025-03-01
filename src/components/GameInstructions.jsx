import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, MousePointer, Target } from 'lucide-react';

export function GameInstructions() {
  return (
    <Card className="bg-gray-900 mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-pixel text-blue-400">HOW TO PLAY</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <MousePointer className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
          <p className="instructions text-gray-300">
            Move your mouse left and right to control the paddle at the bottom of the screen.
          </p>
        </div>
        
        <div className="flex items-start gap-3">
          <Target className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
          <p className="instructions text-gray-300">
            Hit all the pixels of the word with the ball to complete the word and earn bonus points.
          </p>
        </div>
        
        <div className="flex items-start gap-3">
          <ArrowDown className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
          <p className="instructions text-gray-300">
            Don't let the ball fall below the paddle or the game will end!
          </p>
        </div>
        
        <div className="mt-4 p-3 bg-gray-800 rounded-md">
          <p className="instructions text-yellow-300">
            Complete words to earn 10 bonus points! Reach 50 points to win the game!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}