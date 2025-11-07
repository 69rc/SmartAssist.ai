// Reference: javascript_stripe blueprint and javascript_openai blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import Stripe from "stripe";
import { storage } from "./storage";
import { diagnoseIssue, analyzeApplianceImage } from "./ai";
import { 
  insertApplianceSchema, insertDiagnosisSchema, 
  insertBookingSchema, insertReviewSchema 
} from "@shared/schema";

// Initialize Stripe lazily to prevent crashes when key is missing
let stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });
  }
  return stripe;
}

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function for temporary user (will be replaced with proper auth)
  const getTempUserId = () => "temp-user-001";

  // ===== APPLIANCES ROUTES =====
  app.get("/api/appliances", async (req, res) => {
    try {
      const userId = getTempUserId();
      const appliances = await storage.getUserAppliances(userId);
      res.json(appliances);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching appliances: " + error.message });
    }
  });

  app.get("/api/appliances/:id", async (req, res) => {
    try {
      const appliance = await storage.getAppliance(req.params.id);
      if (!appliance) {
        return res.status(404).json({ message: "Appliance not found" });
      }
      res.json(appliance);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching appliance: " + error.message });
    }
  });

  app.post("/api/appliances", async (req, res) => {
    try {
      const userId = getTempUserId();
      const validated = insertApplianceSchema.parse({
        ...req.body,
        userId,
      });
      const appliance = await storage.createAppliance(validated);
      res.status(201).json(appliance);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating appliance: " + error.message });
    }
  });

  app.patch("/api/appliances/:id", async (req, res) => {
    try {
      const appliance = await storage.updateAppliance(req.params.id, req.body);
      res.json(appliance);
    } catch (error: any) {
      res.status(400).json({ message: "Error updating appliance: " + error.message });
    }
  });

  app.delete("/api/appliances/:id", async (req, res) => {
    try {
      await storage.deleteAppliance(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting appliance: " + error.message });
    }
  });

  // ===== DIAGNOSES ROUTES =====
  app.get("/api/diagnoses", async (req, res) => {
    try {
      const userId = getTempUserId();
      const diagnoses = await storage.getUserDiagnoses(userId);
      res.json(diagnoses);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching diagnoses: " + error.message });
    }
  });

  app.get("/api/diagnoses/:id", async (req, res) => {
    try {
      const diagnosis = await storage.getDiagnosis(req.params.id);
      if (!diagnosis) {
        return res.status(404).json({ message: "Diagnosis not found" });
      }
      res.json(diagnosis);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching diagnosis: " + error.message });
    }
  });

  app.post("/api/diagnose", async (req, res) => {
    try {
      const userId = getTempUserId();
      const { issue, applianceType, brand, model, conversationHistory } = req.body;

      // Get AI diagnosis
      const aiResponse = await diagnoseIssue({
        issue,
        applianceType,
        brand,
        model,
        conversationHistory,
      });

      // Save diagnosis to database
      const diagnosis = await storage.createDiagnosis({
        userId,
        issue,
        messages: conversationHistory || [],
        diagnosis: aiResponse.diagnosis,
        solution: aiResponse.solution,
        status: "open",
        resolved: false,
      });

      res.json({
        diagnosisId: diagnosis.id,
        response: aiResponse.conversationResponse,
        diagnosis: aiResponse.diagnosis,
        solution: aiResponse.solution,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error processing diagnosis: " + error.message });
    }
  });

  app.patch("/api/diagnoses/:id", async (req, res) => {
    try {
      const diagnosis = await storage.updateDiagnosis(req.params.id, req.body);
      res.json(diagnosis);
    } catch (error: any) {
      res.status(400).json({ message: "Error updating diagnosis: " + error.message });
    }
  });

  // ===== IMAGE ANALYSIS ROUTE =====
  app.post("/api/analyze-image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const userId = getTempUserId();
      const { applianceType, userDescription } = req.body;

      // Convert image to base64
      const base64Image = req.file.buffer.toString('base64');

      // Analyze image with AI
      const analysis = await analyzeApplianceImage({
        base64Image,
        applianceType,
        userDescription,
      });

      // Create diagnosis with image
      const diagnosis = await storage.createDiagnosis({
        userId,
        issue: userDescription || "Image-based diagnosis",
        messages: [],
        diagnosis: analysis.analysis,
        solution: analysis.recommendations,
        imageAnalysis: analysis.analysis,
        status: "open",
        resolved: false,
      });

      res.json({
        diagnosisId: diagnosis.id,
        analysis: analysis.analysis,
        identifiedIssues: analysis.identifiedIssues,
        recommendations: analysis.recommendations,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error analyzing image: " + error.message });
    }
  });

  // ===== TECHNICIANS ROUTES =====
  app.get("/api/technicians", async (req, res) => {
    try {
      const { city, state, specialty } = req.query;
      
      let technicians;
      if (city || state || specialty) {
        technicians = await storage.searchTechnicians({
          city: city as string,
          state: state as string,
          specialty: specialty as string,
        });
      } else {
        technicians = await storage.getAllTechnicians();
      }
      
      res.json(technicians);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching technicians: " + error.message });
    }
  });

  app.get("/api/technicians/:id", async (req, res) => {
    try {
      const technician = await storage.getTechnician(req.params.id);
      if (!technician) {
        return res.status(404).json({ message: "Technician not found" });
      }
      res.json(technician);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching technician: " + error.message });
    }
  });

  // ===== BOOKINGS ROUTES =====
  app.get("/api/bookings", async (req, res) => {
    try {
      const userId = getTempUserId();
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching bookings: " + error.message });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching booking: " + error.message });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const userId = getTempUserId();
      const validated = insertBookingSchema.parse({
        ...req.body,
        userId,
      });
      const booking = await storage.createBooking(validated);
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating booking: " + error.message });
    }
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.updateBooking(req.params.id, req.body);
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ message: "Error updating booking: " + error.message });
    }
  });

  // ===== REVIEWS ROUTES =====
  app.get("/api/technicians/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getTechnicianReviews(req.params.id);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching reviews: " + error.message });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const userId = getTempUserId();
      const validated = insertReviewSchema.parse({
        ...req.body,
        userId,
      });
      const review = await storage.createReview(validated);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating review: " + error.message });
    }
  });

  // ===== STRIPE PAYMENT ROUTE =====
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await getStripe().paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // ===== STATS ROUTE (Dashboard) =====
  app.get("/api/stats", async (req, res) => {
    try {
      const userId = getTempUserId();
      
      const [appliances, diagnoses, bookings] = await Promise.all([
        storage.getUserAppliances(userId),
        storage.getUserDiagnoses(userId),
        storage.getUserBookings(userId),
      ]);

      const activeDiagnoses = diagnoses.filter(d => d.status === "open");
      const upcomingBookings = bookings.filter(b => 
        b.status !== "cancelled" && 
        b.status !== "completed" &&
        new Date(b.scheduledDate) > new Date()
      );

      res.json({
        totalDevices: appliances.length,
        activeDiagnoses: activeDiagnoses.length,
        upcomingBookings: upcomingBookings.length,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching stats: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
