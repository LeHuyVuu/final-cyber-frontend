import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import API_BASE_URL from "../../apiConfig";

const token = localStorage.getItem("token");

export default function UserManagement() {
  const toast = useRef(null);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalItems: 0 });

  const fetchUsers = useCallback(async (page, pageSize) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/User`, {
        params: {
          page,
          pageSize,
          sortBy: "userid",
          sortOrder: "asc",
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data;
      setUsers(data?.users || data?.result || []); // tùy backend trả về
      setPagination({
        page: data?.pagination?.page,
        pageSize: data?.pagination?.pageSize,
        totalItems: data?.pagination?.totalItems,
      });
    } catch {
      toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Không thể tải người dùng" });
    }
  }, []);

  useEffect(() => {
    fetchUsers(pagination.page, pagination.pageSize);
  }, [fetchUsers, pagination.page, pagination.pageSize]);

  const handleEdit = useCallback((user) => {
    setEditingUser({ ...user });
    setEditDialogVisible(true);
  }, []);

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/User/${editingUser.userid}`, editingUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.current?.show({ severity: "success", summary: "Cập nhật", detail: "Cập nhật người dùng thành công" });
      setEditDialogVisible(false);
      fetchUsers(pagination.page, pagination.pageSize);
    } catch {
      toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Cập nhật thất bại" });
    }
  };

  const handleDelete = useCallback(
    (user) => {
      confirmDialog({
        message: `Xác nhận xoá người dùng "${user.fullname}"?`,
        header: "Xoá người dùng",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Xoá",
        rejectLabel: "Huỷ",
        accept: async () => {
          try {
            await axios.delete(`${API_BASE_URL}/api/User/${user.userid}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            toast.current?.show({ severity: "success", summary: "Đã xoá", detail: "Người dùng đã được xoá" });

            const remaining = users.length - 1;
            const nextPage = remaining === 0 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
            setPagination((prev) => ({ ...prev, page: nextPage }));
            fetchUsers(nextPage, pagination.pageSize);
          } catch {
            toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Không thể xoá người dùng" });
          }
        },
      });
    },
    [users.length, pagination.page, pagination.pageSize, fetchUsers]
  );

  const actionTemplate = useCallback(
    (rowData) => (
      <div className="flex gap-2">
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-info" onClick={() => handleEdit(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData)} />
      </div>
    ),
    [handleEdit, handleDelete]
  );

  return (
    <div className="p-6">
      <Toast ref={toast} />
      <ConfirmDialog />
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Quản lý người dùng</h2>

      <DataTable
        value={users}
        key="userid"
        paginator
        rows={pagination.pageSize}
        totalRecords={pagination.totalItems}
        lazy
        first={(pagination.page - 1) * pagination.pageSize}
        onPage={(e) => setPagination((prev) => ({ ...prev, page: e.page + 1, pageSize: e.rows }))}
        className="shadow rounded bg-white"
        tableStyle={{ minWidth: "60rem" }}
      >
        <Column field="userid" header="ID" sortable />
        <Column field="fullname" header="Họ tên" sortable />
        <Column field="username" header="Tên đăng nhập" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="phone" header="Điện thoại" sortable />
        <Column field="role" header="Vai trò" sortable />
        <Column field="status" header="Trạng thái" body={(row) => (row.status ? "Hoạt động" : "Khoá")} sortable />
        <Column header="Thao tác" body={actionTemplate} />
      </DataTable>

      <Dialog
        header="Cập nhật người dùng"
        visible={editDialogVisible}
        style={{ width: "400px" }}
        modal
        onHide={() => setEditDialogVisible(false)}
      >
        <div className="p-fluid space-y-4">
          <div>
            <label>Họ tên</label>
            <InputText
              value={editingUser?.fullname || ""}
              onChange={(e) => setEditingUser((prev) => ({ ...prev, fullname: e.target.value }))}
            />
          </div>
          <div>
            <label>Email</label>
            <InputText
              value={editingUser?.email || ""}
              onChange={(e) => setEditingUser((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <label>Số điện thoại</label>
            <InputText
              value={editingUser?.phone || ""}
              onChange={(e) => setEditingUser((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div>
            <label>Vai trò</label>
            <InputText
              value={editingUser?.role || ""}
              onChange={(e) => setEditingUser((prev) => ({ ...prev, role: e.target.value }))}
            />
          </div>
          {/* Có thể bổ sung các trường khác nếu muốn */}
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <Button label="Huỷ" icon="pi pi-times" className="p-button-text" onClick={() => setEditDialogVisible(false)} />
          <Button label="Lưu" icon="pi pi-check" onClick={handleSaveEdit} />
        </div>
      </Dialog>
    </div>
  );
}
