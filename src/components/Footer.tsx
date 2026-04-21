export default function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
              UMM E-Sports
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              Platform E-Sports terpercaya untuk mahasiswa Universitas Muhammadiyah Malang. 
              Organisasi turnamen, booking arena, dan ikuti update event terbaru.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/arenas" className="hover:text-primary transition-colors">Arenas</a></li>
              <li><a href="/tournaments" className="hover:text-primary transition-colors">Tournaments</a></li>
              <li><a href="/events" className="hover:text-primary transition-colors">Events</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} UMM E-Sports platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
