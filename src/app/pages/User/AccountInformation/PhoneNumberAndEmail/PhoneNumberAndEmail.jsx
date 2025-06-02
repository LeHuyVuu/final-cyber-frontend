import React from 'react';
import { Link } from 'react-router-dom';
// import { Form, Button, Container } from "react-bootstrap";
import './PhoneNumberAndEmail.css';

export default function PhoneNumberAndEmail() {

    const LoginUser = localStorage.getItem('LoginUser');

    const ListPhoneNumberAndEmail = [
        {
            heading: 'Số điện thoại và Email',
            items: [
                { icon: 'fa-solid fa-phone', label: 'Số điện thoại', value: localStorage.getItem(`phoneNumber${LoginUser}`), button: 'Cập nhật', link: 'phone-number' },
                { icon: 'fa-solid fa-envelope', label: 'Địa chỉ email', value: localStorage.getItem(`email${LoginUser}`), button: 'Cập nhật', link: 'email' },
            ]
        },
        {
            heading: 'Bảo mật',
            items: [
                { icon: 'fa-solid fa-lock', label: 'Đổi mật khẩu', value: null, button: 'Cập nhật', link: 'password' },
                { icon: 'fa-solid fa-shield', label: 'Thiết lập mã PIN', value: null, button: 'Thiết lập', link: 'pin' },
                { icon: 'fa-solid fa-trash-can', label: 'Yêu cầu xóa tài khoản', value: null, button: 'Yêu cầu', link: 'delete-account' },
            ]
        },
        // {
        //     heading: 'Liên kết mạng xã hội',
        //     items: [
        //         { icon: 'fa-brands fa-facebook', label: 'Facebook', value: null, button: 'Liên kết', link: '' },
        //         { icon: 'fa-brands fa-google', label: 'Google', value: null, button: 'Liên kết', link: '' },
        //     ]
        // },
    ];

    return (
        <div className='phonenumberandemail-container'>

            {ListPhoneNumberAndEmail.map((list, index) => (
                <div key={index} className='phonenumberandemail-item'>

                    <h3>{list.heading}</h3>

                    {list.items.map((item, i) => (
                        <div key={i} className='content'>
                            <div className='left-content'>
                                {item.icon && <i className={item.icon}></i>}
                                <div className='item'>
                                    <span>{item.label}</span>
                                    <div className='value-text'>{item.value}</div>
                                </div>
                            </div>
                            {((item.label === 'Đổi mật khẩu' || item.label === 'Địa chỉ email') && LoginUser?.length !== 10) ?
                                <button className='unavailable'>{item.button}</button>
                                :
                                <Link to={`${item.link}`}>
                                    {item.link == '' ?
                                        <button className='unavailable'>SẮP CÓ</button>
                                        :
                                        <button>{item.button}</button>
                                    }
                                </Link>
                            }
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
