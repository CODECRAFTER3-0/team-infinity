import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth, type Role, getDefaultRoute } from "@/context/AuthContext";

type ProtectedRouteProps = {
  children: JSX.Element;
  role?: Role;
  requireDoctorAccess?: boolean;
};

export function ProtectedRoute({ children, role, requireDoctorAccess = false }: ProtectedRouteProps) {
  const { session, doctorAccess, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center text-muted-foreground">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm font-medium">Restoring your session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (role && session.role !== role) {
    return <Navigate to={getDefaultRoute(session.role)} replace />;
  }

  if (requireDoctorAccess && session.role === "doctor" && !doctorAccess.granted) {
    return <Navigate to="/doctor/scan" replace />;
  }

  return children;
}
