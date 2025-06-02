import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CoinManagement.css';

import DepositCoin from './DepositCoin/DepositCoin';
import CouponCode from './CouponCode/CouponCode';

export default function CoinManagement() {
    console.log('CoinManagement render');

    const LoginUser = localStorage.getItem('LoginUser');
    const [Point, setPoint] = useState(localStorage.getItem(`point${LoginUser}`));

    return (
        <div className='coinmanagement-container'>
            <h2>Quản lý xu</h2>
            <div className='coinmanagement-content'>
                <div className='heading'>
                    <div className='left-heading'>
                        <span>Số xu trong tài khoản</span>
                        <i className='fa-solid fa-coins'></i>
                        <span className='point'>{Point}</span>
                    </div>
                    <Link to='' className='right-heading'>
                        <span>Tiki Xu là gì?</span>
                        <i className='fa-regular fa-question-circle'></i>
                    </Link>
                </div>
                <DepositCoin />
                <CouponCode setPoint={setPoint} />
            </div>
        </div>
    )
}
