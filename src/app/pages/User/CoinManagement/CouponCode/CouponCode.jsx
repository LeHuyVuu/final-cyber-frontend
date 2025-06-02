import React, { useState } from 'react';

export default function CouponCode(props) {
    console.log('CouponCode render');

    const LoginUser = localStorage.getItem('LoginUser');
    const [FormToggle, setFormToggle] = useState('');
    const [FormCode, setFormCode] = useState('');

    const handleToggleChange = (e) => {
        console.log('Toggle change');
        setFormToggle(e.target.value);
    };

    const handleCodeChange = (e) => {
        console.log('Code change');
        setFormCode(e.target.value);
    };

    const [Message, setMessage] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (FormCode == LoginUser && localStorage.getItem(`couponcode${LoginUser}`) == 'true' && FormToggle == 'tiki') {
            console.log('Success');
            props.setPoint(Number(localStorage.getItem(`point${LoginUser}`)) + 200);
            localStorage.setItem(`point${LoginUser}`, Number(localStorage.getItem(`point${LoginUser}`)) + 200);
            localStorage.setItem(`couponcode${LoginUser}`, 'false');
            setMessage('Nhận xu thành công!');
        } else {
            setMessage('Mã không hợp lệ!');
        }
    }

    return (
        <div className='content'>
            <h3 className='title'>
                <img src='https://frontend.tikicdn.com/_desktop-next/static/img/icons/TopUpXu/pqt-icon.svg' alt='xu' className='amount-title__img' />
                <span>Dùng Phiếu Quà Tặng</span>
            </h3>
            <div className='voucher-content'>
                <h4 className='sub-title'>Chọn nhà cung cấp</h4>
                <form onSubmit={handleSubmit}>
                    <div className='form-radio'>
                        <label>
                            <input type='radio' name='voucher' value='tiki'
                                checked={FormToggle == 'tiki'}
                                onChange={handleToggleChange}
                            />
                            <img src='https://frontend.tikicdn.com/_desktop-next/static/img/icons/TopUpXu/tiki-logo.svg' alt='xu' className='amount-title__img' />
                        </label>
                        <label>
                            <input type='radio' name='voucher' value='urbox'
                                checked={FormToggle == 'urbox'}
                                onChange={handleToggleChange}
                            />
                            <img src='https://frontend.tikicdn.com/_desktop-next/static/img/icons/TopUpXu/urbox-logo.svg' alt='xu' className='amount-title__img' />
                        </label>
                    </div>
                    <div className='form-input'>
                        <label>Mã Phiếu quà tặng</label>
                        <input type='text' name='code'
                            value={FormCode}
                            onChange={handleCodeChange} />
                        <button type='submit' className='btn'>Đổi Tiki Xu</button>
                        {Message &&
                            <div
                                style={{
                                    color: Message === 'Nhận xu thành công!' ? '#28a745' :
                                        (Message === 'Mã không hợp lệ!' ? '#dc3545' : '')
                                }}
                            >
                                {Message}
                            </div>
                        }
                    </div>
                </form>
            </div>
            {/* <div className='amount-bot'>
                <p className='amount-bot__text'>
                    Nếu bạn chưa có Phiếu quà tặng?
                    <a href='https://tiki.vn/phieu-qua-tang/c13744' target='_blank'>Hãy click để mua</a>
                </p>
            </div> */}
        </div>
    )
}
