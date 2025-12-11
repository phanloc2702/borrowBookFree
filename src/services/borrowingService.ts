// src/services/borrowingService.ts
import axiosClient from "../utils/axiosClient";

export type BorrowStatus = "BORROWED" | "RETURNED" | "OVERDUE";

export interface Borrowing {
  id: number;
  userId: number;
  userFullName?: string | null;
  userEmail?: string | null;

  borrowDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: BorrowStatus;
  book: {
    id: number;
    title: string;
    author: string;
  };
}

export interface CreateBorrowingPayload {
  userId: number;
  bookIds: number[];
  name: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: "COD" | "QR";
}

const borrowingService = {
  // >>> LƯU Ý: nhận userId và truyền vào params
  getMyBorrowings: (userId: number) => {
    return axiosClient.get("/borrowings/me", {
      params: { userId },
    });
  },

  getBorrowings: (page = 0, size = 10, keyword = "") => {
    let url = `/borrowings/filter?page=${page}&size=${size}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    return axiosClient.get(url);
  },

  createBorrowings: (payload: CreateBorrowingPayload) => {
    return axiosClient.post("/borrowings", payload);
  },

  // NEW: cập nhật trạng thái phiếu mượn
  updateBorrowingStatus: (id: number, status: BorrowStatus) => {
    return axiosClient.put(`/borrowings/${id}/status`, null, {
      params: { status }, // phải trùng với @RequestParam("status")
    });
  },
};

export default borrowingService;
