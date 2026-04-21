import { useEffect, useState, useMemo } from 'react';
import { api } from '../lib/api';
import EventCard from '../components/Cards/EventCard';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from '../components/ui/calendar';
import { Button } from '../components/ui/button';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    api.get('/events')
      .then(setEvents)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const eventDates = useMemo(() => {
    return events
      .filter((e: any) => e.date)
      .map((e: any) => new Date(e.date));
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!date) return events;
    return events.filter((e: any) => {
      if (!e.date) return false;
      const eDate = new Date(e.date);
      return eDate.toDateString() === date.toDateString();
    });
  }, [events, date]);

  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      <div className="flex items-center gap-4 mb-12">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <CalendarIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Community Events</h1>
          <p className="text-muted-foreground">Networking, workshops, and gatherings for gamers.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Calendar Sidebar */}
        <div className="w-full lg:w-[350px] shrink-0 bg-card border rounded-3xl p-6 shadow-sm sticky top-24">
          <div className="mb-4">
            <h3 className="font-bold text-lg">Event Calendar</h3>
            <p className="text-sm text-muted-foreground">Select a date to view scheduled events.</p>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border-0 w-full flex justify-center pb-4"
            modifiers={{
              event: eventDates,
            }}
            modifiersClassNames={{
              event: "font-black text-primary bg-primary/10",
            }}
          />
          {date && (
            <Button 
              variant="outline" 
              className="w-full mt-2 font-bold"
              onClick={() => setDate(undefined)}
            >
              <X className="h-4 w-4 mr-2" /> Show All Events
            </Button>
          )}
        </div>

        {/* Event List */}
        <div className="grid grid-cols-1 gap-6 flex-grow w-full">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
                ))}
              </motion.div>
            ) : filteredEvents.length > 0 ? (
              <motion.div
                key={date ? date.toISOString() : 'all'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 gap-6"
              >
                {filteredEvents.map((event: any, index: number) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6"
              >
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
                <p className="text-2xl font-black mb-2 tracking-tight">No Events Found</p>
                <p className="text-muted-foreground max-w-sm">
                  {date 
                    ? `There are no events scheduled for ${date.toLocaleDateString()}. Try selecting another date.` 
                    : 'Stay tuned! We are brewing up some new awesome community events.'}
                </p>
                {date && (
                   <Button variant="link" className="mt-4 text-primary" onClick={() => setDate(undefined)}>
                     View all upcoming events
                   </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
