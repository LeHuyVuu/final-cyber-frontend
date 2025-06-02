import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoOrder from '../../../assets/TikiPics/NoOrder.png';
import { Paginator } from 'primereact/paginator';
import './OrderManagement.css';
import API_BASE_URL from '../../../apiConfig';

export default function OrderManagement() {
    const [carousel, setCarousel] = useState('Tất cả đơn');
    const [orders, setOrders] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(2);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${API_BASE_URL}/api/Order`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (res.data?.data) {
                setOrders(res.data.data);
            }
        })
        .catch(err => {
            console.error("Lỗi lấy đơn hàng:", err);
        });
    }, []);

    const OrderStatuses = [
        { name: 'Tất cả đơn' },
        { name: 'Chờ thanh toán' },
        { name: 'Đang xử lý' },
        { name: 'Đang vận chuyển' },
        { name: 'Đã giao' },
        { name: 'Đã huỷ' },
    ];

    const filteredOrders = orders.filter(order => 
        carousel === 'Tất cả đơn' ? true : order.status === carousel
    );

    const onPageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
    };

    return (
        <div className='ordermanagement-container mb-44'>
            <h2>Quản lý đơn hàng</h2>
            <div className='ordermanagement-content'>
                <div className='headings'>
                    {OrderStatuses.map((status, i) => (
                        <div
                            key={i}
                            className='filter-option'
                            onClick={() => { setCarousel(status.name); setFirst(0); }}
                            style={{
                                borderBottom: carousel === status.name && '2px solid #007bff',
                                color: carousel === status.name && '#007bff',
                            }}
                        >
                            {status.name}
                        </div>
                    ))}
                </div>

                <form className='search-form'>
                    <div className='form-container'>
                        <i className='fa-solid fa-magnifying-glass'></i>
                        <input type='text' placeholder='Tìm kiếm đơn hàng...' />
                        <button>Tìm đơn hàng</button>
                    </div>
                </form>

                <div className='carousel'>
                    {filteredOrders.length === 0 ? (
                        <>
                            <img src={NoOrder} alt='NoOrder' />
                            <p>'{carousel}' chưa có đơn hàng</p>
                        </>
                    ) : (
                        <div className="mx-auto p-1">
                            {filteredOrders.slice(first, first + rows).map((order, index) => (
                                <div key={index} className="bg-white shadow mb-4 p-4 rounded">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-500">Mã đơn: #{order.orderid}</span>
                                        <span className="text-sm text-gray-500">Ngày đặt: {order.orderdate.substring(0, 10)}</span>
                                    </div>

                                    {order.orderdetails.length > 0 ? order.orderdetails.map((detail, idx) => (
                                        <div key={idx} className="flex items-center border-b py-2">
                                            <img
                                                src={detail.product?.image || NoOrder}
                                                alt={detail.product?.productname}
                                                className="w-14 h-14 object-cover mr-4 rounded"
                                            />
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                                                    {detail.product?.productname}
                                                </h4>
                                                <p className="text-xs text-gray-500">Số lượng: x{detail.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-red-600">
                                                    {(detail.price * detail.quantity).toLocaleString()} đ
                                                </p>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-gray-400 italic">Đơn hàng không có sản phẩm</p>
                                    )}

                                    <div className="flex justify-between items-center mt-2 pt-2 border-t">
                                        <p className="text-sm font-semibold text-gray-800">
                                            Trạng thái: <span className="text-blue-600">{order.status}</span>
                                        </p>
                                        <p className="text-sm font-bold text-red-600">
                                            Tổng tiền: {order.total.toLocaleString()} đ
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Paginator
                        first={first}
                        rows={rows}
                        totalRecords={filteredOrders.length}
                        onPageChange={onPageChange}
                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    />
                </div>
            </div>
        </div>
    );
}
