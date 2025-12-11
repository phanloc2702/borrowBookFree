// Lấy token từ localStorage
export const getToken = (): string | null => {
    return localStorage.getItem("token");
  };
  
  // Kiểm tra xem người dùng đã đăng nhập chưa
  export const isAuthenticated = (): boolean => {
    const token = getToken();
    return !!token; // true nếu có token, false nếu không
  };
  
  // Đăng xuất (xóa token)
  export const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  