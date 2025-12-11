// src/services/dashboardService.ts
import axiosClient from "../utils/axiosClient";

// Tổng quan thống kê
export interface DashboardSummary {
  totalBooks: number;
  totalUsers: number;
  borrowingCount: number; // số phiếu đang mượn (BORROWED + OVERDUE nếu bạn muốn)
  overdueCount: number;   // số phiếu quá hạn
}

// Hoạt động gần đây (mượn/trả/quá hạn)
export interface RecentActivity {
  id: number;
  userName: string;
  bookTitle: string;
  action: "BORROW" | "RETURN" | "OVERDUE"; // hoặc bạn để string cũng được
  createdAt: string; // ISO date string
}

interface ApiResponse<T> {
  message: string;
  data: T;
  errorCode?: string | null;
}

const dashboardService = {
  // GET /admin/dashboard/summary
  getSummary: () => {
    return axiosClient.get<ApiResponse<DashboardSummary>>(
      "/admin/dashboard/summary"
    );
  },

  // GET /admin/dashboard/recent-activities?limit=5
  getRecentActivities: (limit = 5) => {
    return axiosClient.get<ApiResponse<RecentActivity[]>>(
      "/admin/dashboard/recent-activities",
      { params: { limit } }
    );
  },
};

export default dashboardService;
