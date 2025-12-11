// src/services/borrowRequestService.ts
import axiosClient from "../utils/axiosClient";
import type { Borrowing } from "./borrowingService"; // Tái dùng luôn type Borrowing

export type BorrowRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELED";

export interface BorrowRequestResponse {
  id: number;
  userId: number;
  userFullName?: string | null;
  userEmail?: string | null;

  name: string;
  phone: string;
  address: string;
  note?: string | null;

  paymentMethod: "COD" | "QR";
  shippingFee: number;
  status: BorrowRequestStatus;
  createdAt: string;

  borrowings?: Borrowing[];
  totalBooks?: number; // BE có thể set = borrowings.size()
}
export interface CreateBorrowRequestPayload {
  userId: number;
  bookIds: number[];
  name: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: "COD" | "QR";
  shippingFee: number;
}
const borrowRequestService = {
  // GET /borrow-requests/filter?page=&size=&keyword=
  getBorrowRequests: (page = 0, size = 10, keyword = "") => {
    const params: any = { page, size };
    if (keyword) params.keyword = keyword;
    return axiosClient.get("/borrow-requests/filter", { params });
  },

  // GET /borrow-requests/{id}
  getBorrowRequestById: (id: number) => {
    return axiosClient.get(`/borrow-requests/${id}`);
  },

  // GET các yêu cầu mượn của 1 user
  // BE gợi ý: @GetMapping("/borrow-requests/user/{userId}")
  // Nếu bạn dùng endpoint khác (vd: /borrow-requests/me?userId=) thì đổi URL cho khớp.
  getMyBorrowRequests: (userId: number) => {
    return axiosClient.get(`/borrow-requests/user/${userId}`);
  },
  createBorrowRequest: (payload: CreateBorrowRequestPayload) => {
    return axiosClient.post("/borrow-requests", payload);
  },

  // PUT /borrow-requests/{id}/status?status=APPROVED
  updateBorrowRequestStatus: (id: number, status: BorrowRequestStatus) => {
    return axiosClient.put(`/borrow-requests/${id}/status`, null, {
      params: { status }, // phải trùng tên @RequestParam("status")
    });
  },
};

export default borrowRequestService;
