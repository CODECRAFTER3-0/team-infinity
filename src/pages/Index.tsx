import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "@/lib/auth";

export default function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    const s = getSession();
    if (!s) navigate("/login");
    else navigate(s.role === "doctor" ? "/doctor" : "/patient");
  }, [navigate]);
  return null;
}
