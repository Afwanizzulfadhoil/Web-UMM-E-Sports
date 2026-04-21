import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Button, buttonVariants } from '../../components/ui/button';
import { toast } from 'sonner';
import { Trophy, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { cn } from '../../lib/utils';
import { Textarea } from '../../components/ui/textarea'

export default function ManageTournaments() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const fetchTournaments = async () => {
    try {
      const data = await api.get('/tournaments');
      setTournaments(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return;
    try {
      await api.delete(`/tournaments/${id}`);
      toast.success("Tournament deleted successfully");
      fetchTournaments();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.post('/tournaments', formData, true);
      toast.success("Tournament added successfully");
      setAddOpen(false);
      fetchTournaments();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) return <div className="p-8">Loading tournaments...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Trophy className="h-6 w-6"/> Manage Tournaments</h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger className={cn(buttonVariants({ variant: "default" }), "font-bold")}>
            <Plus className="h-4 w-4 mr-2" /> Add Tournament
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAdd}>
              <DialogHeader>
                <DialogTitle>Add New Tournament</DialogTitle>
                <DialogDescription>
                  Enter the tournament details. You can use Markdown formatting in the description.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="game">Game</Label>
                    <Input id="game" name="game" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input id="start_date" name="start_date" type="date" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input id="end_date" name="end_date" type="date" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="prize_pool">Prize Pool (Rp)</Label>
                    <Input id="prize_pool" name="prize_pool" type="number" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="max_teams">Max Teams</Label>
                    <Input id="max_teams" name="max_teams" type="number" required />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">Status</Label>
                  <select name="status" id="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="description">Detailed Description (Markdown Supported)</Label>
                  <Textarea id="description" name="description" rows={5} placeholder="Rules, formatting, and details about the tournament..." required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="image">Cover Image</Label>
                  <Input id="image" name="image" type="file" accept="image/*" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Create Tournament</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 font-bold">Name</th>
              <th className="p-4 font-bold">Game</th>
              <th className="p-4 font-bold">Prize Pool</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((tournament) => (
              <tr key={tournament.id} className="border-b last:border-0 hover:bg-muted/20">
                <td className="p-4 font-medium">{tournament.name}</td>
                <td className="p-4">{tournament.game || '-'}</td>
                <td className="p-4 text-green-500 font-bold">${tournament.prize_pool || 0}</td>
                <td className="p-4">
                  <span className="bg-muted px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{tournament.status || 'upcoming'}</span>
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(tournament.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tournaments.length === 0 && <p className="text-center p-8 text-muted-foreground">No tournaments found.</p>}
      </div>
    </div>
  );
}
