# SwiftRide API Integration Documentation

## 🔗 API Base URL

```
Development: http://localhost:5000/api/v1
Production: https://api.swiftride.com/api/v1
```

Configure in `.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 📡 API Integration Setup

### Axios Instance
**Location**: `src/lib/axios.ts`

```typescript
import { axiosInstance } from '@/lib/axios';

// Automatically includes:
// - baseURL
// - withCredentials: true (for cookies)
// - Request interceptors
// - Response interceptors
```

### RTK Query Base API
**Location**: `src/redux/baseApi.ts`

```typescript
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["USER", "RIDE", "DIVISION", "DISTRICT", "RIDE_TYPE"],
  endpoints: () => ({}),
});
```

---

## 🔐 Authentication Endpoints

### Register
```
POST /user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "role": "rider" | "driver" | "admin"
}

Response 200:
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "id": "user_id",
    "email": "john@example.com",
    "role": "rider"
  }
}
```

**Implementation**: `src/pages/Register.tsx`

---

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "john@example.com",
      "role": "rider",
      "name": "John Doe"
    },
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

**Implementation**: `src/pages/Login.tsx`
**Hook**: `useLoginMutation()`

---

### Logout
```
POST /auth/logout
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "User logged out successfully"
}
```

**Hook**: `useLogoutMutation()`

---

### Send OTP
```
POST /otp/send
Content-Type: application/json

{
  "email": "john@example.com"
}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "OTP sent successfully"
}
```

**Hook**: `useSendOtpMutation()`

---

### Verify OTP
```
POST /otp/verify
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "OTP verified successfully"
}
```

**Hook**: `useVerifyOtpMutation()`

---

### Get User Info
```
GET /user/me
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "rider",
    "avatar": "url_to_avatar",
    "isActive": true,
    "isBlocked": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Hook**: `useUserInfoQuery()`

---

## 🚗 Ride Management Endpoints

### Create Ride Request
```
POST /ride/request
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "pickupLocation": "123 Main St, Downtown",
  "destinationLocation": "456 Oak Ave, Airport",
  "rideType": "economy" | "comfort" | "premium",
  "paymentMethod": "card" | "cash" | "wallet" | "mobile",
  "scheduledTime": "2024-02-10T14:30:00Z" (optional)
}

Response 201:
{
  "success": true,
  "statusCode": 201,
  "message": "Ride request created successfully",
  "data": {
    "id": "ride_id",
    "riderId": "user_id",
    "pickupLocation": "123 Main St, Downtown",
    "destinationLocation": "456 Oak Ave, Airport",
    "estimatedFare": 45.50,
    "rideType": "economy",
    "status": "pending",
    "createdAt": "2024-02-10T10:30:00Z"
  }
}
```

**Implementation**: `src/pages/Rider/RequestRide.tsx`
**Hook**: `useCreateRideRequestMutation()`

---

### Get Fare Estimate
```
GET /ride/estimate?pickup=123%20Main%20St&destination=456%20Oak%20Ave
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Estimate retrieved successfully",
  "data": {
    "baseFare": 5.00,
    "distanceFare": 15.50,
    "timeFare": 8.00,
    "totalFare": 28.50,
    "estimatedDuration": "25 minutes",
    "estimatedDistance": "8.5 km"
  }
}
```

**Hook**: `useGetRideEstimateQuery()`

---

### Get Ride History
```
GET /ride/history?page=1&limit=10&status=completed&startDate=2024-01-01&endDate=2024-02-10
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Ride history retrieved successfully",
  "data": {
    "rides": [
      {
        "id": "ride_id",
        "pickupLocation": "123 Main St",
        "destinationLocation": "456 Oak Ave",
        "fare": 45.50,
        "duration": 35,
        "status": "completed",
        "driverId": "driver_id",
        "driver": {
          "id": "driver_id",
          "name": "Ahmed Hassan",
          "rating": 4.8,
          "avatar": "url",
          "vehicleNumber": "ABC-1234"
        },
        "rating": 5,
        "review": "Great driver!",
        "createdAt": "2024-02-05T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 3,
      "totalRides": 25
    }
  }
}
```

