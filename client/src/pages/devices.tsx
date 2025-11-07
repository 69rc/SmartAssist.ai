import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Appliance } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, Plus, Laptop, Refrigerator, WashingMachine,
  Microwave, Fan, Zap, Calendar, Shield, Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const APPLIANCE_TYPES = [
  { value: "refrigerator", label: "Refrigerator", icon: Refrigerator },
  { value: "washing_machine", label: "Washing Machine", icon: WashingMachine },
  { value: "dishwasher", label: "Dishwasher", icon: Laptop },
  { value: "microwave", label: "Microwave", icon: Microwave },
  { value: "air_conditioner", label: "Air Conditioner", icon: Fan },
  { value: "dryer", label: "Dryer", icon: WashingMachine },
  { value: "oven", label: "Oven", icon: Microwave },
  { value: "other", label: "Other", icon: Zap },
];

export default function Devices() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    brand: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyExpiry: "",
    notes: "",
  });

  // Fetch appliances
  const { data: appliances = [], isLoading } = useQuery<Appliance[]>({
    queryKey: ["/api/appliances"],
  });

  // Create appliance mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/appliances", {
        ...data,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry) : null,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appliances"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Device Added",
        description: "Your appliance has been registered successfully.",
      });
      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        type: "",
        brand: "",
        model: "",
        serialNumber: "",
        purchaseDate: "",
        warrantyExpiry: "",
        notes: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add device",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const filteredAppliances = appliances.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.brand && device.brand.toLowerCase().includes(searchQuery.toLowerCase()))
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
            <h1 className="text-xl font-semibold">My Devices</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-device">
                <Plus className="w-4 h-4" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Appliance</DialogTitle>
                <DialogDescription>
                  Register your appliance to track maintenance, warranties, and get personalized support.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Device Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Kitchen Refrigerator"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      data-testid="input-device-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      required
                    >
                      <SelectTrigger id="type" data-testid="select-device-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {APPLIANCE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      placeholder="e.g., Samsung"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      data-testid="input-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model Number</Label>
                    <Input
                      id="model"
                      placeholder="e.g., RF28R7351SR"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      data-testid="input-model"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    placeholder="e.g., 123456789"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    data-testid="input-serial"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      data-testid="input-purchase-date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
                    <Input
                      id="warrantyExpiry"
                      type="date"
                      value={formData.warrantyExpiry}
                      onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                      data-testid="input-warranty-expiry"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    data-testid="input-notes"
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" data-testid="button-submit-device">
                    Add Device
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-devices"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-card-border">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 bg-muted rounded-lg animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAppliances.length === 0 ? (
          <Card className="border-card-border">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Laptop className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No devices found" : "No devices registered yet"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? "Try a different search term or add a new device."
                  : "Add your first appliance to start tracking warranties, maintenance schedules, and get AI-powered support."
                }
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-first-device">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Device
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppliances.map((device) => {
              const TypeIcon = APPLIANCE_TYPES.find(t => t.value === device.type)?.icon || Laptop;
              const isWarrantyActive = device.warrantyExpiry && new Date(device.warrantyExpiry) > new Date();
              
              return (
                <Card key={device.id} className="border-card-border hover-elevate" data-testid={`card-device-${device.id}`}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-primary" />
                      </div>
                      {isWarrantyActive && (
                        <Badge variant="secondary" className="gap-1">
                          <Shield className="w-3 h-3" />
                          Warranty
                        </Badge>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{device.name}</h3>
                      {device.brand && (
                        <p className="text-sm text-muted-foreground">{device.brand} {device.model && `• ${device.model}`}</p>
                      )}
                    </div>

                    {device.purchaseDate && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Purchased {new Date(device.purchaseDate).toLocaleDateString()}</span>
                      </div>
                    )}

                    <Button variant="outline" size="sm" className="w-full" data-testid={`button-view-device-${device.id}`}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
