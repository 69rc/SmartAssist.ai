import { db } from "./db";
import { technicians, users } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Create a temp user for testing
  try {
    await db.insert(users).values({
      id: "temp-user-001",
      username: "demo_user",
      email: "demo@smartassist.ai",
      password: "hashed_password_placeholder",
      fullName: "Demo User",
      phone: "(555) 123-4567",
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
    }).onConflictDoNothing();
  } catch (error) {
    console.log("User already exists or error:", error);
  }

  // Seed technicians
  const sampleTechnicians = [
    {
      name: "John Martinez",
      email: "john.martinez@example.com",
      phone: "(555) 234-5678",
      bio: "Expert HVAC technician with 15+ years of experience in residential and commercial systems.",
      specialties: ["HVAC", "Refrigeration", "Air Conditioning"],
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      hourlyRate: "85.00",
      rating: "4.9",
      totalReviews: 127,
      verified: true,
      available: true,
    },
    {
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      phone: "(555) 345-6789",
      bio: "Certified appliance repair specialist focused on washers, dryers, and kitchen appliances.",
      specialties: ["Appliances", "Washing Machines", "Dryers", "Dishwashers"],
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      hourlyRate: "75.00",
      rating: "4.8",
      totalReviews: 94,
      verified: true,
      available: true,
    },
    {
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      phone: "(555) 456-7890",
      bio: "Licensed electrician specializing in appliance installation and electrical troubleshooting.",
      specialties: ["Electrical", "Dishwashers", "Ovens", "Installation"],
      city: "Oakland",
      state: "CA",
      zipCode: "94612",
      hourlyRate: "90.00",
      rating: "4.7",
      totalReviews: 156,
      verified: true,
      available: false,
    },
    {
      name: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      phone: "(555) 567-8901",
      bio: "Appliance repair expert with a focus on energy efficiency and preventive maintenance.",
      specialties: ["Refrigeration", "Energy Efficiency", "Preventive Maintenance"],
      city: "San Jose",
      state: "CA",
      zipCode: "95110",
      hourlyRate: "80.00",
      rating: "4.9",
      totalReviews: 88,
      verified: true,
      available: true,
    },
    {
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "(555) 678-9012",
      bio: "Commercial and residential HVAC specialist with factory certifications from major brands.",
      specialties: ["HVAC", "Air Conditioning", "Heating Systems"],
      city: "San Francisco",
      state: "CA",
      zipCode: "94110",
      hourlyRate: "95.00",
      rating: "4.8",
      totalReviews: 142,
      verified: true,
      available: true,
    },
  ];

  try {
    await db.insert(technicians).values(sampleTechnicians).onConflictDoNothing();
    console.log("✓ Seeded technicians successfully");
  } catch (error) {
    console.error("Error seeding technicians:", error);
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
