// export interface IDivision {
//   _id: string;
//   name: string;
//   slug: string;
//   description?: string;
//   thumbnail?: string;
//   isDeleted: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface IDistrict {
//   _id: string;
//   name: string;
//   division: string | IDivision;
//   isDeleted: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export enum RideVehicle {
//   BIKE = "Bike",
//   CAR = "Car",
//   VAN = "Van",
//   BUS = "Bus"
// }

// export enum PlaceType {
//   PRIVATE_PLACE = "Private Place",
//   PUBLIC_PLACE = "Public Place",
//   INSIDE_CITY = "Inside City",
//   OUTSIDE_CITY = "Outside City",
//   AIRPORT = "Airport"
// }

// export interface IRideType {
//   _id: string;
//   name: string;
//   description?: string;
//   image?: string;
//   rideVehicle: RideVehicle;
//   placeType: PlaceType;
//   totalGuest: number;
//   isDeleted: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface IRide {
//   _id: string;
//   user: string;
//   rideType: string | IRideType;
//   from: string | IDistrict;
//   to: string | IDistrict;
//   departureTime: string;
//   availableSeats: number;
//   price: number;
//   status: "PENDING" | "ONGOING" | "COMPLETED" | "CANCELLED";
//   isDeleted: boolean;
//   createdAt: string;
//   updatedAt: string;
// }
