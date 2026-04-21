import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button, buttonVariants } from '../ui/button';
import { Trophy, Calendar, Users, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface TournamentCardProps {
  tournament: {
    id: number;
    name: string;
    game: string | null;
    start_date: string | null;
    prize_pool: string | number | null;
    max_teams: number | null;
    status: string | null;
    image_url: string | null;
  };
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const statusColor = {
    'upcoming': 'bg-blue-500',
    'ongoing': 'bg-green-500',
    'completed': 'bg-zinc-500',
    'cancelled': 'bg-red-500',
  }[tournament.status?.toLowerCase() || 'upcoming'] || 'bg-primary';

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-none bg-muted/30">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={tournament.image_url || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2670&auto=format&fit=crop'}
          alt={tournament.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <Badge className={`absolute top-2 right-2 ${statusColor} text-white font-bold`}>
          {tournament.status?.toUpperCase() || 'UPCOMING'}
        </Badge>
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Gamepad2 className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{tournament.game || 'E-Sports'}</span>
        </div>
        <CardTitle className="text-xl font-bold line-clamp-1 italic">{tournament.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : 'TBA'}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span>Prize Pool: Rp {tournament.prize_pool || '0'}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span>Max: {tournament.max_teams || 'N/A'} Teams</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/tournaments/${tournament.id}`} className={cn(buttonVariants({ variant: "default" }), "w-full font-bold uppercase tracking-tighter italic")}>
          JOIN NOW
        </Link>
      </CardFooter>
    </Card>
  );
}
