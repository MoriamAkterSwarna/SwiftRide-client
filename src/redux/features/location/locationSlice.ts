import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LocationTarget = "pickup" | "dropoff";

export interface LocationPoint {
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationState {
  pickup: LocationPoint | null;
  dropoff: LocationPoint | null;
  activeTarget: LocationTarget;
}

const initialState: LocationState = {
  pickup: null,
  dropoff: null,
  activeTarget: "pickup",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setPickup(state, action: PayloadAction<LocationPoint>) {
      state.pickup = action.payload;
    },
    setDropoff(state, action: PayloadAction<LocationPoint>) {
      state.dropoff = action.payload;
    },
    setActiveTarget(state, action: PayloadAction<LocationTarget>) {
      state.activeTarget = action.payload;
    },
    clearLocations(state) {
      state.pickup = null;
      state.dropoff = null;
      state.activeTarget = "pickup";
    },
  },
});

export const { setPickup, setDropoff, setActiveTarget, clearLocations } =
  locationSlice.actions;

export default locationSlice.reducer;
