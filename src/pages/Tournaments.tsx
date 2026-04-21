import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import TournamentCard from '../components/Cards/TournamentCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { motion } from 'motion/react';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/tournaments')
      .then(setTournaments)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filterByStatus = (status: string) => {
    if (status === 'all') return tournaments;
    return tournaments.filter((t: any) => t.status?.toLowerCase() === status.toLowerCase());
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Championships</h1>
        <p className="text-muted-foreground">Join the battle and compete with the best teams at UMM.</p>
      </div>

      <Tabs defaultValue="all" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 border">
          <TabsTrigger value="all" className="font-bold px-6">ALL</TabsTrigger>
          <TabsTrigger value="upcoming" className="font-bold px-6">UPCOMING</TabsTrigger>
          <TabsTrigger value="ongoing" className="font-bold px-6">ONGOING</TabsTrigger>
          <TabsTrigger value="completed" className="font-bold px-6">COMPLETED</TabsTrigger>
        </TabsList>

        {['all', 'upcoming', 'ongoing', 'completed'].map((status) => (
          <TabsContent key={status} value={status}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filterByStatus(status).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filterByStatus(status).map((tournament: any, index: number) => (
                  <motion.div
                    key={tournament.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TournamentCard tournament={tournament} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
                <p className="text-xl font-bold opacity-50">No {status} tournaments found.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
