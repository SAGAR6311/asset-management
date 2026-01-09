import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Utilization } from "../../types";
import { generateId } from "../../utils";

interface UtilizationState {
  utilizations: Utilization[];
  loading: boolean;
  error: string | null;
}

const initialState: UtilizationState = {
  utilizations: [
    {
      id: "util-1",
      assetId: "asset-1",
      teamMemberId: "1",
      assignedDate: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      notes: "Assigned for Site A construction work",
    },
    {
      id: "util-2",
      assetId: "asset-2",
      teamMemberId: "2",
      assignedDate: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      notes: "Electrical installation project",
    },
    {
      id: "util-3",
      assetId: "asset-4",
      teamMemberId: "1",
      assignedDate: new Date(
        Date.now() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      notes: "Standard safety equipment",
    },
    {
      id: "util-4",
      assetId: "asset-5",
      teamMemberId: "3",
      assignedDate: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      notes: "Safety officer daily equipment",
    },
    {
      id: "util-5",
      assetId: "asset-7",
      teamMemberId: "2",
      assignedDate: new Date(
        Date.now() - 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      notes: "Precision measurement tasks",
    },
    {
      id: "util-6",
      assetId: "asset-9",
      teamMemberId: "4",
      assignedDate: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      notes: "Wood cutting operations",
    },
    {
      id: "util-7",
      assetId: "asset-12",
      teamMemberId: "5",
      assignedDate: new Date(
        Date.now() - 6 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active",
      notes: "Ceiling installation work",
    },
    {
      id: "util-8",
      assetId: "asset-1",
      teamMemberId: "4",
      assignedDate: new Date(
        Date.now() - 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      returnedDate: new Date(
        Date.now() - 6 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "completed",
      notes: "Completed foundation drilling",
    },
    {
      id: "util-9",
      assetId: "asset-3",
      teamMemberId: "3",
      assignedDate: new Date(
        Date.now() - 12 * 24 * 60 * 60 * 1000
      ).toISOString(),
      returnedDate: new Date(
        Date.now() - 8 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "completed",
      notes: "Completed framing work",
    },
  ],
  loading: false,
  error: null,
};

const utilizationSlice = createSlice({
  name: "utilization",
  initialState,
  reducers: {
    addUtilization: (state, action: PayloadAction<Omit<Utilization, "id">>) => {
      const newUtilization: Utilization = {
        ...action.payload,
        id: generateId(),
      };
      state.utilizations.push(newUtilization);
    },
    updateUtilization: (state, action: PayloadAction<Utilization>) => {
      const index = state.utilizations.findIndex(
        (u) => u.id === action.payload.id
      );
      if (index !== -1) {
        state.utilizations[index] = action.payload;
      }
    },
    completeUtilization: (state, action: PayloadAction<string>) => {
      const utilization = state.utilizations.find(
        (u) => u.id === action.payload
      );
      if (utilization) {
        utilization.status = "completed";
        utilization.returnedDate = new Date().toISOString();
      }
    },
    deleteUtilization: (state, action: PayloadAction<string>) => {
      state.utilizations = state.utilizations.filter(
        (u) => u.id !== action.payload
      );
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
  addUtilization,
  updateUtilization,
  completeUtilization,
  deleteUtilization,
  setLoading,
  setError,
} = utilizationSlice.actions;
export default utilizationSlice.reducer;
