// src/App.tsx
import { Outlet } from "react-router-dom";
import Header from "./components/shared/Header";
import { ToastContainer } from "react-toastify";
import Footer from "./components/shared/Footer";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import { useEffect, useRef } from "react";
import { silentRefresh } from "./redux/features/auth/authThunks";
import { useAppDispatch } from "./redux/hooks";

const REFRESH_INTERVAL = 9 * 60 * 1000; // 9  minutes

const App = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  // browser-safe timer refresh
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    // first refresh after 9 minutes
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

  return (
    <div>
      <Header />
      <main className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 xl:px-0">
        <Outlet />
        <ToastContainer
          position="bottom-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;
