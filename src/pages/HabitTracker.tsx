import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, BookOpen, Droplets, Dumbbell } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const HABITS = [
  { name: 'Study', icon: BookOpen, color: 'text-primary' },
  { name: 'Water', icon: Droplets, color: 'text-blue-500' },
  { name: 'Exercise', icon: Dumbbell, color: 'text-orange-500' },
];

interface Habit {
  id: string;
  habit_name: string;
  completed: boolean;
  date: string;
}

export default function HabitTracker() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (user) fetchHabits();
  }, [user]);

  const fetchHabits = async () => {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user?.id)
      .eq('date', today);

    if (error) {
      toast.error('Failed to load habits');
    } else {
      const habitMap: Record<string, boolean> = {};
      data?.forEach(h => {
        habitMap[h.habit_name] = h.completed;
      });
      setHabits(habitMap);
    }
    setLoading(false);
  };

  const toggleHabit = async (habitName: string) => {
    const currentValue = habits[habitName] || false;
    
    // Check if habit exists for today
    const { data: existing } = await supabase
      .from('habits')
      .select('id')
      .eq('user_id', user?.id)
      .eq('habit_name', habitName)
      .eq('date', today)
      .single();

    if (existing) {
      // Update existing
      await supabase
        .from('habits')
        .update({ completed: !currentValue })
        .eq('id', existing.id);
    } else {
      // Insert new
      await supabase
        .from('habits')
        .insert({
          user_id: user?.id,
          habit_name: habitName,
          completed: true,
          date: today,
        });
    }

    setHabits({ ...habits, [habitName]: !currentValue });
    
    if (!currentValue) {
      toast.success(`${habitName} completed! 🎉`);
    }
  };

  const completedCount = HABITS.filter(h => habits[h.name]).length;
  const progress = (completedCount / HABITS.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-warning">
          <Target className="h-6 w-6 text-warning-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Habit Tracker</h1>
          <p className="text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="bg-warning/10 border-warning/30">
        <CardContent className="pt-6">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-1">Daily Progress</p>
            <p className="text-4xl font-bold text-warning">
              {completedCount}/{HABITS.length}
            </p>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div
              className="bg-warning h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Habits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Habits</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : (
            <ul className="space-y-4">
              {HABITS.map((habit) => {
                const isCompleted = habits[habit.name] || false;
                return (
                  <li
                    key={habit.name}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-success/10 border-success/30'
                        : 'bg-secondary/50 border-transparent hover:border-primary/30'
                    }`}
                    onClick={() => toggleHabit(habit.name)}
                  >
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => toggleHabit(habit.name)}
                    />
                    <div className={`p-2 rounded-lg bg-background ${habit.color}`}>
                      <habit.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`font-medium flex-1 ${
                        isCompleted ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {habit.name}
                    </span>
                    {isCompleted && (
                      <span className="text-sm text-success font-medium">Done!</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
