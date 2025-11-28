import axiosClient from "../utils/axiosClient";

const userService = {
  getUsers: (page = 0, size = 10, search = "") => {
    let url = `/users/filter?page=${page}&size=${size}`;
    if (search) url += `&keyword=${encodeURIComponent(search)}`;
    return axiosClient.get(url);
  },
  createUser: (data: any) => {
    return axiosClient.post("/users", data);
  },
  getUserById: (id: string | number) => {
    return axiosClient.get(`/users/${id}`);
  },

  // ✅ Cập nhật thông tin user (partial update)
  updateUser: (id: string | number, data: any) => {
    return axiosClient.put(`/users/${id}`, data);
  },
  deleteUser: (id:string|number) => axiosClient.delete(`/users/${id}`),
};

export default userService;
