# SwiftRide Frontend - Quick Reference Guide

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build production
npm run build
```

## 📍 Key File Locations

### Pages
- **Landing Pages**: `src/pages/` → Home.tsx, About.tsx, Features.tsx, Contact.tsx, FAQ.tsx
- **Auth**: `src/pages/` → Login.tsx, Register.tsx, Verify.tsx
- **User**: `src/pages/User/Profile.tsx`
- **Rider**: `src/pages/Rider/` → RequestRide.tsx, RideHistory.tsx, EarningsDashboard.tsx
- **Admin**: `src/pages/Admin/Analytics.tsx`

### Components
- **SOS Button**: `src/components/SOSButton.tsx`
- **Navbar**: `src/components/layout/Navbar.tsx`
- **Footer**: `src/components/layout/Footer.tsx`

### Redux/API
- **Auth API**: `src/redux/features/auth/auth.api.ts`
- **Ride API**: `src/redux/features/ride/ride.api.ts`
- **User API**: `src/redux/features/user/user.api.ts`

### Routing
- **Main Routes**: `src/routes/index.tsx`
- **Rider Nav**: `src/routes/riderSidebarItems.ts`
- **Admin Nav**: `src/routes/adminSidebarItems.ts`

### Utils
- **Validation**: `src/utils/validation.ts`
- **Auth HOC**: `src/utils/withAuth.tsx`

---

## 🎯 URL Routes

### Public Pages
| Page | URL | File |
|------|-----|------|
| Home | `/` | `Home.tsx` |
| About | `/about` | `About.tsx` |
| Features | `/features` | `Features.tsx` |
| Contact | `/contact` | `Contact.tsx` |
| FAQ | `/faq` | `FAQ.tsx` |
| Login | `/login` | `Login.tsx` |
| Register | `/register` | `Register.tsx` |

### Rider Dashboard
| Page | URL | File |
|------|-----|------|
| Request Ride | `/rider/request-ride` | `RequestRide.tsx` |
| Ride History | `/rider/ride-history` | `RideHistory.tsx` |
| Earnings | `/rider/earnings` | `EarningsDashboard.tsx` |
| Profile | `/rider/profile` | `Profile.tsx` |

### Admin Dashboard
| Page | URL | File |
|------|-----|------|
| Analytics | `/admin/analytics` | `Analytics.tsx` |

---

## 📦 Redux API Hooks

### Authentication
```typescript
import { useLoginMutation, useRegisterMutation, useLogoutMutation, useUserInfoQuery } from '@/redux/features/auth/auth.api';

// Login
const [login, { isLoading }] = useLoginMutation();

// Get user info
const { data: user } = useUserInfoQuery();

// Logout
const [logout] = useLogoutMutation();
```

### Rides
```typescript
import { 
  useCreateRideRequestMutation, 
  useGetRideHistoryQuery, 
  useGetRideEstimateQuery 
} from '@/redux/features/ride/ride.api';

// Create ride
const [createRide] = useCreateRideRequestMutation();

// Get ride history
const { data: rides } = useGetRideHistoryQuery({ page: 1, limit: 10 });

// Get fare estimate
const { data: estimate } = useGetRideEstimateQuery({ pickup, destination });
```

### Users
```typescript
import { 
  useGetUserProfileQuery, 
  useUpdateUserProfileMutation,
  useChangePasswordMutation 
} from '@/redux/features/user/user.api';

// Get profile
const { data: profile } = useGetUserProfileQuery();

// Update profile
const [updateProfile] = useUpdateUserProfileMutation();

// Change password
const [changePassword] = useChangePasswordMutation();
```

---

## 🎨 Component Usage Examples

### SOS Button
```tsx
import SOSButton from '@/components/SOSButton';

<SOSButton visible={isActiveRide} onActivate={handleSOS} rideId={rideId} />
```

### Toast Notifications
```typescript
import toast from 'react-hot-toast';

toast.success('Success message');
toast.error('Error message');
toast.loading('Loading...');
```

### Form Validation
```typescript
import { fieldValidators, validatePassword } from '@/utils/validation';

// Single field
const emailError = fieldValidators.email(email);

// Password strength
const { isValid, errors } = validatePassword(password);
```

---

## 🔧 Environment Setup

### .env file
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Axios Instance
```typescript
import { axiosInstance } from '@/lib/axios';

// Pre-configured with:
// - baseURL
// - withCredentials: true
// - Request/Response interceptors
```

---

## 📱 Responsive Classes

```tailwind
/* Mobile First Approach */
sm: 640px    /* Mobile */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large Desktop */
2xl: 1536px  /* Extra Large */

/* Usage */
<div className="text-sm md:text-base lg:text-lg">
```

---

## 🎯 Common Patterns

### Async Form Submission
```tsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    await mutation(data).unwrap();
    toast.success('Success!');
  } catch (error) {
    toast.error('Error occurred');
  } finally {
    setIsLoading(false);
  }
};
```

### Protected Route
```tsx
import { withAuth } from '@/utils/withAuth';

export default withAuth(MyComponent, ['rider', 'admin']);
```

### API Query with Filters
```tsx
const { data } = useGetRideHistoryQuery({
  page: 1,
  limit: 10,
  status: 'completed',
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
```

---

## ✅ Testing Checklist Before Deploy

- [ ] All routes working
- [ ] Login/Logout functioning
- [ ] Profile update working
- [ ] Ride request form validates
- [ ] Ride history loads
- [ ] Admin analytics displays
- [ ] Responsive on mobile
- [ ] Toast notifications appear
- [ ] Error messages display
- [ ] SOS button appears on ride pages
- [ ] Navigation bar shows correct links
- [ ] Form validations working
- [ ] API calls using correct endpoints

---

## 🐛 Common Issues & Solutions

### API Not Connecting
**Solution**: Check `VITE_API_BASE_URL` in .env matches backend URL

### Styles Not Loading
**Solution**: Ensure Tailwind CSS is imported in `main.tsx`

### Routes Not Working
**Solution**: Verify routes in `src/routes/index.tsx`

### Auth Token Not Persisting
**Solution**: Check browser cookies and localStorage settings

---

## 📚 Documentation Files

1. **COMPLETE_SUMMARY.md** - Full feature documentation
2. **IMPLEMENTATION_GUIDE.md** - Technical implementation details
3. **README.md** - Project overview (main)

---

## 🚀 Deployment Checklist

```
Pre-Deployment
✅ Environment variables configured
✅ API endpoints updated
✅ Build successful (npm run build)
✅ No console errors
✅ Mobile responsive tested
✅ All forms validated
✅ Images optimized

Deployment
✅ Set correct API base URL
✅ Enable HTTPS
✅ Configure CORS
✅ Set up CDN for assets
✅ Enable caching headers
✅ Monitor error logs
```

---

## 🆘 Support

For questions about specific features:

1. **Pages**: Check `src/pages/` directory
2. **Components**: Check `src/components/` directory
3. **API**: Check `src/redux/features/*/api.ts`
4. **Types**: Check `src/types/`
5. **Utils**: Check `src/utils/`

---

**Last Updated**: February 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready
