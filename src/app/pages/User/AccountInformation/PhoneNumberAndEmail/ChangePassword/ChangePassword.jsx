import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChangePassword.css';

export default function ChangePassword() {

    const LoginUser = localStorage.getItem('LoginUser');
    const [Password, setPassword] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [Error, setError] = useState(['', '', '']);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPassword((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const navigate = useNavigate();
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!Password.current) {
            setError(['Mật khẩu hiện tại không hợp lệ', '', '']);
            return;
        }
        if (Password.current !== localStorage.getItem(`password${LoginUser}`)) {
            setError(['Mật khẩu hiện tại không khớp', '', '']);
            return;
        }

        if (!Password.new) {
            setError(['', 'Mật khẩu mới không hợp lệ', '']);
            return;
        }
        if (Password.new.length < 6) {
            setError(['', 'Mật khẩu phải ít nhất 6 kí tự', '']);
            return;
        }

        if (!Password.confirm) {
            setError(['', '', 'Xác nhận mật khẩu không hợp lệ']);
            return;
        }
        if (Password.new != Password.confirm) {
            setError(['', '', 'Mật khẩu xác nhận không khớp']);
            return;
        }

        setError(['', '', 'Đổi mật khẩu thành công!']);
        localStorage.setItem(`password${LoginUser}`, Password.new);

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(2000);

        navigate('/account/information');
    }

    return (
        <div className='changepassword-container'>
            <h2>Đổi mật khẩu</h2>
            <div className='changepassword-content'>
                <form onSubmit={handleUpdate}>
                    <div className='form-password form-group'>
                        <label htmlFor='password'>Mật khẩu hiện tại</label>
                        <div>
                            <input type='password' id='current' name='current'
                                placeholder='Nhập mật khẩu hiện tại'
                                value={Password.current}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='error-message'>{Error[0]}</div>
                    </div>
                    <div className='form-password form-group'>
                        <label htmlFor='password'>Mật khẩu mới</label>
                        <div>
                            <input type='password' id='new' name='new'
                                placeholder='Nhập mật khẩu mới'
                                value={Password.new}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='error-message'>{Error[1]}</div>
                    </div>
                    <div className='form-password form-group'>
                        <label htmlFor='password'>Mật khẩu xác nhận</label>
                        <div>
                            <input type='password' id='confirm' name='confirm'
                                placeholder='Xác nhận mật khẩu'
                                value={Password.confirm}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={`${Error[2] === 'Đổi mật khẩu thành công!' ? 'success-message' : 'error-message'}`}>{Error[2]}</div>
                    </div>

                    <button className='btn'>Lưu thay đổi</button>
                </form>
            </div>
        </div>
    )
}
