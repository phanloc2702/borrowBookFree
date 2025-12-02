import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";      
import "react-toastify/dist/ReactToastify.css";       
import LayoutRoot from "./pages/LayoutRoot.tsx";
import HomePage from "./pages/HomePage.tsx";
import Login from "./pages/Login.tsx";
import BooksPage from "./pages/BooksPage.tsx";
import UsersPage from "./pages/UsersPage.tsx";
import UserCreatePage from "./pages/UserCreatePage.tsx";
import UserUpdatePage from "./pages/UserUpdatePage.tsx";
import PrivateRoute from "./routes/PrivateRoute.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import CategoryManagementPage from "./pages/CategoryManagementPage.tsx";
import BookCreatePage from "./pages/BookCreatePage.tsx";
import BookUpdatePage from "./pages/BookUpdatePage.tsx";
import CategoriesPage from "./pages/CategoriesPage.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <LayoutRoot />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/books",
        element: <BooksPage />,
      },
      {
        path: "/users",
        element: <UsersPage />,
      },
      {
        path: "/users/create",
        element: <UserCreatePage />,
      },
      {
        path: "/users/edit/:id",
        element: <UserUpdatePage />,
      },
      
      {
        path: "/books/create",
        element:<BookCreatePage/>,
      },
      {
        path: "/books/edit/:id",
        element:<BookUpdatePage/>,
      },
      {
        path:"/categories",
        element:<CategoriesPage/>,
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path:"/register",
    element:<RegisterPage/>,
  }
  
]);

const root = createRoot(document.getElementById("root") as HTMLElement);

// 🟢 Thêm ToastContainer bên ngoài RouterProvider
root.render(
  <>
    <RouterProvider router={router} />
    <ToastContainer position="top-right" autoClose={3000} />
  </>
);
