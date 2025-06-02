import { Card } from 'primereact/card'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Divider } from 'primereact/divider'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import './UserInfo.css'

const UserInfo = () => {
    // Lấy dữ liệu từ localStorage
    const keyUser = localStorage.getItem('LoginUser');
    // const defaultaddress = localStorage.getItem(`address${LoginUser}-default-${i}`);
    // const name = localStorage.getItem('name' + keyUser);
    // const phone = localStorage.getItem('phoneNumber' + keyUser);
    // const address = localStorage.getItem('address' + keyUser + '-address-0') || '';
    // const typeaddress = localStorage.getItem('address' + keyUser + '-typeaddress-0') || '';

    let foundAddress = null;
    // Bước 1: Tìm địa chỉ default
    for (let i = 0; i < 100; i++) {
        const isDefault = localStorage.getItem(`address${keyUser}-default-${i}`);
        if (isDefault === 'true') {
            const name = localStorage.getItem(`address${keyUser}-name-${i}`) || '';
            const phone = localStorage.getItem(`address${keyUser}-phone-${i}`) || '';
            const address = localStorage.getItem(`address${keyUser}-address-${i}`) || '';
            const typeaddress = localStorage.getItem(`address${keyUser}-typeaddress-${i}`) || '';

            foundAddress = { name, phone, address, typeaddress };
            break;
        }
    }
    // Bước 2: Nếu chưa tìm thấy default, tìm địa chỉ bất kỳ có name khác rỗng
    if (!foundAddress) {
        for (let i = 0; i < 100; i++) {
            const addressName = localStorage.getItem(`address${keyUser}-name-${i}`);
            if (addressName && addressName.trim() !== '') {
                const name = localStorage.getItem(`address${keyUser}-name-${i}`) || '';
                const phone = localStorage.getItem(`address${keyUser}-phone-${i}`) || '';
                const address = localStorage.getItem(`address${keyUser}-address-${i}`) || '';
                const typeaddress = localStorage.getItem(`address${keyUser}-typeaddress-${i}`) || '';

                foundAddress = { name, phone, address, typeaddress };
                break;
            }
        }
    }
    // Kết quả
    if (foundAddress) {
        console.log('Found address:', foundAddress);
    } else {
        console.log('No address found.');
    }

    const [displayDialog, setDisplayDialog] = useState(false); // Mở/Đóng Dialog
    const [newName, setNewName] = useState(foundAddress?.name);
    const [newPhone, setNewPhone] = useState(foundAddress?.phone);
    const [newAddress, setNewAddress] = useState(foundAddress?.address);
    const [newTypeAddress, setNewTypeAddress] = useState(foundAddress?.typeaddress);

    const handleChange = () => {
        // Cập nhật thông tin vào localStorage
        localStorage.setItem('name' + keyUser, newName);
        localStorage.setItem('phoneNumber' + keyUser, newPhone);
        localStorage.setItem('address' + keyUser, newAddress);

        // Đóng dialog
        setDisplayDialog(false);
    };



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

    const handleSetAddress = (name, address, phone, typeaddress) => {
        console.log('handleSetAddress');
        console.log(name, address, phone, typeaddress);
        setNewName(name);
        setNewAddress(address);
        setNewPhone(phone);
        setNewTypeAddress(typeaddress);
    }

    return (
        <>
            <Card className=" bg-white mb-10">
                <div className="flex justify-between items-center text-base">
                    <h3 className="text-2xl font-bold text-[#1a1a2e]">Giao tới</h3>
                    <button
                        className="text-blue-500"
                        onClick={() => setDisplayDialog(true)} // Mở dialog khi bấm nút "Thay đổi"
                    >
                        Thay đổi
                    </button>
                </div>
                <div className="w-full mb-6 mt-2 border-t border-gray-400 "></div>
                <div className="flex flex-column items-center justify-between space-x-4">
                    {/* <div className="font-semibold text-gray-800">{newName}</div>
                    <div className="font-semibold text-sm text-gray-800">{newPhone}</div>
                    <div className="text-sm text-gray-600">{newAddress}</div> */}

                    <div className='address-item-container item'>
                        <div className='address-item space-y-4'>
                            <div className='option-name-1'>
                                <span>{newName}</span>
                            </div>
                            <div>
                              <span><i className="fas fa-map-marker-alt text-xl mr-4"></i>{newAddress}</span>
                            </div>
                            <div>
                                <span><i className="fas fa-phone-alt mr-4"></i>  {newPhone}</span>
                            </div>
                            {newTypeAddress == 'home' ? (
                                <div className='typeaddress flex items-center space-x-2'>
                                    <i className="fas fa-house-user text-xl mr-2"></i>
                                    <span>Nhà riêng / Chung cư</span>
                                </div>
                            ) : (
                                <div className='typeaddress flex items-center space-x-2'>
                                    <i className="fas fa-building text-xl"></i>
                                    <span>Cơ quan / Công ty</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </Card>

            {/* Dialog để thay đổi thông tin */}
            <Dialog
                header="Thay đổi địa chỉ"
                visible={displayDialog}
                style={{ width: '50vw' }}
                onHide={() => setDisplayDialog(false)}
            >

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

                        <button onClick={() => { handleSetAddress(adr.name, adr.address, adr.phone, adr.typeaddress) }}>Chọn</button>
                    </div>
                ))}

                <Link to='/account/address' style={{color: '#007bff'}}>Quản lý địa chỉ</Link>

                {/* <div className="p-fluid">
                    <div className="field mb-4">
                        <label htmlFor="name">Tên</label>
                        <InputText
                            id="name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Nhập tên"
                        />
                    </div>
                    <div className="field mb-4">
                        <label htmlFor="phone">Số điện thoại</label>
                        <InputText
                            id="phone"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    <div className="field mb-4">
                        <label htmlFor="address">Địa chỉ</label>
                        <InputText
                            id="address"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            placeholder="Nhập địa chỉ"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button label="Lưu" icon="pi pi-check" onClick={handleChange} className="p-button-primary" />
                    </div>
                </div> */}
            </Dialog>
        </>
    );
}

export default UserInfo;
