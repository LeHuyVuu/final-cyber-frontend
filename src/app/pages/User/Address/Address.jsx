import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Address.css';

export default function Address() {

    const LoginUser = localStorage.getItem('LoginUser');
    const [List, setList] = useState([{
        id: null,
        name: null,
        phone: null,
        address: null,
        typeaddress: null,
        defaultaddress: null
    }])

    const [MaxId, setMaxId] = useState(0);

    // let MaxId = 0;
    // if (List.length > 0) {
    //     MaxId = Math.max(...List.map(item => item.id));
    // }

    useEffect(() => {
        const ListFromStorage = [];
        let TempMaxId = 0;
        for (let i = 0; i < 100; i++) {
            const name = localStorage.getItem(`address${LoginUser}-name-${i}`);
            const phone = localStorage.getItem(`address${LoginUser}-phone-${i}`);
            const address = localStorage.getItem(`address${LoginUser}-address-${i}`);
            const typeaddress = localStorage.getItem(`address${LoginUser}-typeaddress-${i}`);
            const defaultaddress = localStorage.getItem(`address${LoginUser}-default-${i}`);
            if (name !== null && name !== '') {
                ListFromStorage.push({
                    id: i,
                    name: name,
                    phone: phone,
                    address: address,
                    typeaddress: typeaddress,
                    defaultaddress: defaultaddress
                });
            }
            if (name == null && TempMaxId === 0) {
                TempMaxId = 1;
                setMaxId(i);
            }
        }
        setList(ListFromStorage.sort((b, a) => a - b));
    }, []);

    return (
        <div className='address-container'>
            <h2>Sổ địa chỉ</h2>
            <div className='address-content'>
                {/* <Link to={`create/${Math.max(...List.map(item => item.id)) + 1}`} className='add-address item'> */}
                <Link to={`create/${MaxId}`} className='add-address item'>
                    <i className='fa-solid fa-plus'></i>
                    <span>Thêm địa chỉ mới</span>
                </Link>

                {List.map((adr, index) => (
                    <div key={index} className='address-item-container item'>
                        <div className='address-item'>
                            <div className='option-name-1'>
                                <span>{adr.name}</span>
                                {adr.defaultaddress == 'true' &&
                                    <div className='defaultaddress'><i className='fa-regular fa-circle-check'></i>Địa chỉ mặc định</div>
                                }
                            </div>
                            <div>Địa chỉ: <span>{adr.address}</span></div>
                            <div>Điện thoại: <span>{adr.phone}</span></div>
                        </div>

                        <Link to={`create/${adr.id}`}>Chỉnh sửa</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
