import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TodoList from "./pages/TodoList";
import ExpenseTracker from "./pages/ExpenseTracker";
import HabitTracker from "./pages/HabitTracker";
import StudyTimer from "./pages/StudyTimer";
import MyNotes from "./pages/MyNotes";
import Countdown from "./pages/Countdown";
import Bookmarks from "./pages/Bookmarks";
import AppFAQ from "./pages/AppFAQ";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            <Route
              path="/todos"
              element={
                <AppLayout>
                  <TodoList />
                </AppLayout>
              }
            />
            <Route
              path="/expenses"
              element={
                <AppLayout>
                  <ExpenseTracker />
                </AppLayout>
              }
            />
            <Route
              path="/habits"
              element={
                <AppLayout>
                  <HabitTracker />
                </AppLayout>
              }
            />
            <Route
              path="/timer"
              element={
                <AppLayout>
                  <StudyTimer />
                </AppLayout>
              }
            />
            <Route
              path="/notes"
              element={
                <AppLayout>
                  <MyNotes />
                </AppLayout>
              }
            />
            <Route
              path="/countdown"
              element={
                <AppLayout>
                  <Countdown />
                </AppLayout>
              }
            />
            <Route
              path="/bookmarks"
              element={
                <AppLayout>
                  <Bookmarks />
                </AppLayout>
              }
            />
            <Route
              path="/faq"
              element={
                <AppLayout>
                  <AppFAQ />
                </AppLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <AppLayout>
                  <Profile />
                </AppLayout>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
