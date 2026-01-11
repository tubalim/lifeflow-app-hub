import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, DollarSign, Target, Timer, CalendarClock, Bookmark } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  const greeting = getGreeting();

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  const quickStats = [
    { title: 'Tasks', icon: CheckSquare, value: 'Track tasks', color: 'text-primary' },
    { title: 'Expenses', icon: DollarSign, value: 'Log spending', color: 'text-success' },
    { title: 'Habits', icon: Target, value: 'Build habits', color: 'text-warning' },
    { title: 'Timer', icon: Timer, value: '25 min focus', color: 'text-destructive' },
    { title: 'Countdown', icon: CalendarClock, value: 'Exam prep', color: 'text-accent-foreground' },
    { title: 'Bookmarks', icon: Bookmark, value: 'Save links', color: 'text-primary' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {greeting}, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {/* Summary Card */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Welcome to LifeFlow</h2>
              <p className="opacity-90">
                Your personal life management companion. Stay organized, focused, and healthy.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <Target className="h-12 w-12" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickStats.map((stat) => (
            <Card key={stat.title} className="stat-card cursor-pointer hover:border-primary/50">
              <CardContent className="pt-5">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{stat.title}</p>
                    <p className="text-sm text-muted-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Today's Focus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Complete your daily habits</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>Use the Pomodoro timer for focused study</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span>Track your expenses</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
