import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, getAuthToken, setAuthToken, removeAuthToken } from "@/lib/api";

export type Role = "patient" | "doctor" | "admin";

type Session = {
  _id: string;
  name: string;
  role: Role;
  email: string;
};

type DoctorAccess = {
  granted: boolean;
  patientId: string | null;
};

type AuthContextValue = {
  session: Session | null;
  doctorAccess: DoctorAccess;
  loading: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  grantDoctorAccess: (patientId: string) => void;
  clearDoctorAccess: () => void;
};

const ACCESS_KEY = "smart-ehr-doctor-access";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readAccess(): DoctorAccess {
  if (typeof window === "undefined") {
    return { granted: false, patientId: null };
  }

  const raw = window.localStorage.getItem(ACCESS_KEY);
  return raw ? (JSON.parse(raw) as DoctorAccess) : { granted: false, patientId: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [doctorAccess, setDoctorAccess] = useState<DoctorAccess>(readAccess);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // on mount, if we have a token, fetch profile to restore session
    const restoreSession = async () => {
      if (!getAuthToken()) {
        setLoading(false);
        return;
      }

      try {
        const data: any = await apiFetch("/auth/profile");
        setSession({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role as Role
        });
      } catch (e) {
        removeAuthToken();
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ACCESS_KEY, JSON.stringify(doctorAccess));
  }, [doctorAccess]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      doctorAccess,
      loading,
      login: async (email, password, role) => {
        const data: any = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password, role })
        });
        setAuthToken(data.token);
        setSession({ _id: data._id, name: data.name, role: data.role as Role, email: data.email });
        setDoctorAccess({ granted: false, patientId: null });
      },
      register: async (payload) => {
        const data: any = await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setAuthToken(data.token);
        setSession({ _id: data._id, name: data.name, role: data.role as Role, email: data.email });
        setDoctorAccess({ granted: false, patientId: null });
      },
      logout: () => {
        removeAuthToken();
        setSession(null);
        setDoctorAccess({ granted: false, patientId: null });
      },
      grantDoctorAccess: (patientId) => setDoctorAccess({ granted: true, patientId }),
      clearDoctorAccess: () => setDoctorAccess({ granted: false, patientId: null }),
    }),
    [doctorAccess, session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export function getDefaultRoute(role: Role) {
  if (role === "patient") return "/patient/dashboard";
  if (role === "doctor") return "/doctor/dashboard";
  return "/admin/dashboard";
}
