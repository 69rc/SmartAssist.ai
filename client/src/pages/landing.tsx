import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Camera, Wrench, Shield, Zap, Users } from "lucide-react";
import heroImage from "@assets/generated_images/Multi-device_app_mockup_hero_5b664173.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">SmartAssist.ai</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#technicians" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              For Technicians
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="default" data-testid="button-signin">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="default" data-testid="button-get-started">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                  AI-Powered Diagnostics
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Fix Your Appliances
                  <span className="block text-primary">with AI Assistance</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Get instant diagnostics, step-by-step repair guidance, and connect with verified technicians. 
                  Upload a photo, describe the issue, and let AI solve it.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="text-base px-8" data-testid="button-start-diagnosis">
                    Start Free Diagnosis
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="text-base px-8" data-testid="button-learn-more">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background" />
                    <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-background" />
                    <div className="w-8 h-8 rounded-full bg-primary/40 border-2 border-background" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">10,000+ users</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold">4.9</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500">★</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl blur-3xl" />
              <img 
                src={heroImage} 
                alt="SmartAssist.ai app interface on multiple devices" 
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              Features
            </Badge>
            <h2 className="text-4xl font-bold">Everything You Need to Fix Appliances</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful AI tools combined with expert technician network for complete appliance care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-card-border hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AI Chat Assistant</h3>
                <p className="text-muted-foreground">
                  Describe your appliance issue and get instant AI-powered diagnostic suggestions with step-by-step solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-card-border hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Visual Diagnostics</h3>
                <p className="text-muted-foreground">
                  Upload photos of error codes, damaged parts, or leaks. AI vision identifies the problem instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-card-border hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Expert Technicians</h3>
                <p className="text-muted-foreground">
                  Can't fix it yourself? Connect with verified local technicians, check availability, and book service instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-card-border hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Device Library</h3>
                <p className="text-muted-foreground">
                  Store all your appliance manuals, warranties, and purchase receipts in one organized digital library.
                </p>
              </CardContent>
            </Card>

            <Card className="border-card-border hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Smart Recommendations</h3>
                <p className="text-muted-foreground">
                  Get personalized maintenance tips and early fault detection to prevent breakdowns before they happen.
                </p>
              </CardContent>
            </Card>

            <Card className="border-card-border hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Trusted Network</h3>
                <p className="text-muted-foreground">
                  All technicians are verified with ratings and reviews. Pay securely through the platform with buyer protection.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              How It Works
            </Badge>
            <h2 className="text-4xl font-bold">Fix Your Appliances in 3 Simple Steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="text-2xl font-semibold">Describe or Upload</h3>
              <p className="text-muted-foreground">
                Tell our AI assistant what's wrong or upload a photo of the issue, error code, or damaged part.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="text-2xl font-semibold">Get AI Diagnosis</h3>
              <p className="text-muted-foreground">
                Receive instant diagnostic analysis with step-by-step troubleshooting instructions to try fixing it yourself.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="text-2xl font-semibold">Book a Pro</h3>
              <p className="text-muted-foreground">
                If you need help, instantly connect with verified local technicians and schedule a service call.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Ready to Fix Your Appliances?
          </h2>
          <p className="text-xl text-primary-foreground/90">
            Join thousands of homeowners saving time and money with AI-powered appliance assistance.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="text-base px-8" data-testid="button-get-started-cta">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">SmartAssist.ai</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered appliance diagnostics and repair assistance.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 SmartAssist.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
