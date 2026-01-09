import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Asset } from "../../types";
import { generateId } from "../../utils";

interface AssetsState {
  assets: Asset[];
  loading: boolean;
  error: string | null;
}

const initialState: AssetsState = {
  assets: [
    {
      id: "asset-1",
      partId: "part-1",
      serialNumber: "PD-001",
      status: "assigned",
      assignedTo: "tm-1",
      assignedDate: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      notes: "Assigned for Site A construction",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "asset-2",
      partId: "part-1",
      serialNumber: "PD-002",
      status: "assigned",
      assignedTo: "tm-2",
      assignedDate: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      notes: "Assigned for electrical work",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "asset-3",
      partId: "part-1",
      serialNumber: "PD-003",
      status: "available",
      notes: "",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "asset-4",
      partId: "part-2",
      serialNumber: "SH-001",
      status: "assigned",
      assignedTo: "tm-1",
      assignedDate: new Date(
        Date.now() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      notes: "Standard issue for site manager",
      createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "asset-5",
      partId: "part-2",
      serialNumber: "SH-002",
      status: "assigned",
      assignedTo: "tm-3",
      assignedDate: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      notes: "Safety officer equipment",
      createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "asset-6",
      partId: "part-2",
      serialNumber: "SH-003",
      status: "available",
      notes: "",
      createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "asset-7",
      partId: "part-3",
      serialNumber: "MT-001",
      status: "assigned",
      assignedTo: "tm-2",
      assignedDate: new Date(
        Date.now() - 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
      notes: "For precision measurements",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "asset-8",
      partId: "part-3",
      serialNumber: "MT-002",
      status: "available",
      notes: "",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "asset-9",
      partId: "part-5",
      serialNumber: "CS-001",
      status: "assigned",
      assignedTo: "tm-4",
      assignedDate: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      notes: "For cutting operations",
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "asset-10",
      partId: "part-5",
      serialNumber: "CS-002",
      status: "maintenance",
      notes: "Blade replacement needed",
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "asset-11",
      partId: "part-6",
      serialNumber: "EC-001",
      status: "available",
      notes: "",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "asset-12",
      partId: "part-7",
      serialNumber: "LD-001",
      status: "assigned",
      assignedTo: "tm-5",
      assignedDate: new Date(
        Date.now() - 6 * 24 * 60 * 60 * 1000
      ).toISOString(),
      notes: "For high-level work",
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  loading: false,
  error: null,
};

const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    addAsset: (
      state,
      action: PayloadAction<Omit<Asset, "id" | "createdAt" | "updatedAt">>
    ) => {
      const newAsset: Asset = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.assets.push(newAsset);
    },
    updateAsset: (state, action: PayloadAction<Asset>) => {
      const index = state.assets.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.assets[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteAsset: (state, action: PayloadAction<string>) => {
      state.assets = state.assets.filter((a) => a.id !== action.payload);
    },
    assignAsset: (
      state,
      action: PayloadAction<{ assetId: string; teamMemberId: string }>
    ) => {
      const asset = state.assets.find((a) => a.id === action.payload.assetId);
      if (asset) {
        asset.status = "assigned";
        asset.assignedTo = action.payload.teamMemberId;
        asset.assignedDate = new Date().toISOString();
        asset.updatedAt = new Date().toISOString();
      }
    },
    unassignAsset: (state, action: PayloadAction<string>) => {
      const asset = state.assets.find((a) => a.id === action.payload);
      if (asset) {
        asset.status = "available";
        asset.assignedTo = undefined;
        asset.assignedDate = undefined;
        asset.updatedAt = new Date().toISOString();
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addAsset,
  updateAsset,
  deleteAsset,
  assignAsset,
  unassignAsset,
  setLoading,
  setError,
} = assetsSlice.actions;
export default assetsSlice.reducer;
