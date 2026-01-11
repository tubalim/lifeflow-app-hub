import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function MyNotes() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [noteId, setNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchNote();
  }, [user]);

  const fetchNote = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user?.id)
      .limit(1)
      .single();

    if (data) {
      setContent(data.content);
      setNoteId(data.id);
    }
    setLoading(false);
  };

  const saveNote = async () => {
    setSaving(true);
    
    if (noteId) {
      // Update existing note
      const { error } = await supabase
        .from('notes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', noteId);

      if (error) {
        toast.error('Failed to save note');
      } else {
        toast.success('Note saved!');
      }
    } else {
      // Create new note
      const { data, error } = await supabase
        .from('notes')
        .insert({ user_id: user?.id, content })
        .select()
        .single();

      if (error) {
        toast.error('Failed to save note');
      } else {
        setNoteId(data.id);
        toast.success('Note saved!');
      }
    }
    
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-accent">
          <FileText className="h-6 w-6 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">My Notes</h1>
          <p className="text-muted-foreground">Your personal scratchpad</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Scratchpad</CardTitle>
          <Button onClick={saveNote} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : (
            <Textarea
              placeholder="Write your medical notes, study reminders, personal thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] resize-none"
            />
          )}
        </CardContent>
      </Card>

      <Card className="bg-accent/30">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            💡 Tip: Use this space for quick notes, important reminders, or medical study summaries.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
