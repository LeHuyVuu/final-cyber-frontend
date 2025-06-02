import React, { useState } from 'react';

export default function DepositCoin() {
    console.log('DepositCoin render');

    const [FormPoint, setFormPoint] = useState('0');
    const handleInputChange = (e) => {
        let rawValue = e.target.value.replace(/\./g, '');
        let numberValue = Number(rawValue);
        if (isNaN(numberValue)) {
            setFormPoint(0);
            return;
        }
        if (numberValue > 2000000) {
            numberValue = 2000000;
        }
        setMessage('');
        setFormPoint(numberValue.toLocaleString('vi-VN'));
    };

    const handleDivChange = (value) => {
        setMessage('');
        setFormPoint(value);
    }

    const LoginUser = localStorage.getItem('LoginUser');
    const [Message, setMessage] = useState('');
    const handleDeposit = () => {
        localStorage.setItem(`point${LoginUser}`, Number(localStorage.getItem(`point${LoginUser}`)) + Number(FormPoint?.replace(/\./g, '')));
        setMessage('Thanh toán thành công!');
    };

    return (
        <div className='content'>
            <h3>Nạp xu vào tài khoản</h3>

            <div className='content-box'>
                <div className='blue-box'>
                    <div className='title'>Số xu muốn nạp</div>

                    <div>
                        <div className='form-point form-group'>
                            <label htmlFor='point'><i className='fa-solid fa-coins'></i></label>
                            <input type='text' id='point' name='point'
                                placeholder='0'
                                value={FormPoint?.toLocaleString('vi-VN')}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='amount-box'>
                            {[100000, 200000, 500000, 1000000, 2000000].map((value, index) => (
                                <div
                                    key={index}
                                    className={`item ${value.toLocaleString('vi-VN') == FormPoint && 'chosen'}`}
                                    value={value}
                                    onClick={() => { handleDivChange(value.toLocaleString('vi-VN')) }}
                                >
                                    {value.toLocaleString('vi-VN')}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='info-vertical'></div>

                <div className='form-payment'>
                    <div>
                        <div className='item'>
                            <div>Phí giao dịch:</div>
                            <div>0%</div>
                        </div>
                        <div className='item'>
                            <div>Tổng tiền:</div>
                            <div>{FormPoint.toLocaleString('vi-VN')} VND</div>
                        </div>
                        {(Message && Message !== null && Message != '') ?
                            <div className='message'>{Message}</div>
                            :
                            <div className='message'></div>
                        }
                        <button onClick={() => { handleDeposit() }}>Tiến hành thanh toán</button>
                    </div>

                    <div>
                        <ul>
                            <li>1 VND = 1 Tiki Xu</li>
                            <li>Tiki Xu được nạp vào tài khoản sau khi thanh toán</li>
                            <li>ĐH Top-up Tiki Xu không thể Hủy / Trả</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
