import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Part } from "../../types";
import { generateId } from "../../utils";

interface PartsState {
  parts: Part[];
  loading: boolean;
  error: string | null;
}

const initialState: PartsState = {
  parts: [
    {
      id: "part-1",
      name: "Power Drill",
      type: "Tools",
      category: "Equipment",
      description: "Heavy-duty cordless power drill with battery pack",
      quantity: 15,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "part-2",
      name: "Safety Helmet",
      type: "Safety",
      category: "Equipment",
      description: "OSHA-compliant hard hat with adjustable suspension",
      quantity: 25,
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "part-3",
      name: "Measuring Tape",
      type: "Tools",
      category: "Tool",
      description: "25ft retractable measuring tape with metric and imperial",
      quantity: 20,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "part-4",
      name: "Safety Vest",
      type: "Safety",
      category: "Consumable",
      description: "High-visibility reflective safety vest",
      quantity: 30,
      createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "part-5",
      name: "Circular Saw",
      type: "Tools",
      category: "Equipment",
      description: "7-1/4 inch circular saw with laser guide",
      quantity: 8,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "part-6",
      name: "Extension Cord",
      type: "Electrical",
      category: "Material",
      description: "50ft heavy-duty outdoor extension cord",
      quantity: 12,
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "part-7",
      name: "Ladder",
      type: "Structural",
      category: "Equipment",
      description: "6ft aluminum step ladder with safety rail",
      quantity: 10,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "part-8",
      name: "Work Gloves",
      type: "Safety",
      category: "Consumable",
      description: "Cut-resistant work gloves, size L",
      quantity: 50,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  loading: false,
  error: null,
};

const partsSlice = createSlice({
  name: "parts",
  initialState,
  reducers: {
    addPart: (
      state,
      action: PayloadAction<Omit<Part, "id" | "createdAt" | "updatedAt">>
    ) => {
      const newPart: Part = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.parts.push(newPart);
    },
    updatePart: (state, action: PayloadAction<Part>) => {
      const index = state.parts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.parts[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deletePart: (state, action: PayloadAction<string>) => {
      state.parts = state.parts.filter((p) => p.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addPart, updatePart, deletePart, setLoading, setError } =
  partsSlice.actions;
export default partsSlice.reducer;
