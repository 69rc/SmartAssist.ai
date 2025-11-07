import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, MessageSquare, Laptop, Calendar, 
  Settings, Plus, Zap, ChevronRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Appliance, Diagnosis, Booking } from "@shared/schema";

export default function Dashboard() {
  const [location] = useLocation();

  // Fetch dashboard stats from API
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const displayStats = stats || {
    totalDevices: 0,
    activeDiagnoses: 0,
    upcomingBookings: 0,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">SmartAssist.ai</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" data-testid="button-settings">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">U</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 border-r bg-muted/30 min-h-[calc(100vh-4rem)] sticky top-16">
          <div className="p-6 space-y-2">
            <Link href="/dashboard">
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-3 ${location === '/dashboard' ? 'bg-accent' : ''}`}
                data-testid="link-dashboard"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/diagnose">
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-3 ${location === '/diagnose' ? 'bg-accent' : ''}`}
                data-testid="link-diagnose"
              >
                <MessageSquare className="w-4 h-4" />
                AI Diagnosis
              </Button>
            </Link>
            <Link href="/devices">
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-3 ${location === '/devices' ? 'bg-accent' : ''}`}
                data-testid="link-devices"
              >
                <Laptop className="w-4 h-4" />
                My Devices
              </Button>
            </Link>
            <Link href="/bookings">
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-3 ${location === '/bookings' ? 'bg-accent' : ''}`}
                data-testid="link-bookings"
              >
                <Calendar className="w-4 h-4" />
                Bookings
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back! Here's your appliance overview.</p>
              </div>
              <Link href="/diagnose">
                <Button size="lg" className="gap-2" data-testid="button-new-diagnosis">
                  <Plus className="w-4 h-4" />
                  New Diagnosis
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-card-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                  <Laptop className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-devices">
                    {statsLoading ? "..." : displayStats.totalDevices}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registered appliances
                  </p>
                </CardContent>
              </Card>

              <Card className="border-card-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Diagnoses</CardTitle>
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-active-diagnoses">
                    {statsLoading ? "..." : displayStats.activeDiagnoses}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Open support sessions
                  </p>
                </CardContent>
              </Card>

              <Card className="border-card-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-upcoming-bookings">
                    {statsLoading ? "..." : displayStats.upcomingBookings}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scheduled services
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/diagnose">
                  <Card className="border-card-border hover-elevate cursor-pointer">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">Start AI Diagnosis</h3>
                        <p className="text-sm text-muted-foreground">Get instant help</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/devices">
                  <Card className="border-card-border hover-elevate cursor-pointer">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">Add New Device</h3>
                        <p className="text-sm text-muted-foreground">Register appliance</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/technicians">
                  <Card className="border-card-border hover-elevate cursor-pointer">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">Find Technician</h3>
                        <p className="text-sm text-muted-foreground">Book expert help</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Empty State */}
            <Card className="border-card-border">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Laptop className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No devices registered yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start by adding your first appliance or getting an AI diagnosis for any issue you're facing.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/devices">
                    <Button variant="outline" data-testid="button-add-device">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Device
                    </Button>
                  </Link>
                  <Link href="/diagnose">
                    <Button data-testid="button-start-diagnosis">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Start Diagnosis
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