**Implementation**: `src/pages/Rider/RideHistory.tsx`
**Hook**: `useGetRideHistoryQuery()`

---

### Get Ride Details
```
GET /ride/{rideId}
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Ride details retrieved successfully",
  "data": {
    "id": "ride_id",
    "riderId": "user_id",
    "driverId": "driver_id",
    "pickupLocation": "123 Main St, Downtown",
    "destinationLocation": "456 Oak Ave, Airport",
    "pickupCoordinates": { "lat": 40.7128, "lng": -74.0060 },
    "destinationCoordinates": { "lat": 40.7758, "lng": -73.8855 },
    "rideType": "economy",
    "fare": 45.50,
    "duration": 35,
    "distance": 12.5,
    "status": "completed",
    "paymentMethod": "card",
    "paymentStatus": "completed",
    "startTime": "2024-02-05T10:30:00Z",
    "endTime": "2024-02-05T11:05:00Z",
    "driver": { /* driver details */ },
    "rider": { /* rider details */ },
    "route": [ /* route coordinates */ ],
    "rating": 5,
    "review": "Great driver!"
  }
}
```

---

### Cancel Ride
```
PATCH /ride/{rideId}/cancel
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "reason": "Changed my mind" (optional)
}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Ride cancelled successfully",
  "data": {
    "id": "ride_id",
    "status": "cancelled",
    "refund": 45.50
  }
}
```

---

## 👨‍💼 Driver Endpoints

### Get Incoming Requests
```
GET /driver/incoming-requests
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Incoming requests retrieved successfully",
  "data": {
    "requests": [
      {
        "id": "ride_id",
        "riderId": "rider_id",
        "rider": {
          "name": "Jane Doe",
          "rating": 4.7,
          "avatar": "url"
        },
        "pickupLocation": "123 Main St",
        "destinationLocation": "456 Oak Ave",
        "estimatedFare": 45.50,
        "distance": 12.5,
        "rideType": "economy",
        "createdAt": "2024-02-10T10:30:00Z"
      }
    ],
    "count": 3
  }
}
```

**Hook**: `useGetIncomingRequestsQuery()`

---

### Accept Ride Request
```
PATCH /ride/{rideId}/accept
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Ride accepted successfully",
  "data": {
    "id": "ride_id",
    "status": "accepted",
    "driverId": "driver_id",
    "estimatedArrival": "2024-02-10T10:45:00Z"
  }
}
```

**Hook**: `useAcceptRideRequestMutation()`

---

### Reject Ride Request
```
PATCH /ride/{rideId}/reject
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Ride rejected successfully"
}
```

**Hook**: `useRejectRideRequestMutation()`

---

### Update Ride Status
```
PATCH /ride/{rideId}/status
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "picked_up" | "in_transit" | "completed" | "cancelled"
}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Ride status updated successfully",
  "data": {
    "id": "ride_id",
    "status": "in_transit",
    "updatedAt": "2024-02-10T10:45:00Z"
  }
}
```

**Hook**: `useUpdateRideStatusMutation()`

---

### Get Driver Ride History
```
GET /driver/rides?page=1&limit=10&status=completed
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Driver rides retrieved successfully",
  "data": {
    "rides": [ /* ride objects */ ],
    "pagination": { /* pagination info */ }
  }
}
```

**Hook**: `useGetDriverRideHistoryQuery()`

---

### Get Earnings Data
```
GET /driver/earnings?period=daily|weekly|monthly
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Earnings retrieved successfully",
  "data": {
    "totalEarnings": 1450,
    "ridesCompleted": 45,
    "avgPerRide": 32.22,
    "activeHours": 36,
    "chartData": [
      { "name": "Mon", "earnings": 120 },
      { "name": "Tue", "earnings": 150 }
    ]
  }
}
```

