import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import type { RootState } from "@/redux/store";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import { ToastContainer } from "react-toastify";
import CategoryAdminDashboard from "./CategoryAdminDashboard";
import DashboardHeader from "@/components/pages/dashboard/header/DashboardHeader";

const DashboardLayout = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case "super-admin":
        return <AdminDashboard />;
      case "category-admin":
        return <CategoryAdminDashboard />;
      case "user":
        return <UserDashboard />;
      default:
        return <Navigate to="/" replace />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="xl:w-1/6 lg:w-1/5 md:w-1/4 sm:w-2/5 w-full md:h-screen sticky top-0 overflow-y-auto border-r bg-white shadow-md z-10">
        {renderDashboard()}
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-slate-100">
        {/* Header (non-sticky) */}
        <div className="w-full mt-4">
          <DashboardHeader />
        </div>

        {/* Scrollable Outlet Area */}
        <div className="flex-1 overflow-y-auto p-4 md:mx-8">
          <Outlet />
        </div>

        {/* Toast Notifications */}
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
      </div>
    </div>
  );
};

export default DashboardLayout;
