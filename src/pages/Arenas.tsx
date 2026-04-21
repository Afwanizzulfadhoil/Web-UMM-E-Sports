import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import ArenaCard from '../components/Cards/ArenaCard';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function Arenas() {
  const [arenas, setArenas] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/arenas')
      .then(setArenas)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredArenas = arenas.filter((arena: any) => 
    arena.name.toLowerCase().includes(search.toLowerCase()) ||
    arena.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Our Arenas</h1>
          <p className="text-muted-foreground">Professional E-Sports facilities at UMM campus.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search arenas..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filteredArenas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArenas.map((arena: any, index: number) => (
            <motion.div
              key={arena.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ArenaCard arena={arena} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
          <p className="text-xl font-bold opacity-50">No arenas found matching your search.</p>
        </div>
      )}
    </div>
  );
}
