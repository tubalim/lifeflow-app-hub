import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarClock, GraduationCap } from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes, format } from 'date-fns';

export default function Countdown() {
  const [examDate, setExamDate] = useState(() => {
    // Default to 90 days from now
    const saved = localStorage.getItem('examDate');
    if (saved) return saved;
    const future = new Date();
    future.setDate(future.getDate() + 90);
    return format(future, 'yyyy-MM-dd');
  });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    localStorage.setItem('examDate', examDate);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date(examDate);
      
      if (target <= now) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = differenceInDays(target, now);
      const hours = differenceInHours(target, now) % 24;
      const minutes = differenceInMinutes(target, now) % 60;

      setTimeLeft({ days, hours, minutes });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [examDate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-primary">
          <CalendarClock className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Exam Countdown</h1>
          <p className="text-muted-foreground">Days until Medical Final Exams</p>
        </div>
      </div>

      {/* Countdown Display */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-8 pb-8">
          <div className="text-center mb-6">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-xl font-semibold">Medical Final Exams</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold">{timeLeft.days}</div>
              <div className="text-sm opacity-80 mt-1">Days</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{timeLeft.hours}</div>
              <div className="text-sm opacity-80 mt-1">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{timeLeft.minutes}</div>
              <div className="text-sm opacity-80 mt-1">Minutes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Set Date */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Set Exam Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="exam-date">Exam Date</Label>
            <Input
              id="exam-date"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Motivation Card */}
      <Card className="bg-accent/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">
              {timeLeft.days > 30
                ? "You've got time! Stay consistent. 📚"
                : timeLeft.days > 7
                ? 'Focus mode activated! 💪'
                : timeLeft.days > 0
                ? 'Final stretch! You can do this! 🎯'
                : 'Good luck on your exam! 🌟'}
            </p>
            <p className="text-sm text-muted-foreground">
              Every hour of study counts. Keep going!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
