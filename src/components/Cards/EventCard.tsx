import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button, buttonVariants } from '../ui/button';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface EventCardProps {
  event: {
    id: number;
    name: string;
    date: string | null;
    time: string | null;
    location: string | null;
    category: string | null;
    image_url: string | null;
    status: string | null;
  };
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col md:flex-row group hover:shadow-lg transition-all duration-300 border-none bg-muted/30">
      <div className="relative w-full md:w-48 aspect-square md:aspect-auto overflow-hidden">
        <img
          src={event.image_url || 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2670&auto=format&fit=crop'}
          alt={event.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <Badge className="absolute top-2 left-2 bg-primary font-bold">
          {event.category || 'EVENT'}
        </Badge>
      </div>
      <div className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl font-bold line-clamp-1">{event.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{event.time || 'All Day'}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground gap-2 col-span-1 md:col-span-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{event.location || 'UMM Main Hall'}</span>
          </div>
        </CardContent>
        <CardFooter className="mt-auto pt-4 flex justify-between items-center bg-muted/50 p-4">
          <div className="flex items-center text-xs font-medium uppercase tracking-widest text-primary">
            <Tag className="h-3 w-3 mr-1" />
            {event.status || 'Upcoming'}
          </div>
          <Link to={`/events/${event.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "font-bold hover:text-primary")}>
            View Info
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}
