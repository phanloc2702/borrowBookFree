// routes/PrivateRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import React from "react";

type Role = "ADMIN" | "USER";

type Props = {
  children: React.ReactNode;
  allowedRoles?: Role[];
};

const PrivateRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Có hạn chế role mà user không nằm trong danh sách
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Nếu là admin thì cho về /admin, nếu là user thì về /
    if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
    if (user.role === "USER") return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
