import { buttonVariants } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, Shield, Users, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Home() {
  const [stats, setStats] = useState({
    arenas: 0,
    users: 0,
    tournaments: 0,
    prizePool: '0'
  });

  useEffect(() => {
    api.get('/public-stats')
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  const formatPrizePool = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
    return num.toString();
  };

  const features = [
    {
      icon: <Trophy className="h-6 w-6 text-primary" />,
      title: 'Tournaments',
      description: 'Join competitive tournaments and win amazing prizes.',
      href: '/tournaments',
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: 'Arenas',
      description: 'Book professional E-Sports arenas with high-end PCs.',
      href: '/arenas',
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: 'Events',
      description: 'Level up your skills with community workshops and events.',
      href: '/events',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop"
            alt="E-Sports League"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white uppercase mb-6 italic">
              Level Up Your <br />
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Game Experience</span>
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-10">
              The official E-Sports platform for UMM students. Connect, compete, and conquer in the digital arena.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tournaments" className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-lg font-bold")}>
                View Tournaments
              </Link>
              <Link to="/arenas" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-14 px-8 text-lg font-bold bg-white/5 border-white/20 hover:bg-white/10")}>
                Explore Arenas
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border bg-card hover:shadow-xl transition-all group"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground mb-6">
                {feature.description}
              </p>
              <Link to={feature.href || '#'} className="inline-flex items-center text-sm font-bold text-primary hover:gap-2 transition-all">
                Learn More <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-4xl md:text-5xl font-black mb-2">{stats.arenas}+</p>
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Pro Arenas</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <p className="text-4xl md:text-5xl font-black mb-2">{stats.users}+</p>
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Active Users</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <p className="text-4xl md:text-5xl font-black mb-2">{stats.tournaments}+</p>
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Tournaments</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <p className="text-4xl md:text-5xl font-black mb-2">{formatPrizePool(stats.prizePool)}</p>
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Prize Pool</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl p-12 md:p-20 text-primary-foreground relative overflow-hidden">
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter italic">
                Ready to Join the Elite?
              </h2>
              <p className="text-xl mb-10 opacity-90">
                Sign up now to start your journey. Connect with teams, join tournaments, and show your skills.
              </p>
              <Link to="/register" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "h-14 px-10 text-lg font-bold")}>
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
