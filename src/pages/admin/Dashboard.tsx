import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Trophy, 
  Calendar, 
  Users, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function Dashboard() {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Overview', icon: <LayoutDashboard className="h-5 w-5" />, href: '/admin' },
    { name: 'Manage Arenas', icon: <MapPin className="h-5 w-5" />, href: '/admin/arenas' },
    { name: 'Manage Tournaments', icon: <Trophy className="h-5 w-5" />, href: '/admin/tournaments' },
    { name: 'Manage Events', icon: <Calendar className="h-5 w-5" />, href: '/admin/events' },
    { name: 'Manage Users', icon: <Users className="h-5 w-5" />, href: '/admin/users' },
  ];

  const isOverview = location.pathname === '/admin';

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r bg-background hidden md:block">
        <div className="p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Admin Panel</h2>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.href 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-grow p-4 md:p-8">
        {isOverview ? <AdminOverview /> : <Outlet />}
      </main>
    </div>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState({ arenas: 0, tournaments: 0, events: 0, users: 0 });
  const [activities, setActivities] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      const [{ arenas, tournaments, events, users }, acts] = await Promise.all([
        api.get('/stats'),
        api.get('/activities')
      ]);
      setStats({ arenas, tournaments, events, users });
      setActivities(acts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 10 seconds for real-time feel
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Administrator.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Arenas" value={stats.arenas} icon={<MapPin className="h-4 w-4" />} color="bg-blue-500" />
        <StatCard title="Tournaments" value={stats.tournaments} icon={<Trophy className="h-4 w-4" />} color="bg-yellow-500" />
        <StatCard title="Active Events" value={stats.events} icon={<Calendar className="h-4 w-4" />} color="bg-green-500" />
        <StatCard title="Registered Users" value={stats.users} icon={<Users className="h-4 w-4" />} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col min-h-[300px]">
          <h3 className="text-lg font-bold mb-6">Recent Activities</h3>
          <div className="space-y-4 flex-grow overflow-y-auto pr-2">
            {activities.length > 0 ? activities.map((act) => (
              <div key={act.id} className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded-xl transition-colors">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium truncate">
                    {act.user?.name || 'System'}: {act.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(act.created_at).toLocaleString()}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            )) : <p className="text-sm text-muted-foreground text-center pt-8">No recent activities.</p>}
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold mb-6">System Status</h3>
          <div className="space-y-6">
            <StatusItem label="Database connection" status="Online" color="bg-green-500" />
            <StatusItem label="API Gateway" status="Healthy" color="bg-green-500" />
            <StatusItem label="Authentication Server" status="Active" color="bg-green-500" />
            <StatusItem label="File Storage" status="Storage at 45%" color="bg-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-card p-6 rounded-2xl border shadow-sm relative overflow-hidden group">
      <div className={cn("absolute right-[-10px] top-[-10px] h-20 w-20 rounded-full opacity-10 group-hover:scale-125 transition-transform", color)} />
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-lg text-white", color)}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-sm text-muted-foreground font-medium">{title}</p>
    </div>
  );
}

function StatusItem({ label, status, color }: any) {
  return (
    <div className="flex items-center justify-between ">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2 border px-3 py-1 rounded-full bg-muted/20">
        <div className={cn("h-2 w-2 rounded-full", color)} />
        <span className="text-xs font-bold uppercase tracking-tighter">{status}</span>
      </div>
    </div>
  );
}
