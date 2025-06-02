import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdatePhoneNumber.css';

export default function UpdatePhoneNumber() {

    const LoginUser = localStorage.getItem('LoginUser');
    const [Phone, setPhone] = useState(localStorage.getItem(`phoneNumber${LoginUser}`));
    const [Error, setError] = useState();

    const handleChange = (e) => {
        setPhone(e.target.value);
    };

    const navigate = useNavigate();
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!Phone) {
            setError('Số điện thoại không hợp lệ');
            return;
        }
        if (!/^\d+$/.test(Phone)) {
            setError('Số điện thoại chứa ký tự không hợp lệ');
            return;
        }
        if (Phone.length !== 10) {
            setError('Số điện thoại phải có 10 chữ số');
            return;
        }
        setError('Cập nhật số điện thoại thành công!');
        localStorage.setItem(`phoneNumber${LoginUser}`, Phone);

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(2000);

        navigate('/account/information');
    }

    return (
        <div className='updatephonenumber-container'>
            <h2>Cập nhật số điện thoại</h2>
            <div className='updatephonenumber-content'>
                <form onSubmit={handleUpdate}>
                    <div className='form-phone form-group'>
                        <label htmlFor='phone'>Số điện thoại</label>
                        <div>
                            <i className='fa-solid fa-phone'></i>
                            <input type='text' id='phone' name='phone'
                                placeholder='Nhập số điện thoại'
                                value={Phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={`${Error === 'Cập nhật số điện thoại thành công!' ? 'success-message' : 'error-message'}`}>{Error}</div>
                    </div>

                    <button className='btn'>Lưu thay đổi</button>
                </form>
            </div>
        </div>
    )
}
