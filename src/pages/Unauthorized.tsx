import { Link, useLocation } from "react-router";
import { AlertCircle, Lock, Shield, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Unauthorized() {
  const location = useLocation();
  const state = location.state as { status?: string; reason?: string } | null;
  const status = state?.status || "blocked";
  const reason = state?.reason || "Your account has been restricted";

  const isBlocked = status === "blocked";
  const isSuspended = status === "suspended";
  const isOffline = status === "offline";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            {isBlocked && <Lock className="h-16 w-16 text-red-600" />}
            {isSuspended && <AlertCircle className="h-16 w-16 text-orange-600" />}
            {isOffline && <Shield className="h-16 w-16 text-yellow-600" />}
          </div>

          <div className="text-center space-y-2">
            <CardTitle className="text-2xl">
              {isBlocked && "Account Blocked"}
              {isSuspended && "Account Suspended"}
              {isOffline && "Currently Offline"}
            </CardTitle>
            <CardDescription className="text-base">
              {reason}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Information */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            {isBlocked && (
              <>
                <p className="text-sm font-semibold text-gray-900">
                  Your account has been blocked
                </p>
                <p className="text-sm text-gray-600">
                  This may be due to violations of our terms of service. Your access
                  to the platform has been restricted.
                </p>
              </>
            )}

            {isSuspended && (
              <>
                <p className="text-sm font-semibold text-gray-900">
                  Your account is temporarily suspended
                </p>
                <p className="text-sm text-gray-600">
                  Your account has been suspended for a period. Please contact our
                  support team for more information.
                </p>
              </>
            )}

            {isOffline && (
              <>
                <p className="text-sm font-semibold text-gray-900">
                  You are currently offline
                </p>
                <p className="text-sm text-gray-600">
                  You need to go online to accept ride requests. Update your status
                  in your account settings.
                </p>
              </>
            )}
          </div>

          {/* Contact Information */}
          {(isBlocked || isSuspended) && (
            <div className="space-y-3 border-t pt-4">
              <p className="text-sm font-semibold text-gray-900">
                Need Help? Contact Us
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    support@swiftride.com
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    +1 (555) 123-4567
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Go to Home
              </Button>
            </Link>

            {isOffline && (
              <Link to="/rider/profile" className="flex-1">
                <Button className="w-full">Update Status</Button>
              </Link>
            )}
          </div>

          {/* Appeal Option */}
          {(isBlocked || isSuspended) && (
            <Button variant="ghost" className="w-full">
              Appeal This Decision
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
