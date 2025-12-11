import { CartProvider } from "./contexts/CartContext";

import { createRoot } from "react-dom/client";

import "./index.css";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ===== ADMIN PAGES =====
import LayoutRoot from "./pages/admin/LayoutRoot.tsx";
import HomePage from "./pages/admin/HomePage.tsx";
import BooksPage from "./pages/admin/BooksPage.tsx";
import UsersPage from "./pages/admin/UsersPage.tsx";
import UserCreatePage from "./pages/admin/UserCreatePage.tsx";
import UserUpdatePage from "./pages/admin/UserUpdatePage.tsx";
import BookCreatePage from "./pages/admin/BookCreatePage.tsx";
import BookUpdatePage from "./pages/admin/BookUpdatePage.tsx";
import CategoriesPage from "./pages/admin/CategoriesPage.tsx";
import CategoryCreatePage from "./pages/admin/CategoryCreatePage.tsx";
import CategoryUpdatePage from "./pages/admin/CategoryUpdatePage.tsx";
import BorrowingsPage from "./pages/admin/BorrowingsPage.tsx";
import BorrowRequestsPage from "./pages/admin/BorrowRequestsPage.tsx";
// ===== AUTH PAGES =====
import Login from "./pages/Login.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";

// ===== USER PAGES =====
import UserLayout from "./pages/user/UserLayout.tsx";
import UserHomePage from "./pages/user/UserHomePage.tsx";
import Profile from "./pages/user/Profile.tsx";
import Cart from "./pages/user/Cart.tsx"
import PrivateRoute from "./routes/PrivateRoute.tsx";
import Checkout from "./pages/user/Checkout.tsx";
import OrderSuccess from "./pages/user/OrderSuccess.tsx";
import ReturnGuidePage from "./pages/user/ReturnGuidePage";
import ChangePasswordPage from "./pages/user/ChangePasswordPage";
// ================== ROUTER ==================
const router = createBrowserRouter([
  // ===== USER AREA =====
  {
    path: "/",
    element: (
      <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
        <UserLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true, // "/"
        element: <UserHomePage />,
      },
      {
        path: "profile", // "/profile"
        element: <Profile />,
      },
      {
        path: "/cart",
        element:<Cart/>
      },
      {
        path:"/checkout",
        element:<Checkout/>
      },
      {
        path:"/order-success",
        element:<OrderSuccess/>
      },
      {
        path:"/return-guide/:borrowingId",
        element:<ReturnGuidePage/>
      },
      {
        path:"/change-password" ,
        element:<ChangePasswordPage />
      }
      
    ],
  },

  // ===== ADMIN AREA =====
  {
    path: "/admin",
    element: (
      <PrivateRoute allowedRoles={["ADMIN"]}>
        <LayoutRoot />
      </PrivateRoute>
    ),
    children: [
      {
        index: true, // "/admin"
        element: <HomePage />,
      },
      {
        path: "books", // "/admin/books"
        element: <BooksPage />,
      },
      {
        path: "books/create",
        element: <BookCreatePage />,
      },
      {
        path: "books/edit/:id",
        element: <BookUpdatePage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "users/create",
        element: <UserCreatePage />,
      },
      {
        path: "users/edit/:id",
        element: <UserUpdatePage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "categories/create",
        element: <CategoryCreatePage />,
      },
      {
        path: "categories/edit/:id",
        element: <CategoryUpdatePage />,
      },
      {
        path:"borrowings",
        element:<BorrowingsPage/>
      },
      {
        path:"borrow-requests",
        element:<BorrowRequestsPage/>
      }
    ],
  },

  // ===== AUTH =====
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

// ================== RENDER APP ==================
const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  
  <CartProvider>
    <RouterProvider router={router} />
    <ToastContainer position="top-right" autoClose={3000} />
  </CartProvider>
 
);
