// src/routes/router.tsx
import App from "@/App";
import ErrorPage from "@/components/shared/ErrorPage";
import DetailsPage from "@/pages/[id]/DetailsPage";
import ElectricityPage from "@/pages/electricity/ElectricityPage";
import ForgotPassword from "@/pages/forgot-password/ForgotPassword";
import ResetPassword from "@/pages/forgot-password/ResetPassword";
import Gas from "@/pages/gas/Gas";
import Home from "@/pages/home/Home";
import LocationPage from "@/pages/location/LocationPage";
import Login from "@/pages/login/Login";
import Others from "@/pages/others/Others";
import ActivateUser from "@/pages/register/ActivateUser";
import Register from "@/pages/register/Register";
import Road from "@/pages/road/Road";
import Water from "@/pages/water/Water";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import UserDashboardMain from "@/pages/dashboard/user/dashboard/UserDashboardMain";
import CreateIssue from "@/pages/dashboard/user/create-issue/CreateIssue";
import MyIssues from "@/pages/dashboard/user/my-issues/MyIssues";
import ProfileSettings from "@/pages/dashboard/user/profile-settings/ProfileSettings";
import EmergencyMessage from "@/pages/dashboard/user/emergency/EmergencyMessage";
import CategoryAdminDashboardMain from "@/pages/dashboard/categoryadmin/dashboard/CategoryAdminDashboardMain";
import StatusManagement from "@/pages/dashboard/categoryadmin/status-management/StatusManagement";
import UserCategoryAdmin from "@/pages/dashboard/categoryadmin/user-management/UserCategoryAdmin";
import CategoryAdminProfile from "@/pages/dashboard/categoryadmin/profile/CategoryAdminProfile";
import ReceiveMessage from "@/pages/dashboard/categoryadmin/receive-message/ReceiveMessage";
import AdminDashboardMain from "@/pages/dashboard/admin/dashboard/AdminDashboardMain";
import VendorManagement from "@/pages/dashboard/admin/vendor-management/VendorManagement";
import UserManagement from "@/pages/dashboard/admin/user-management/UserManagement";
import Settings from "@/pages/dashboard/admin/settings/Settings";
import UserUpdateProfile from "@/pages/dashboard/user/update-profile/UserUpdateProfile";
import AdminStatusManagement from "@/pages/dashboard/admin/admin-status/AdminStatusManagement";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/register-otp",
        element: <ActivateUser />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/electricity",
        element: <ElectricityPage />,
      },
      {
        path: "/gas",
        element: <Gas />,
      },
      {
        path: "/road",
        element: <Road />,
      },
      {
        path: "/water",
        element: <Water />,
      },
      {
        path: "/others",
        element: <Others />,
      },
      {
        path: "/:issueId",
        element: (
          <ProtectedRoute>
            <DetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/location/:division",
        element: <LocationPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // user routes
      {
        path: "user", // children relative path
        element: <UserDashboardMain />,
      },
      {
        path: "create-issue", // children relative path
        element: <CreateIssue />,
      },
      {
        path: "my-issues", // children relative path
        element: <MyIssues />,
      },
      {
        path: "profile-settings", // children relative path
        element: <ProfileSettings />,
      },
      {
        path: "update-profile", // children relative path
        element: <UserUpdateProfile/>,
      },
      {
        path: "emergency", // children relative path
        element: <EmergencyMessage />,
      },

      // category admin routes
      {
        path: "category-admin", // children relative path
        element: (
          <ProtectedRoute role="category-admin">
            <CategoryAdminDashboardMain />
          </ProtectedRoute>
        ),
      },
      {
        path: "status-management", // children relative path
        element: (
          <ProtectedRoute role="category-admin">
            <StatusManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-management", // children relative path
        element: (
          <ProtectedRoute role="category-admin">
            <UserCategoryAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile-settings", // children relative path
        element: (
          <ProtectedRoute role="category-admin">
            <CategoryAdminProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "receive-message", // children relative path
        element: (
          <ProtectedRoute role="category-admin">
            <ReceiveMessage />
          </ProtectedRoute>
        ),
      },

      // admin routes
      {
        path: "admin", // children relative path
        element: (
          <ProtectedRoute role="super-admin">
            <AdminDashboardMain />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-management", // children relative path
        element: (
          <ProtectedRoute role="super-admin">
            <VendorManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-status-management", // children relative path
        element: (
          <ProtectedRoute role="super-admin">
            <AdminStatusManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-management-admin", // children relative path
        element: (
          <ProtectedRoute role="super-admin">
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile-settings", // children relative path
        element: (
          <ProtectedRoute role="super-admin">
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
