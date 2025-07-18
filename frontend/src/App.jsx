import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthForm from "./pages/AuthForm/AuthForm";
import NotFoundPage from "./pages/NotFoundPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import FieldPage from "./pages/FieldPage/FieldPage";
import HomePage from "./pages/HomePage/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import FieldDetails from "./pages/FieldDetails/FieldDetails";
import ProfilePage from "./pages/Profile/ProfilePage";
import DashBoard from "./pages/DashBoard/DashBoard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />
  },
  {
    path: '/login',
    element: <AuthForm formType={'login'} />
  },
  {
    path: '/register',
    element: <AuthForm formType={'register'} />
  },
  {
    path: '/reset/new-password',
    element: <ResetPasswordPage />
  },
  {
    path: '/fields',
    element: <FieldPage />
  },
  {
    path: '/reset/forgot-password',
    element: <ForgotPasswordPage />
  }, 
  {
    path:'/fields/:fieldId',
    element: <FieldDetails />
  }, 
  {
    path: '/profile',
    element: <ProfilePage />
  },
  {
    path: '/dashboard',
    element: <DashBoard />
  }
]);

const App = () => {
  return (
    <RouterProvider router={router}/> 
  );
};

export default App;
