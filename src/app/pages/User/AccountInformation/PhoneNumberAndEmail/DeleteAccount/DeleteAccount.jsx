import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteAccount.css';

export default function DeleteAccount() {

    const [Season, setSeason] = useState();
    const [Check, setCheck] = useState();
    const [Error, setError] = useState();

    const List = [
        'Bạn sẽ mất toàn bộ số Tiki Xu, Astra, và Bookcare đang có trong tài khoản.',
        'Tài khoản của bạn không có đơn hàng đang trong trạng thái chờ thanh toán/ đang xử lý/ đang vận chuyển.',
        'Tiki vẫn lưu trữ thông tin giao dịch để kiểm kê sau khi xóa tài khoản thành công.',
        'Sau khi xóa thành công, bạn không thể đăng nhập lại vào tài khoản đã xóa.',
        'Số điện thoại và email liên kết với tài khoản đã xóa sẽ không thể dùng để đăng ký tài khoản mới hoặc liên kết với tài khoản khác.',
        'Nếu tài khoản của bạn được dùng để đăng nhập vào Seller Center, bạn sẽ không thể đăng nhập được nữa.'
    ];

    const handleChange = (e) => {
        setSeason(e.target.value);
    };

    const handleChangeCheckBox = (e) => {
        setCheck(e.target.checked);
    };

    const navigate = useNavigate();
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!Season) {
            setError('Yêu cầu không hợp lệ');
            return;
        }
        if (!Check) {
            setError('Phải chấp nhận điều khoản trước');
            return;
        }
        setError('Gửi yêu cầu thành công!');

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(2000);

        navigate('/account/information');
    }

    return (
        <div className='deleteaccount-container'>
            <h2>Yêu cầu xóa tài khoản</h2>
            <div className='deleteaccount-content'>
                <form onSubmit={handleUpdate}>
                    <div className='form-reason form-group'>
                        <label htmlFor='reason'>Viết lý do</label>
                        <div>
                            <textarea as='textarea' id='reason' name='reason'
                                value={Season}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <span>Vui lòng đọc kỹ các chính sách và điều khoản của chúng tôi trước khi xóa</span>

                    {List.map((item, index) => (
                        <div key={index} className='item'>{item}</div>
                    ))}

                    <div className='form-check'>
                        <label>
                            <input type='checkbox' checked={Check} name='confirm' onChange={handleChangeCheckBox} />
                            Tôi chắc chắn muốn xóa tài khoản
                        </label>
                    </div>

                    <div className={`${Error === 'Gửi yêu cầu thành công!' ? 'success-message' : 'error-message'}`}>{Error}</div>

                    <button className='btn'>GỬI</button>
                </form>
            </div>
        </div>
    )
}
