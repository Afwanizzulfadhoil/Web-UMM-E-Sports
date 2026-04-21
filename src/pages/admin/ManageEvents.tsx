import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Button, buttonVariants } from '../../components/ui/button';
import { toast } from 'sonner';
import { Calendar, Plus } from 'lucide-react';
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

export default function ManageEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const data = await api.get('/events');
      setEvents(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.post('/events', formData, true);
      toast.success("Event added successfully");
      setAddOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) return <div className="p-8">Loading events...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Calendar className="h-6 w-6"/> Manage Events</h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger className={cn(buttonVariants({ variant: "default" }), "font-bold")}>
            <Plus className="h-4 w-4 mr-2" /> Add Event
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAdd}>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Enter the event details. You can use Markdown formatting in the description.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Event Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" placeholder="E.g., Workshop, Networking" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" name="time" type="time" required />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" required />
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
                  <Textarea id="description" name="description" rows={5} placeholder="Agenda, speakers, and details about the event..." required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="image">Cover Image</Label>
                  <Input id="image" name="image" type="file" accept="image/*" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Create Event</Button>
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
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold">Date & Time</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b last:border-0 hover:bg-muted/20">
                <td className="p-4 font-medium">{event.name}</td>
                <td className="p-4">{event.category || '-'}</td>
                <td className="p-4">{event.date ? new Date(event.date).toLocaleDateString() : '-'} {event.time || ''}</td>
                <td className="p-4">
                  <span className="bg-muted px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{event.status || 'upcoming'}</span>
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <p className="text-center p-8 text-muted-foreground">No events found.</p>}
      </div>
    </div>
  );
}
