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

export interface IRideType {
  _id: string;
  name: string;
  description?: string;
  image?: string;
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
