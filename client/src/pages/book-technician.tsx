import { useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Technician } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { 
  ArrowLeft, Star, CheckCircle, MapPin, Calendar as CalendarIcon,
  Clock, CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock time slots
const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

export default function BookTechnician() {
  const [, params] = useRoute("/book/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [applianceId, setApplianceId] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch technician data from API
  const { data: technician, isLoading: techLoading } = useQuery<Technician>({
    queryKey: ["/api/technicians", params?.id],
    queryFn: async () => {
      const response = await fetch(`/api/technicians/${params?.id}`);
      if (!response.ok) throw new Error("Technician not found");
      return response.json();
    },
    enabled: !!params?.id,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Booking Requested",
        description: "Your service request has been sent to the technician.",
      });
      setIsSubmitting(false);
      setLocation("/bookings");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const estimatedCost = selectedTime && technician ? parseFloat(technician.hourlyRate) * 2 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !serviceType || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const bookingData = {
      technicianId: params?.id,
      applianceId: applianceId || null,
      serviceType,
      problemDescription: description,
      scheduledDate: selectedDate,
      estimatedCost: estimatedCost.toString(),
    };

    createBookingMutation.mutate(bookingData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/technicians">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Book Technician</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {techLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : !technician ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Technician Not Found</h2>
            <p className="text-muted-foreground mb-6">The technician you're looking for doesn't exist.</p>
            <Link href="/technicians">
              <Button>Find Technicians</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
            <Card className="border-card-border">
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select value={serviceType} onValueChange={setServiceType} required>
                      <SelectTrigger id="serviceType" data-testid="select-service-type">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="installation">Installation</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appliance">Appliance (Optional)</Label>
                    <Select value={applianceId} onValueChange={setApplianceId}>
                      <SelectTrigger id="appliance" data-testid="select-appliance">
                        <SelectValue placeholder="Select from your devices" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No device selected</SelectItem>
                        {/* Will be populated with user's devices */}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Problem Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the issue you're experiencing..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-32"
                      required
                      data-testid="input-description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Select Date *</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                      data-testid="calendar-date-picker"
                    />
                  </div>

                  {selectedDate && (
                    <div className="space-y-2">
                      <Label htmlFor="time">Select Time *</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime} required>
                        <SelectTrigger id="time" data-testid="select-time">
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting || !selectedDate || !selectedTime}
                    data-testid="button-submit-booking"
                  >
                    {isSubmitting ? "Processing..." : "Proceed to Payment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            </div>

            {/* Technician Summary & Cost */}
            <div className="space-y-6">
            <Card className="border-card-border">
              <CardHeader>
                <CardTitle className="text-base">Technician</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {technician.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{technician.name}</h3>
                      {technician.verified && (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{technician.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({technician.totalReviews})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{technician.city}, {technician.state}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {technician.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedDate && selectedTime && (
              <Card className="border-card-border">
                <CardHeader>
                  <CardTitle className="text-base">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedTime}</span>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Hourly Rate</span>
                      <span>${technician.hourlyRate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Est. Duration</span>
                      <span>2 hours</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Estimated Total</span>
                      <span>${estimatedCost.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CreditCard className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>
                        Final cost may vary based on actual service time. Payment will be processed after service completion.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
