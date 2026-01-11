import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

const POMODORO_TIME = 25 * 60; // 25 minutes in seconds

export default function StudyTimer() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setSessions((prev) => prev + 1);
      // Play a notification sound or show alert
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro Complete!', {
          body: 'Great job! Take a break.',
        });
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(POMODORO_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((POMODORO_TIME - timeLeft) / POMODORO_TIME) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-destructive">
          <Timer className="h-6 w-6 text-destructive-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Study Timer</h1>
          <p className="text-muted-foreground">Pomodoro technique for focused study</p>
        </div>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Focus Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Timer Circle */}
          <div className="relative w-64 h-64 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-secondary"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                className="text-primary transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold">{formatTime(timeLeft)}</span>
              <span className="text-muted-foreground mt-2">
                {isRunning ? 'Focus time!' : 'Ready?'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={toggleTimer}
              className={isRunning ? 'bg-warning hover:bg-warning/90' : ''}
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button size="lg" variant="outline" onClick={resetTimer}>
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Sessions */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Completed sessions today
            </p>
            <p className="text-3xl font-bold text-primary">{sessions}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pomodoro Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Work for 25 minutes, then take a 5-minute break
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              After 4 sessions, take a longer 15-30 minute break
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Stay focused - avoid distractions during work time
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
