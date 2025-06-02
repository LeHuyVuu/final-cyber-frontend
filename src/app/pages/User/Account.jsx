import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Account.css';
import AccountSideBar from './AccountSideBar/AccountSideBar.jsx';

export default function Account() {

    const navigate = useNavigate();
    const LoginUser = localStorage.getItem('token');
    useEffect(() => {
        if (!LoginUser) {
            navigate('/login');
        }
    }, [LoginUser, navigate]);

    return (
        <div className='account-container'>
            <div className='account-content'>
                <AccountSideBar />
                <Outlet />
            </div>
        </div>
    )
}
