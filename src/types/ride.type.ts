export interface IDivision {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IDistrict {
  _id: string;
  name: string;
  division: string | IDivision;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const RideVehicle = {
  BIKE: "Bike",
  CAR: "Car",
  VAN: "Van",
  BUS: "Bus",
} as const;

export type RideVehicle = (typeof RideVehicle)[keyof typeof RideVehicle];

export const PlaceType = {
  PRIVATE_PLACE: "Private Place",
  PUBLIC_PLACE: "Public Place",
  INSIDE_CITY: "Inside City",
  OUTSIDE_CITY: "Outside City",
  AIRPORT: "Airport",
} as const;

export type PlaceType = (typeof PlaceType)[keyof typeof PlaceType];

export interface IRideType {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  rideVehicle: RideVehicle;
  placeType: PlaceType;
  totalGuest: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IRide {
  _id: string;
  user: string;
  rideType: string | IRideType;
  from: string | IDistrict;
  to: string | IDistrict;
  departureTime: string;
  availableSeats: number;
  price: number;
  status: "PENDING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
export const RideRequestStatus = {
  REQUESTED: "requested",
  ACCEPTED: "accepted",
  PICKED_UP: "picked_up",
  IN_TRANSIT: "in_transit",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type RideRequestStatus = (typeof RideRequestStatus)[keyof typeof RideRequestStatus];

export interface IRideRequest {
  _id?: string;
  rider: string;
  driver?: string;
  pickupLocation: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  dropoffLocation: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  status: RideRequestStatus;
  vehicleType: "Car" | "Bike";
  fare: number;
  requestedAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelledBy?: "rider" | "driver" | "admin";
  cancellationReason?: string;
}