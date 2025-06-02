import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateEmail.css';

export default function UpdateEmail() {

    const LoginUser = localStorage.getItem('LoginUser');
    const [Email, setEmail] = useState(localStorage.getItem(`email${LoginUser}`));
    const [Error, setError] = useState();

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const navigate = useNavigate();
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!Email) {
            setError('Email không hợp lệ');
            return;
        }
        if (!/^[\w-\.]+@([\w-]+\.)+com$/.test(Email)) {
            setError('Email không đúng form');
            return;
        }
        setError('Cập nhật email thành công!');
        localStorage.setItem(`email${LoginUser}`, Email);

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(2000);

        navigate('/account/information');
    }

    return (
        <div className='updateemail-container'>
            <h2>Cập nhật email</h2>
            <div className='updateemail-content'>
                <form onSubmit={handleUpdate}>
                    <div className='form-email form-group'>
                        <label htmlFor='email'>Địa chỉ email</label>
                        <div>
                            <i className='fa-solid fa-envelope'></i>
                            <input type='text' id='email' name='email'
                                placeholder='Nhập email'
                                value={Email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={`${Error === 'Cập nhật email thành công!' ? 'success-message' : 'error-message'}`}>{Error}</div>
                    </div>

                    <button className='btn'>Lưu thay đổi</button>
                </form>
            </div>
        </div>
    )
}
