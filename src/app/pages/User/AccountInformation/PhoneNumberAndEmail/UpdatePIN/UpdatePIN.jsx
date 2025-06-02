import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdatePIN.css';

export default function UpdatePIN() {

    const LoginUser = localStorage.getItem('LoginUser');
    const [PIN, setPIN] = useState(localStorage.getItem(`PIN${LoginUser}`));
    const [Error, setError] = useState();

    const handleChange = (e) => {
        setPIN(e.target.value);
    };

    const navigate = useNavigate();
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!PIN) {
            setError('Mã PIN không hợp lệ');
            return;
        }
        if (!/^\d+$/.test(PIN)) {
            setError('Mã PIN chứa ký tự không hợp lệ');
            return;
        }
        if (PIN.length !== 6) {
            setError('Mã PIN phải có 6 chữ số');
            return;
        }
        setError('Thiết lập mã PIN thành công!');
        localStorage.setItem(`PIN${LoginUser}`, PIN);

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(2000);

        navigate('/account/information');
    }

    return (
        <div className='updatepin-container'>
            <h2>Thiết lập mã PIN</h2>
            <div className='updatepin-content'>
                <form onSubmit={handleUpdate}>
                    <div className='form-pin form-group'>
                        <label htmlFor='pin'>Mã PIN</label>
                        <div>
                            <i className='fa-solid fa-shield'></i>
                            <input type='text' id='pin' name='pin'
                                placeholder='Nhập mã PIN'
                                value={PIN}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={`${Error === 'Thiết lập mã PIN thành công!' ? 'success-message' : 'error-message'}`}>{Error}</div>
                    </div>

                    <button className='btn'>Lưu thay đổi</button>
                </form>
            </div>
        </div>
    )
}
