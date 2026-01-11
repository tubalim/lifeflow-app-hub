import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Expense {
  id: string;
  item_name: string;
  price: number;
  created_at: string;
}

export default function ExpenseTracker() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchExpenses();
  }, [user]);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load expenses');
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  };

  const addExpense = async () => {
    if (!itemName.trim() || !price) return;

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert({ user_id: user?.id, item_name: itemName.trim(), price: priceNum })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add expense');
    } else {
      setExpenses([data, ...expenses]);
      setItemName('');
      setPrice('');
      toast.success('Expense added!');
    }
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete expense');
    } else {
      setExpenses(expenses.filter(e => e.id !== id));
      toast.success('Expense deleted');
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-success">
          <DollarSign className="h-6 w-6 text-success-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
          <p className="text-muted-foreground">Track your daily spending</p>
        </div>
      </div>

      {/* Total Card */}
      <Card className="bg-success/10 border-success/30">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
            <p className="text-4xl font-bold text-success">${total.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <Input
              placeholder="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-32"
            />
            <Button onClick={addExpense}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No expenses logged yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {expenses.map((expense) => (
                <li
                  key={expense.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <span className="font-medium">{expense.item_name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-success font-semibold">
                      ${expense.price.toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExpense(expense.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
