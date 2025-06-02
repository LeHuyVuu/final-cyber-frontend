import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast'; // ✅ import Toast
import TikiDefaultAvatar from '../../../../assets/TikiPics/TikiDefaultAvatar.png';
import API_BASE_URL from '../../../../apiConfig';

export default function PersonalInformation() {
  const navigate = useNavigate();
  const toast = useRef(null); // ✅ toast reference
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios.get(`${API_BASE_URL}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data?.data) {
          setUserProfile(res.data.data);
          setFormData(res.data.data);
        } else {
          toast.current?.show({ severity: 'warn', summary: 'Token không hợp lệ', detail: 'Không thể lấy thông tin người dùng', life: 3000 });
          navigate("/login");
        }
      })
      .catch(err => {
        toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lấy thông tin người dùng', life: 3000 });
        navigate("/login");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    axios.put(`${API_BASE_URL}/api/User/${formData.userid}`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
      })
      .catch(err => {
        toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
      });
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    toast.current?.show({ severity: 'info', summary: 'Đăng xuất', detail: 'Bạn đã đăng xuất', life: 2000 });
    setTimeout(() => navigate("/login"), 1000);
  };

  if (!userProfile) return <div className="text-center text-gray-600 mt-10">Đang tải thông tin người dùng...</div>;

  return (
    <div className="flex justify-center items-start mt-10">
      <Toast ref={toast} />
      <Card className="w-full max-w-2xl p-6 shadow-lg rounded-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Avatar image={TikiDefaultAvatar} size="xlarge" shape="circle" />
          <div>
            <h3 className="text-xl font-bold">{formData.fullname || "Chưa có tên"}</h3>
            <p className="text-gray-500">{formData.email}</p>
          </div>
        </div>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
            <InputText className="w-full" value={formData.username || ""} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <InputText className="w-full" name="phone" value={formData.phone || ""} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
            <InputText className="w-full" name="address" value={formData.address || ""} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
            <InputText
              className="w-full"
              name="birthday"
              type="date"
              value={formData.birthday?.substring(0, 10) || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button label="Cập nhật" icon="pi pi-save" onClick={handleUpdate} />
          <Button label="Đăng xuất" icon="pi pi-sign-out" className="p-button-danger" onClick={handleLogOut} />
        </div>
      </Card>
    </div>
  );
}
