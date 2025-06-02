import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TikiTextLogo from '../../../assets/TikiPics/TikiTextLogo.png';
import './AccountSideBar.css';

export default function AccountSideBar() {

    console.log('AccountSideBar Render');


    const [Option, setOption] = useState();
    const location = useLocation();
    useEffect(() => {
        setOption(location.pathname);
    }, [location])

    const ListOption = [
        { name: 'Thông tin tài khoản', icon: 'fa-solid fa-user', link: 'information' },
        { name: 'Quản lý đơn hàng', icon: 'fa-solid fa-box', link: 'order' },
        { name: 'Hỗ trợ khách hàng', icon: 'fa-solid fa-headset', link: 'help-center' },
        { name: 'Thông báo của tôi', icon: 'fa-solid fa-bell', link: 'notification' },
        { name: 'Sổ địa chỉ', icon: 'fa-solid fa-map', link: 'address' },
        { name: 'Quản lý xu', icon: 'fa-solid fa-coins', link: 'coin' },
        { name: 'Xúc xắc may mắn', icon: 'fa-solid fa-dice', link: '/dice' },
        { name: 'Dò mìn', icon: 'fa-solid fa-bomb', link: '/minesweeper' },
        { name: 'Đoán mật khẩu', icon: 'fa-solid fa-key', link: '/whatisthepassword' },
    ];

    const LoginUser = localStorage.getItem('LoginUser');
    const User = {
        name: localStorage.getItem(`name${LoginUser}`),
    };

    return (
        <div className='accountsidebar-container'>
            <div className='thisuser'>
                <img src={TikiTextLogo} alt='TikiTextLogo' />
                <div>
                    <div>Tài khoản của</div>
                    <div className='user-name'>{User.name}</div>
                </div>
            </div>
            {ListOption.map((option, index) => (
                <Link to={`${option.link}`} key={index} onClick={() => setOption(option.link)}>
                    <div className='option' style={{ backgroundColor: Option?.includes(option?.link) && '#cfcfcf' }}>
                        <i className={option.icon}></i>
                        <div className='option-name'>{option.name}</div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
