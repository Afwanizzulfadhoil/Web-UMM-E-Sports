import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-20 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Have questions about tournaments or arena booking? Reach out to our team.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                <p className="text-lg font-bold">esports@umm.ac.id</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Phone</p>
                <p className="text-lg font-bold">+62 812-3456-7890</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Location</p>
                <p className="text-lg font-bold">UMM Campus III, Malang, Indonesia</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-muted/30">
          <CardContent className="p-8 md:p-12">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your name" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" className="bg-background" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What is this about?" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea 
                  id="message" 
                  className="w-full h-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Your message here..."
                />
              </div>
              <Button size="lg" className="w-full font-bold">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
