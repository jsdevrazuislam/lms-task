import { z } from "zod";

export const adminCreationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const platformSettingsSchema = z.object({
  commissionPercentage: z.number().min(0).max(100),
  contactEmail: z.string().email(),
  supportEmail: z.string().email(),
  globalBannerText: z.string().optional(),
  isMaintenanceMode: z.boolean(),
});

export type AdminCreationValues = z.infer<typeof adminCreationSchema>;
export type PlatformSettingsValues = z.infer<typeof platformSettingsSchema>;
