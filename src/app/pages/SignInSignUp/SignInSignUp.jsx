import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignInSignUp.css';
import { GoogleLogin } from '@react-oauth/google';
import SignUpImage from '../../assets/TikiPics/LeftImage.png';
import SignInImage from '../../assets/TikiPics/RightImage.png';
import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from '../../apiConfig';

export default function SignInSignUp() {
    const [Accept, setAccept] = useState(false);
    const [errorSignIn, setErrorSignIn] = useState(null);
    const [errorSignUp, setErrorSignUp] = useState(null);
    const [successSignUp, setSuccessSignUp] = useState(null);
    const navigate = useNavigate();

    // ✅ Chỉ redirect nếu đã đăng nhập
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) navigate('/');
    }, [navigate]);

    const moveImage = () => {
        const img = document.getElementById('movingImage');
        img.style.marginRight = '50%';
        img.style.background = `url(${SignUpImage}) center`;

        const signin = document.getElementById('card-signin');
        signin.classList.remove('card-appear');
        signin.classList.add('card-disappear');

        const signup = document.getElementById('card-signup');
        signup.classList.remove('card-disappear');
        signup.classList.add('card-appear');
    };

    const moveImageBack = () => {
        const img = document.getElementById('movingImage');
        img.style.marginRight = '0%';
        img.style.background = `url(${SignInImage}) center`;

        const signin = document.getElementById('card-signin');
        signin.classList.remove('card-disappear');
        signin.classList.add('card-appear');

        const signup = document.getElementById('card-signup');
        signup.classList.remove('card-appear');
        signup.classList.add('card-disappear');
    };

    const handleAccept = () => {
        setAccept(p => !p);
    };

    const handleSubmitSignIn = async (e) => {
        e.preventDefault();
        const phone = e.target.SignInPhoneNumber.value;
        const password = e.target.SignInPassword.value;

        if (!phone || !password) {
            setErrorSignIn('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/Auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: phone, password })
            });
            const result = await res.json();
            if (!res.ok || result.statusCode !== 200) {
                setErrorSignIn(result.message || 'Đăng nhập thất bại');
                return;
            }
            localStorage.setItem('token', result.data.token);
            navigate('/');
        } catch (err) {
            console.error(err);
            setErrorSignIn('Lỗi kết nối đến máy chủ');
        }
    };

    const handleSubmitSignUp = async (e) => {
        e.preventDefault();
        setErrorSignUp(null);
        setSuccessSignUp(null);

        const username = e.target.username.value;
        const fullname = e.target.SignUpFullName.value;
        const email = e.target.SignUpEmail.value;
        const password = e.target.SignUpPassword.value;
        const confirm = e.target.SignUpConfirm.value;

        if (!username || !fullname || !email || !password || !confirm) {
            setErrorSignUp('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (password !== confirm) {
            setErrorSignUp('Mật khẩu xác nhận không khớp');
            return;
        }

        if (!Accept) {
            setErrorSignUp('Bạn phải đồng ý điều khoản');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email })
            });
            const result = await res.json();
            if (!res.ok || result.statusCode !== 200) {
                setErrorSignUp(result.message || 'Đăng ký thất bại');
                return;
            }
            setSuccessSignUp('Đăng ký thành công, vui lòng đăng nhập!');
            setTimeout(() => moveImageBack(), 1000);
        } catch (err) {
            console.error(err);
            setErrorSignUp('Lỗi kết nối đến máy chủ');
        }
    };

    return (
        <div className='user-signin-signup'>
            <div className='signinsignup-container'>
                <div className='card-box'>
                    {/* SIGN IN */}
                    <div className='card-side card-appear' id='card-signin'>
                        <h1>Đăng Nhập</h1>
                        <form className='form-box form-box1' onSubmit={handleSubmitSignIn}>
                            <div className='form-group form-input'>
                                <input name='SignInPhoneNumber' className='input form-control' type='text' placeholder='Số điện thoại' />
                            </div>
                            <div className='form-group form-input'>
                                <input name='SignInPassword' className='input form-control' type='password' placeholder='Mật khẩu đăng nhập' />
                            </div>
                            <a href='#' className='forget-link'>Quên mật khẩu?</a>
                            {errorSignIn && <div className='error-message'>{errorSignIn}</div>}
                            <div className='btn-box'>
                                <button type='submit' className='btn btn-submit' id='btn-signin'>Đăng nhập</button>
                            </div>
                        </form>

                        <div className='flex items-center'>
                            <hr className='flex-grow border-gray-400' />
                            <span className='mx-2 text-gray-600'>Hoặc</span>
                            <hr className='flex-grow border-gray-400' />
                        </div>

                        <GoogleLogin
                            onSuccess={(response) => {
                                const decoded = jwtDecode(response.credential);
                                console.log('Google User:', decoded);
                            }}
                            onError={(error) => {
                                console.error('Google Login Error:', error);
                            }}
                        />

                        <button className='mt-10 text-left' onClick={moveImage}>
                            Chưa có tài khoản?<span className='text-blue-500 mx-2'>Đăng kí</span>
                        </button>
                    </div>

                    {/* SIGN UP */}
                    <div className='card-side card-disappear' id='card-signup'>
                        <h1 className='title'>Đăng kí</h1>
                        <form className='form-box form-box2' onSubmit={handleSubmitSignUp}>
                            <div className='form-group form-input'>
                                <input name='username' className='input form-control' type='text' placeholder='Username' />
                            </div>
                            <div className='form-group form-input'>
                                <input name='SignUpFullName' className='input form-control' type='text' placeholder='Họ tên' />
                            </div>
                            <div className='form-group form-input'>
                                <input name='SignUpEmail' className='input form-control' type='email' placeholder='Email đăng kí' />
                            </div>
                            <div className='form-group form-input'>
                                <input name='SignUpPassword' className='input form-control' type='password' placeholder='Mật khẩu đăng kí' />
                            </div>
                            <div className='form-group form-input'>
                                <input name='SignUpConfirm' className='input form-control' type='password' placeholder='Xác nhận mật khẩu' />
                            </div>
                            {errorSignUp && <div className='error-message'>{errorSignUp}</div>}
                            {successSignUp && <div className='success-message'>{successSignUp}</div>}
                            <div className='btn-box'>
                                <button type='submit' className='btn btn-submit' id='btn-signup'>Đăng kí</button>
                            </div>
                        </form>

                        <div className='accept-box mt-8 text-xs italic'>
                            <b>Bằng việc đăng kí bạn đã đồng ý với </b>
                            <a href='https://hotro.tiki.vn/s/article/dieu-khoan-su-dung' className='provision text-blue-500' target='_blank'>Điều Khoản</a>
                            <div className='form-check'>
                                <label className='flex items-center justify-center gap-2'>
                                    <input type='checkbox' checked={Accept} onChange={handleAccept} />
                                    Đồng ý điều khoản
                                </label>
                            </div>
                        </div>

                        <button className='mt-8 text-left' onClick={moveImageBack}>
                            Đã có tài khoản?<span className='text-blue-500 mx-2'>Đăng nhập</span>
                        </button>
                    </div>

                    {/* Hình nền chuyển động */}
                    <div className='movingImage' id='movingImage'></div>
                </div>
            </div>
        </div>
    );
}
