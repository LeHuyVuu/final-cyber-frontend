import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CreateAddress.css';

export default function CreateAddress() {

    const LoginUser = localStorage.getItem('LoginUser');
    const getAddressId = useParams();

    const [formData, setFormData] = useState({
        name: localStorage.getItem(`address${LoginUser}-name-${getAddressId.Id}`),
        phone: localStorage.getItem(`address${LoginUser}-phone-${getAddressId.Id}`),
        address: localStorage.getItem(`address${LoginUser}-address-${getAddressId.Id}`),
        typeaddress: localStorage.getItem(`address${LoginUser}-typeaddress-${getAddressId.Id}`),
        default: localStorage.getItem(`address${LoginUser}-default-${getAddressId.Id}`)
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleTypeAddressChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            typeaddress: e.target.value,
        }));
    };

    const handleDefaultChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            default: e.target.checked ? 'true' : 'false',
        }));
    };

    const navigate = useNavigate();
    const handleUpdate = (e) => {
        e.preventDefault();
        console.log(formData);
        if (formData.default == 'true') {
            for (let i = 0; i < 100; i++) {
                if (localStorage.getItem(`address${LoginUser}-default-${i}`) !== null && localStorage.getItem(`address${LoginUser}-default-${i}`) !== '') {
                    localStorage.setItem(`address${LoginUser}-default-${i}`, 'false');
                }
            }
        }

        localStorage.setItem(`address${LoginUser}-name-${getAddressId.Id}`, formData.name);
        localStorage.setItem(`address${LoginUser}-phone-${getAddressId.Id}`, formData.phone);
        localStorage.setItem(`address${LoginUser}-address-${getAddressId.Id}`, formData.address);
        localStorage.setItem(`address${LoginUser}-typeaddress-${getAddressId.Id}`, formData.typeaddress);
        localStorage.setItem(`address${LoginUser}-default-${getAddressId.Id}`, formData.default);

        navigate('/account/address');
    }

    const handleDelete = () => {
        if (localStorage.getItem(`address${LoginUser}-name-${getAddressId.Id}`) !== null && localStorage.getItem(`address${LoginUser}-name-${getAddressId.Id}`) !== '') {
            localStorage.setItem(`address${LoginUser}-name-${getAddressId.Id}`, '');
        }
        navigate('/account/address');
    }

    return (
        <div className='createaddress-container'>
            <h2>Thêm địa chỉ</h2>
            <div className='createaddress-content'>
                <form onSubmit={handleUpdate}>
                    <div className='form-name form-group'>
                        <label htmlFor='name'>Họ và tên</label>
                        <input type='text' id='name' name='name'
                            placeholder='Nhập họ tên'
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-phone form-group'>
                        <label htmlFor='phone'>Số điện thoại</label>
                        <input type='text' id='phone' name='phone'
                            placeholder='Nhập số điện thoại'
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-address form-group'>
                        <label htmlFor='address'>Địa chỉ</label>
                        <textarea as='textarea' id='address' name='address'
                            placeholder='Nhập địa chỉ'
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='form-addresstype form-group'>
                        <label>Loại địa chỉ</label>
                        <div className='toggle-options'>
                            <label>
                                <input type='radio' name='addresstype' value='home'
                                    checked={formData.typeaddress == 'home'}
                                    onChange={handleTypeAddressChange}
                                />
                                <span>Nhà riêng / Chung cư</span>
                            </label>
                            <label>
                                <input type='radio' name='addresstype' value='company'
                                    checked={formData.typeaddress == 'company'}
                                    onChange={handleTypeAddressChange}
                                />
                                <span>Cơ quan / Công ty</span>
                            </label>
                        </div>
                    </div>

                    <div className='form-default'>
                        <label>
                            <input type='checkbox' checked={formData.default == 'true'} name='default' onChange={handleDefaultChange} />
                            Đặt làm địa chỉ mặc định
                        </label>
                    </div>

                    <button type='submit' className='btn'>CẬP NHẬT</button>
                </form>
                <button className='btn btn-delete' onClick={() => { handleDelete() }}>Xóa địa chỉ</button>
            </div>
        </div>
    )
}
