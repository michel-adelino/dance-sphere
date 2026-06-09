import { z } from "zod";

export const eventTypes = [
  "salsa",
  "bachata",
  "hip-hop",
  "contemporary",
  "ballroom",
  "tango",
  "swing",
  "kizomba",
  "other",
] as const;

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  eventType: z.enum(eventTypes),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  status: z.enum(["draft", "published", "cancelled"]).default("draft"),
});

export type EventInput = z.infer<typeof eventSchema>;
