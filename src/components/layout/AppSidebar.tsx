import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  DollarSign,
  Target,
  Timer,
  FileText,
  CalendarClock,
  Bookmark,
  HelpCircle,
  Settings,
  Heart,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Todo List', url: '/todos', icon: CheckSquare },
  { title: 'Expenses', url: '/expenses', icon: DollarSign },
  { title: 'Habits', url: '/habits', icon: Target },
  { title: 'Study Timer', url: '/timer', icon: Timer },
  { title: 'My Notes', url: '/notes', icon: FileText },
  { title: 'Countdown', url: '/countdown', icon: CalendarClock },
  { title: 'Bookmarks', url: '/bookmarks', icon: Bookmark },
  { title: 'App FAQ', url: '/faq', icon: HelpCircle },
  { title: 'Profile', url: '/profile', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sidebar-primary">
              <Heart className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">LifeFlow</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                'sidebar-link',
                isActive && 'sidebar-link-active'
              )}
              title={item.title}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/60 text-center">
            © 2024 LifeFlow
          </p>
        </div>
      )}
    </aside>
  );
}
