import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TeamMember } from "../../types";
import { generateId } from "../../utils";

interface TeamMembersState {
  members: TeamMember[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamMembersState = {
  members: [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@construction.com",
      role: "Site Manager",
      department: "Operations",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@construction.com",
      role: "Equipment Operator",
      department: "Field Operations",
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "michael.chen@construction.com",
      role: "Safety Officer",
      department: "Safety",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@construction.com",
      role: "Project Coordinator",
      department: "Management",
    },
    {
      id: "5",
      name: "Robert Wilson",
      email: "robert.wilson@construction.com",
      role: "Electrician",
      department: "Electrical",
    },
  ],
  loading: false,
  error: null,
};

const teamMembersSlice = createSlice({
  name: "teamMembers",
  initialState,
  reducers: {
    addTeamMember: (state, action: PayloadAction<Omit<TeamMember, "id">>) => {
      const newMember: TeamMember = {
        ...action.payload,
        id: generateId(),
      };
      state.members.push(newMember);
    },
    updateTeamMember: (state, action: PayloadAction<TeamMember>) => {
      const index = state.members.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.members[index] = action.payload;
      }
    },
    deleteTeamMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter((m) => m.id !== action.payload);
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
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  setLoading,
  setError,
} = teamMembersSlice.actions;
export default teamMembersSlice.reducer;
