import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import NotFoundPage from "./pages/NotFoundPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Home Page</div>,
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
  }
]);

const App = () => {
  return (
    <RouterProvider router={router}/> 
  );
};

export default App;
