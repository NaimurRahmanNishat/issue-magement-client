// src/routes/protectedRoute.tsx

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
import type { Role } from "@/types/authType";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { silentRefresh } from "@/redux/features/auth/authThunks";

type Props = {
  children: React.ReactNode;
  role?: Role | Role[];
};

const REFRESH_INTERVAL = 9 * 60 * 1000; // 9 minutes

const ProtectedRoute = ({ children, role }: Props) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  // browser-safe timer refs
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    // first refresh AFTER 9 minutes
    timeoutRef.current = window.setTimeout(() => {
      dispatch(silentRefresh());

      intervalRef.current = window.setInterval(() => {dispatch(silentRefresh())}, REFRESH_INTERVAL);
    }, REFRESH_INTERVAL);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch, isAuthenticated]);

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

if (role) {
  if (Array.isArray(role)) {
    if (!role.includes(user?.role as Role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  } 
  else {
    if (user?.role !== role) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
}


  return <>{children}</>;
};

export default ProtectedRoute;
