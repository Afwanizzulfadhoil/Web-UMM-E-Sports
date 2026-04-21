import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Button, buttonVariants } from '../components/ui/button';
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(setEvent)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading details...</div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center flex-col gap-4"><h1>Event not found</h1><Link to="/events" className={cn(buttonVariants({ variant: "default" }))}>Go back</Link></div>;

  return (
    <div className="container mx-auto px-4 py-12 md:px-8 max-w-5xl">
      <Link to="/events" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
      </Link>

      <div className="bg-card rounded-3xl border overflow-hidden shadow-xl">
        <div className="aspect-[21/9] relative overflow-hidden">
          <img
            src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2670&auto=format&fit=crop'}
            alt={event.name}
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-left">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-primary px-3 py-1 rounded text-xs font-black uppercase tracking-widest">{event.category || 'Event'}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">{event.name}</h1>
          </div>
        </div>

        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Event Details</h3>
              {event.description ? (
                <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                  <Markdown>{event.description}</Markdown>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No detailed description available.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-2xl border">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-4 text-muted-foreground">Information</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Date</p>
                    <p className="font-bold">{event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Time</p>
                    <p className="font-bold font-mono">{event.time || 'TBA'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Location</p>
                    <p className="font-bold">{event.location || 'TBA'}</p>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full font-black uppercase tracking-tighter h-14 text-lg">
              RSVP NOW
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