**Implementation**: `src/pages/Rider/EarningsDashboard.tsx`
**Hook**: `useGetEarningsDataQuery()`

---

### Update Driver Status
```
PATCH /driver/status
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "online" | "offline"
}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Driver status updated successfully",
  "data": {
    "driverId": "driver_id",
    "status": "online"
  }
}
```

**Hook**: `useUpdateDriverStatusMutation()`

---

## 👤 User Management Endpoints

### Update User Profile
```
PATCH /user/me
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+1234567890",
  "avatar": "image_url"
}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": { /* updated user object */ }
}
```

**Hook**: `useUpdateUserProfileMutation()`

---

### Change Password
```
PATCH /user/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Password changed successfully"
}
```

**Hook**: `useChangePasswordMutation()`

---

### Save Emergency Contact
```
POST /user/emergency-contacts
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Mom",
  "phone": "+1234567890",
  "relationship": "Mother"
}

Response 201:
{
  "success": true,
  "statusCode": 201,
  "message": "Emergency contact saved successfully",
  "data": {
    "id": "contact_id",
    "name": "Mom",
    "phone": "+1234567890",
    "relationship": "Mother"
  }
}
```

**Hook**: `useSaveEmergencyContactMutation()`

---

## 👨‍💼 Admin Endpoints

### Get All Rides
```
GET /admin/rides?page=1&limit=10&status=completed&driverId=driver_id&riderId=rider_id&startDate=2024-01-01&endDate=2024-02-10
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "All rides retrieved successfully",
  "data": {
    "rides": [ /* ride objects */ ],
    "pagination": { /* pagination info */ }
  }
}
```

**Hook**: `useGetAllRidesQuery()`

---

### Get Ride Analytics
```
GET /admin/analytics/rides
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Analytics retrieved successfully",
  "data": {
    "totalUsers": 12450,
    "totalDrivers": 3280,
    "totalRevenue": 125480,
    "ridesThisMonth": 2850,
    "chartData": [
      { "month": "Jan", "rides": 400, "revenue": 2400 }
    ]
  }
}
```

**Implementation**: `src/pages/Admin/Analytics.tsx`
**Hook**: `useGetRideAnalyticsQuery()`

---

### Get All Users
```
GET /admin/users?page=1&limit=10&search=john&role=rider&status=active
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "rider",
        "isActive": true,
        "isBlocked": false,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": { /* pagination info */ }
  }
}
```

**Hook**: `useGetAllUsersQuery()`

---

### Block User
```
PATCH /admin/users/{userId}/block
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "User blocked successfully",
  "data": {
    "id": "user_id",
    "isBlocked": true
  }
}
```

**Hook**: `useBlockUserMutation()`

---

### Approve Driver
```
PATCH /admin/drivers/{driverId}/approve
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Driver approved successfully",
  "data": {
    "id": "driver_id",
    "status": "approved"
  }
}
```

**Hook**: `useApproveDriveMutation()`

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": { /* actual data */ }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## 🔒 Authentication Headers

All protected endpoints require:
```
Authorization: Bearer {accessToken}
```

Token is automatically added by Axios interceptor.

---

## ⚙️ Error Handling

Errors are handled globally via:
- Axios interceptors in `src/lib/axios.ts`
- Toast notifications in components
- `handleApiError()` utility in `src/utils/validation.ts`

---

## 📝 Testing Endpoints

### Using cURL
```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123!"}'

# Get user info
curl -X GET http://localhost:5000/api/v1/user/me \
  -H "Authorization: Bearer {token}"
```

---

## 🚀 Deployment Considerations

1. Update API base URL in `.env` for production
2. Ensure CORS is properly configured on backend
3. Use HTTPS in production
4. Set `withCredentials: true` for cookie-based auth
5. Implement token refresh logic if using short-lived tokens

---

**Last Updated**: February 2026
**API Version**: v1
**Status**: Ready for Integration
