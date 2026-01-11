import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bookmark, Plus, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

export default function Bookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchBookmarks();
  }, [user]);

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load bookmarks');
    } else {
      setBookmarks(data || []);
    }
    setLoading(false);
  };

  const addBookmark = async () => {
    if (!title.trim() || !url.trim()) return;

    // Simple URL validation
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .insert({ user_id: user?.id, title: title.trim(), url: finalUrl })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add bookmark');
    } else {
      setBookmarks([data, ...bookmarks]);
      setTitle('');
      setUrl('');
      toast.success('Bookmark added!');
    }
  };

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete bookmark');
    } else {
      setBookmarks(bookmarks.filter(b => b.id !== id));
      toast.success('Bookmark deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-primary">
          <Bookmark className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Bookmarks</h1>
          <p className="text-muted-foreground">Save important study links</p>
        </div>
      </div>

      {/* Add Bookmark */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Bookmark</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <Input
              placeholder="Title (e.g., Anatomy Notes)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="URL (e.g., example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addBookmark}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookmarks List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Saved Links</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : bookmarks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No bookmarks saved yet. Add your first study link above!
            </p>
          ) : (
            <ul className="space-y-3">
              {bookmarks.map((bookmark) => (
                <li
                  key={bookmark.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                >
                  <Bookmark className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{bookmark.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {bookmark.url}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(bookmark.url, '_blank')}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteBookmark(bookmark.id)}
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
