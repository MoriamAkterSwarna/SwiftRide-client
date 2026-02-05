# SwiftRide Frontend - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd SwiftRide-Client
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure Overview

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── redux/             # State management
├── types/             # TypeScript types
├── utils/             # Utility functions
├── lib/               # Libraries and configs
└── routes/            # Route configuration
```

## 🔑 Key Features

### User Roles
1. **Rider**: Request and track rides
2. **Driver**: Accept rides and earn money
3. **Admin**: Manage users, drivers, and rides

### Main Pages
- **Public**: Home, About, Features, Contact, FAQ
- **Auth**: Login, Register, Verification
- **Rider Dashboard**: Request ride, History, Profile
- **Driver Dashboard**: Manage rides, Earnings, Profile
- **Admin Dashboard**: Analytics, User/Driver/Ride Management

## 📝 Development Guide

### Adding a New Page

1. Create component in `src/pages/<Role>/<PageName>.tsx`
2. Add to sidebar items in `src/routes/<roleName>SidebarItems.ts`
3. Component will auto-route via `generateRoutes` utility

### Adding API Endpoints

1. Add to appropriate API file in `src/redux/features/<feature>/<feature>.api.ts`
2. Export hook from the same file
3. Import and use in components: `const { data } = useYourQuery()`

### Form Validation

All forms use React Hook Form + Zod:

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchemas } from "@/utils/formValidation";

const form = useForm({
  resolver: zodResolver(formSchemas.login),
  defaultValues: { email: "", password: "" },
});
```

### Error Handling

Use the error handler utilities:

```tsx
import { getErrorMessage, isValidationError } from "@/utils/errorHandler";

try {
  await mutation().unwrap();
} catch (error) {
  if (isValidationError(error)) {
    // Handle validation errors
  } else {
    const message = getErrorMessage(error);
    toast.error(message);
  }
}
```

### Notifications

Use the notification service:

```tsx
import { notifySuccess, notifyError } from "@/utils/notificationService";

notifySuccess("Operation successful!");
notifyError("Something went wrong!");
```

## 🎨 Styling

- **Framework**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Responsive**: Mobile-first design

### Common Responsive Classes
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

## 🔐 Authentication Flow

1. User registers with email, password, and role
2. OTP sent to email
3. User verifies OTP
4. Login with credentials
5. JWT tokens stored in localStorage
6. Tokens included in all API requests
7. Protected routes check auth status

## 📊 State Management

### Redux Store Structure
```tsx
{
  auth: {
    user: IUserResponse | null,
    accessToken: string | null,
    isAuthenticated: boolean,
  },
  [baseApi.reducerPath]: { /* RTK Query cache */ },
}
```

### Using Redux
```tsx
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setUser } from "@/redux/features/auth/auth.slice";

const dispatch = useAppDispatch();
const user = useAppSelector((state) => state.auth.user);
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Register new account
- [ ] Login with credentials
- [ ] Verify OTP
- [ ] Update profile
- [ ] Change password
- [ ] Request ride (Rider)
- [ ] Accept ride (Driver)
- [ ] View analytics (Admin)
- [ ] Test responsive design
- [ ] Test error scenarios

## 📦 Building for Production

```bash
npm run build
# Output in dist/ folder
```

### Optimization Tips
1. Tree-shaking is enabled
2. Code splitting via React.lazy
3. Image optimization recommended
4. Monitor bundle size with `npm run build`

## 🐛 Troubleshooting

### Common Issues

**API Connection Error**
- Check VITE_API_BASE_URL is correct
- Verify backend server is running
- Check CORS configuration

**Login Failed**
- Verify credentials
- Check if email is verified
- Clear localStorage and try again

**Styling Issues**
- Clear browser cache
- Rebuild with `npm run build`
- Check Tailwind config

**Build Errors**
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Clear Vite cache: `npm run clean`

## 📚 Resources

- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Zod Validation](https://zod.dev)

## 🔗 Related Projects

- **Backend**: SwiftRide-backend
- **API Documentation**: `/docs` (when backend is running)

## 💡 Tips & Tricks

1. **Redux DevTools**: Install Redux DevTools browser extension
2. **Network Tab**: Monitor API calls in browser DevTools
3. **Component Inspection**: Use React DevTools extension
4. **Error Debugging**: Check browser console for detailed errors
5. **Type Safety**: TypeScript will catch many errors at compile time

## 🚢 Deployment

### Netlify/Vercel
```bash
# Automatic deployment on push to main
# Configure build command: npm run build
# Configure output directory: dist
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📞 Support

- Check console for error messages
- Review Redux DevTools for state issues
- Monitor Network tab for API problems
- Check implementation documentation

## 🎯 Next Features to Implement

- [ ] Real-time location tracking with WebSockets
- [ ] Video call integration for drivers
- [ ] AI-based fare prediction
- [ ] Insurance and protection plans
- [ ] Multi-language support
- [ ] Accessibility enhancements

---

**Last Updated**: February 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
