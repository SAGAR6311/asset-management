export type PartType =
  | "Electrical"
  | "Mechanical"
  | "Plumbing"
  | "HVAC"
  | "Structural"
  | "Safety"
  | "Tools"
  | "Hardware";
export type PartCategory =
  | "Consumable"
  | "Reusable"
  | "Equipment"
  | "Tool"
  | "Material"
  | "Component";
export type AssetStatus = "available" | "assigned" | "maintenance";

export interface Part {
  id: string;
  name: string;
  type: PartType;
  category: PartCategory;
  description?: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  partId: string;
  serialNumber: string;
  status: AssetStatus;
  assignedTo?: string;
  assignedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

export interface Utilization {
  id: string;
  assetId: string;
  teamMemberId: string;
  assignedDate: string;
  returnedDate?: string;
  status: "active" | "completed";
  notes?: string;
}

export interface UsageStatistics {
  totalParts: number;
  totalAssets: number;
  assignedAssets: number;
  availableAssets: number;
  maintenanceAssets: number;
  utilizationRate: number;
}

export interface DashboardData {
  statistics: UsageStatistics;
  frequentlyUsedParts: Array<{
    partId: string;
    partName: string;
    usageCount: number;
  }>;
  recentUtilizations: Utilization[];
}
