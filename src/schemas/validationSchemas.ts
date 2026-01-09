import { z } from "zod";

export const partSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Part name must be at least 2 characters" })
    .max(100, { message: "Part name must not exceed 100 characters" })
    .trim(),
  type: z.string().min(1, { message: "Please select a part type" }),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z
    .string()
    .max(500, { message: "Description must not exceed 500 characters" })
    .optional()
    .or(z.literal("")),
  quantity: z
    .number()
    .int({ message: "Quantity must be a whole number" })
    .min(0, { message: "Quantity cannot be negative" })
    .max(10000, { message: "Quantity cannot exceed 10,000" }),
});

export const assetSchema = z.object({
  partId: z.string().min(1, { message: "Please select a part" }),
  serialNumber: z
    .string()
    .min(3, { message: "Serial number must be at least 3 characters" })
    .max(50, { message: "Serial number must not exceed 50 characters" })
    .regex(/^[A-Z0-9-]+$/i, {
      message: "Serial number can only contain letters, numbers, and hyphens",
    })
    .trim(),
  status: z.string().min(1, { message: "Please select a status" }),
  notes: z
    .string()
    .max(500, { message: "Notes must not exceed 500 characters" })
    .optional()
    .or(z.literal("")),
});

export const utilizationSchema = z.object({
  assetId: z.string().min(1, "Please select an asset"),
  teamMemberId: z.string().min(1, "Please select a team member"),
  notes: z
    .string()
    .max(500, "Notes must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export type PartFormData = z.infer<typeof partSchema>;
export type AssetFormData = z.infer<typeof assetSchema>;
export type UtilizationFormData = z.infer<typeof utilizationSchema>;
