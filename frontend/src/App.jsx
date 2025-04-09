import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import NotFoundPage from "./pages/NotFoundPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AddField from "./pages/AddField";
import FieldPage from "./pages/FieldPage";

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
  },
  {
    path: '/fields/addField',
    element: <AddField />
  },
  {
    path: '/fields',
    element: <FieldPage />
  }
]);

const App = () => {
  return (
    <RouterProvider router={router}/> 
  );
};

export default App;
