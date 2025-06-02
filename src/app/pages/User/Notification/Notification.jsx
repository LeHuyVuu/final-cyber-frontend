import React, { useState, useRef, useEffect } from 'react';
import './Notification.css';
import TikiCharacterWithCap from '../../../assets/TikiPics/TikiCharacterWithCap.png'

export default function Notification() {

    const ListTab = [
        { id: 'tab1', icon: 'fa-solid fa-house' },
        { id: 'tab2', icon: 'fa-solid fa-gift' },
        { id: 'tab3', icon: 'fa-solid fa-receipt' },
        { id: 'tab4', icon: 'fa-solid fa-clock-rotate-left' },
    ]

    const [activeTab, setActiveTab] = useState('tab1');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        setDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen(true);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className='notification-container' >
            <h2>Thông báo của tôi</h2>
            <div className='notification-content'>

                <div className='menuContainer'>
                    <div className='menuBar'>
                        {ListTab.map((tab) => (
                            <div
                                key={tab.id}
                                className={`menuItem ${activeTab === tab.id && 'activeMenuItem'} ${activeTab === tab.id && 'activeMenuItem'}`}
                                onClick={() => handleTabClick(tab.id)}
                            >
                                <i className={tab.icon}></i>
                            </div>
                        ))}
                    </div>

                    <i className='fa-solid fa-ellipsis-vertical' onClick={toggleDropdown} ref={dropdownRef}></i>
                    {dropdownOpen && (
                        <div className='dropdownMenu'>
                            <a href='#' className='dropdownItem'>Đánh dấu đọc tất cả</a>
                            <a href='#' className='dropdownItem'>Xóa tất cả thông báo</a>
                        </div>
                    )}
                </div>

                <div className='tabContent'>
                    {activeTab === 'tab1' && (
                        <>
                            <img src={TikiCharacterWithCap} alt='TikiCharacterWithCap' />
                            <div className='message'>Bạn chưa có thông báo</div>
                            <button>Tiếp tục mua sắm</button>
                        </>
                    )}
                    {activeTab === 'tab2' && (
                        <>
                            <img src={TikiCharacterWithCap} alt='TikiCharacterWithCap' />
                            <div className='message'>Chưa có quà tặng nào.</div>
                            <button>Khám phá ưu đãi</button>
                        </>
                    )}
                    {activeTab === 'tab3' && (
                        <>
                            <img src={TikiCharacterWithCap} alt='TikiCharacterWithCap' />
                            <div className='message'>Bạn chưa có hóa đơn nào.</div>
                            <button>Xem đơn hàng</button>
                        </>
                    )}
                    {activeTab === 'tab4' && (
                        <>
                            <img src={TikiCharacterWithCap} alt='TikiCharacterWithCap' />
                            <div className='message'>Chưa có lịch sử hoạt động.</div>
                            <button>Làm mới</button>
                        </>
                    )}
                    {/* {activeTab === 'tab5' && (
                        <>
                            <div className='message'>Tùy chọn khác sẽ hiển thị tại đây.</div>
                            <div style={{ position: 'relative' }} ref={dropdownRef}>
                                <button onClick={toggleDropdown}>
                                    Cài đặt ▼
                                </button>
                                {dropdownOpen && (
                                    <div className='dropdownMenu'>
                                        <a href='#' className='dropdownItem'>Tùy chọn 1</a>
                                        <a href='#' className='dropdownItem'>Tùy chọn 2</a>
                                        <a href='#' className='dropdownItem'>Tùy chọn 3</a>
                                    </div>
                                )}
                            </div>
                        </>
                    )} */}
                </div>
            </div>
        </div >
    )
}
