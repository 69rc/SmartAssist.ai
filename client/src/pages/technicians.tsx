import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Technician } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, Search, MapPin, Star, CheckCircle, Calendar,
  Wrench, Home, Wind, Zap
} from "lucide-react";

const SPECIALTY_ICONS: Record<string, any> = {
  "HVAC": Wind,
  "Refrigeration": Zap,
  "Appliances": Home,
  "Electrical": Zap,
  "default": Wrench,
};

export default function Technicians() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  // Fetch technicians from API
  const { data: technicians = [], isLoading } = useQuery<Technician[]>({
    queryKey: ["/api/technicians", selectedCity, selectedSpecialty],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCity && selectedCity !== "all") params.append("city", selectedCity);
      if (selectedSpecialty && selectedSpecialty !== "all") params.append("specialty", selectedSpecialty);
      
      const response = await fetch(`/api/technicians?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch technicians");
      return response.json();
    },
  });

  // Filter by search query
  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <h1 className="text-xl font-semibold">Find Technicians</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filters */}
        <Card className="mb-8 border-card-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Search by name or specialty</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search technicians..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-technicians"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger id="city" className="mt-2" data-testid="select-city">
                      <SelectValue placeholder="All cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All cities</SelectItem>
                      <SelectItem value="san-francisco">San Francisco</SelectItem>
                      <SelectItem value="oakland">Oakland</SelectItem>
                      <SelectItem value="san-jose">San Jose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger id="specialty" className="mt-2" data-testid="select-specialty">
                      <SelectValue placeholder="All specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All specialties</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="appliances">Appliances</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="refrigeration">Refrigeration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${filteredTechnicians.length} technicians found`}
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-card-border">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                        <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTechnicians.length === 0 ? (
            <Card className="border-card-border">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No technicians found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search filters or expanding your search area.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTechnicians.map((tech) => {
              const Icon = SPECIALTY_ICONS[tech.specialties[0]] || SPECIALTY_ICONS.default;
              
              return (
                <Card key={tech.id} className="border-card-border hover-elevate" data-testid={`card-technician-${tech.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Technician Info */}
                      <div className="flex gap-4 flex-1">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                            {tech.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-semibold">{tech.name}</h3>
                              {tech.verified && (
                                <Badge variant="secondary" className="gap-1 text-xs">
                                  <CheckCircle className="w-3 h-3" />
                                  Verified
                                </Badge>
                              )}
                              {tech.available ? (
                                <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 text-xs">
                                  Available
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  Limited Availability
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-sm">{parseFloat(tech.rating).toFixed(1)}</span>
                              <span className="text-sm text-muted-foreground">
                                ({tech.totalReviews} reviews)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{tech.city}, {tech.state}</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {tech.specialties.map((specialty) => (
                              <Badge key={specialty} variant="outline" className="gap-1">
                                <Icon className="w-3 h-3" />
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Area */}
                      <div className="flex flex-col justify-between items-end gap-4 lg:min-w-[200px]">
                        <div className="text-right">
                          <p className="text-2xl font-bold">${tech.hourlyRate}</p>
                          <p className="text-sm text-muted-foreground">per hour</p>
                        </div>

                        <div className="flex flex-col gap-2 w-full lg:w-auto">
                          <Link href={`/book/${tech.id}`}>
                            <Button className="w-full gap-2" data-testid={`button-book-${tech.id}`}>
                              <Calendar className="w-4 h-4" />
                              Book Now
                            </Button>
                          </Link>
                          <Button variant="outline" className="w-full" data-testid={`button-view-profile-${tech.id}`}>
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
