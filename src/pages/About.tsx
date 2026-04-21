export default function About() {
  return (
    <div className="container mx-auto px-4 py-20 md:px-8 max-w-4xl">
      <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-12 border-b-8 border-primary w-fit pr-8">
        About UMM E-Sports
      </h1>
      
      <div className="space-y-12 text-lg leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="h-2 w-8 bg-primary rounded-full" />
            Our Vision
          </h2>
          <p className="text-muted-foreground">
            UMM E-Sports aims to be the premier hub for gaming excellence at Universitas Muhammadiyah Malang. 
            We provide a platform where competitive gaming meets academic culture, producing professional talent 
            and a strong community bond.
          </p>
        </section>

        <section className="bg-muted/30 p-8 rounded-3xl border">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="h-2 w-8 bg-primary rounded-full" />
            What We Offer
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex-shrink-0 mt-1" />
              <span>State-of-the-art gaming arenas</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex-shrink-0 mt-1" />
              <span>Major university-wide tournaments</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex-shrink-0 mt-1" />
              <span>E-Sports industry workshops</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex-shrink-0 mt-1" />
              <span>Player stats and ranking system</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="h-2 w-8 bg-primary rounded-full" />
            Join the Movement
          </h2>
          <p className="text-muted-foreground mb-6">
            Whether you're a casual player or a pro-wannabe, there's a place for you in UMM E-Sports. 
            Connect with like-minded students and build your legacy.
          </p>
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop" 
            alt="Gaming Community"
            className="w-full rounded-3xl object-cover h-64 shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </section>
      </div>
    </div>
  );
}
