import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button, buttonVariants } from '../ui/button';
import { MapPin, Users, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface ArenaCardProps {
  arena: {
    id: number;
    name: string;
    location: string | null;
    capacity: number | null;
    image_url: string | null;
    status: string;
    description: string | null;
  };
}

export default function ArenaCard({ arena }: ArenaCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-none bg-muted/30">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={arena.image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop'}
          alt={arena.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <Badge className="absolute top-2 right-2 bg-primary font-bold">
          {arena.status.toUpperCase()}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold line-clamp-1">{arena.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{arena.location || 'UMM Campus'}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span>Capacity: {arena.capacity || 'N/A'} Seats</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {arena.description || 'Professional E-Sports arena equipped with high-end gaming peripherals and stable networking.'}
        </p>
      </CardContent>
      <CardFooter>
        <Link to={`/arenas/${arena.id}`} className={cn(buttonVariants({ variant: "outline" }), "w-full font-bold group-hover:bg-primary group-hover:text-white transition-colors")}>
          <Info className="h-4 w-4 mr-2" /> View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
