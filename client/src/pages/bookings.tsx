import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, Calendar, MapPin, Clock, Star, Plus
} from "lucide-react";

export default function Bookings() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">My Bookings</h1>
          </div>
          <Link href="/technicians">
            <Button className="gap-2" data-testid="button-book-technician">
              <Plus className="w-4 h-4" />
              Book Technician
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Empty State */}
        <Card className="border-card-border">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              When you book a technician for service, your appointments will appear here.
            </p>
            <Link href="/technicians">
              <Button data-testid="button-find-technician">
                <Plus className="w-4 h-4 mr-2" />
                Find a Technician
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* This will show actual bookings once connected to backend */}
        {/* Example booking card structure for when data is available:
        <div className="space-y-4">
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex gap-4 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      JM
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold">John Martinez</h3>
                      <p className="text-sm text-muted-foreground">HVAC Repair</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>March 15, 2024</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>2:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>San Francisco, CA</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end gap-4">
                  <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
                    Pending
                  </Badge>
                  <div className="text-right">
                    <p className="text-2xl font-bold">$170.00</p>
                    <p className="text-sm text-muted-foreground">Estimated</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        */}
      </main>
    </div>
  );
}
