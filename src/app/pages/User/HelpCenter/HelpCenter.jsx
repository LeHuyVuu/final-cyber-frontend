import React from 'react';
import './HelpCenter.css';

export default function HelpCenter() {

    const ListResearch = [
        { name: 'Đơn hàng và thanh toán', icon: 'fa-solid fa-cart-shopping', detail: 'Cách tra cứu đơn hàng, sử dụng mã giảm giá và các phương thức thanh toán...', link: 'https://hotro.tiki.vn/s/topic/0TO5Y00000BiIPGWA3/%C4%91%E1%BA%B7t-h%C3%A0ng-v%C3%A0-thanh-to%C3%A1n?_gl=1*llfe4k*_gcl_aw*R0NMLjE3NDMxMTgxODkuQ2p3S0NBanc3cE9fQmhBbEVpd0E0cE1RdlBLZ3NQdllGTUxkcGJ0b0x3eFcyeWFpaHM5MENpcWxKeHF2bl92NnBHNnVmMVdfYWZBTERob0NSNjhRQXZEX0J3RQ..*_gcl_au*NjE0MjI3ODAzLjE3NDI5ODI4Mjc.*_ga*MTgyMzgxOTM2Mi4xNzQyOTgyODIz*_ga_S9GLR1RQFJ*MTc0MzMxNjY0OC44LjEuMTc0MzMxNjY1Mi41Ni4wLjA.' },
        { name: 'Tài khoản của tôi', icon: 'fa-solid fa-circle-user', detail: 'Cách đăng ký tài khoản tại Tiki, chỉnh sửa thông tin cá nhân, theo dõi đơn hàng...', link: 'https://hotro.tiki.vn/s/topic/0TO5Y00000BiIPKWA3/t%C3%A0i-kho%E1%BA%A3n-c%E1%BB%A7a-t%C3%B4i?_gl=1*llfe4k*_gcl_aw*R0NMLjE3NDMxMTgxODkuQ2p3S0NBanc3cE9fQmhBbEVpd0E0cE1RdlBLZ3NQdllGTUxkcGJ0b0x3eFcyeWFpaHM5MENpcWxKeHF2bl92NnBHNnVmMVdfYWZBTERob0NSNjhRQXZEX0J3RQ..*_gcl_au*NjE0MjI3ODAzLjE3NDI5ODI4Mjc.*_ga*MTgyMzgxOTM2Mi4xNzQyOTgyODIz*_ga_S9GLR1RQFJ*MTc0MzMxNjY0OC44LjEuMTc0MzMxNjY1Mi41Ni4wLjA.' },
        { name: 'Đơn hàng và vận chuyển', icon: 'fa-solid fa-truck-fast', detail: 'Chính sách đổi trả, cách kích hoạt bảo hành, hướng dẫn đổi trả online ...', link: 'https://hotro.tiki.vn/s/topic/0TO5Y00000BiIPJWA3/giao-nh%E1%BA%ADn-h%C3%A0ng?_gl=1*llfe4k*_gcl_aw*R0NMLjE3NDMxMTgxODkuQ2p3S0NBanc3cE9fQmhBbEVpd0E0cE1RdlBLZ3NQdllGTUxkcGJ0b0x3eFcyeWFpaHM5MENpcWxKeHF2bl92NnBHNnVmMVdfYWZBTERob0NSNjhRQXZEX0J3RQ..*_gcl_au*NjE0MjI3ODAzLjE3NDI5ODI4Mjc.*_ga*MTgyMzgxOTM2Mi4xNzQyOTgyODIz*_ga_S9GLR1RQFJ*MTc0MzMxNjY0OC44LjEuMTc0MzMxNjY1Mi41Ni4wLjA.' },
        { name: 'Đổi trả, bảo hành và hồi hoàn', icon: 'fa-solid fa-shield-halved', detail: 'Chính sách đổi trả, cách kích hoạt bảo hành, hướng dẫn đổi trả online ...', link: 'https://hotro.tiki.vn/s/topic/0TO5Y00000BiIPIWA3/%C4%91%E1%BB%95i-tr%E1%BA%A3-b%E1%BA%A3o-h%C3%A0nh-v%C3%A0-b%E1%BB%93i-ho%C3%A0n?_gl=1*gnwzse*_gcl_aw*R0NMLjE3NDMxMTgxODkuQ2p3S0NBanc3cE9fQmhBbEVpd0E0cE1RdlBLZ3NQdllGTUxkcGJ0b0x3eFcyeWFpaHM5MENpcWxKeHF2bl92NnBHNnVmMVdfYWZBTERob0NSNjhRQXZEX0J3RQ..*_gcl_au*NjE0MjI3ODAzLjE3NDI5ODI4Mjc.*_ga*MTgyMzgxOTM2Mi4xNzQyOTgyODIz*_ga_S9GLR1RQFJ*MTc0MzMxNjY0OC44LjEuMTc0MzMxNjY1Mi41Ni4wLjA.' },
        { name: 'Dịch vụ và chương trình', icon: 'fa-solid fa-gift', detail: 'Chính sách của các dịch vụ và chương trình dành cho khách hàng Tiki', link: 'https://hotro.tiki.vn/s/topic/0TO5Y00000BiIPHWA3/d%E1%BB%8Bch-v%E1%BB%A5-v%C3%A0-ch%C6%B0%C6%A1ng-tr%C3%ACnh?_gl=1*gnwzse*_gcl_aw*R0NMLjE3NDMxMTgxODkuQ2p3S0NBanc3cE9fQmhBbEVpd0E0cE1RdlBLZ3NQdllGTUxkcGJ0b0x3eFcyeWFpaHM5MENpcWxKeHF2bl92NnBHNnVmMVdfYWZBTERob0NSNjhRQXZEX0J3RQ..*_gcl_au*NjE0MjI3ODAzLjE3NDI5ODI4Mjc.*_ga*MTgyMzgxOTM2Mi4xNzQyOTgyODIz*_ga_S9GLR1RQFJ*MTc0MzMxNjY0OC44LjEuMTc0MzMxNjY1Mi41Ni4wLjA.' },
        { name: 'Thông tin về Tiki', icon: 'fa-solid fa-circle-info', detail: 'Quy chế hoạt động và chính sách của sàn thương mại điện tử Tiki', link: 'https://hotro.tiki.vn/s/topic/0TO5Y00000BiIPLWA3/th%C3%B4ng-tin-v%E1%BB%81-tiki?_gl=1*gnwzse*_gcl_aw*R0NMLjE3NDMxMTgxODkuQ2p3S0NBanc3cE9fQmhBbEVpd0E0cE1RdlBLZ3NQdllGTUxkcGJ0b0x3eFcyeWFpaHM5MENpcWxKeHF2bl92NnBHNnVmMVdfYWZBTERob0NSNjhRQXZEX0J3RQ..*_gcl_au*NjE0MjI3ODAzLjE3NDI5ODI4Mjc.*_ga*MTgyMzgxOTM2Mi4xNzQyOTgyODIz*_ga_S9GLR1RQFJ*MTc0MzMxNjY0OC44LjEuMTc0MzMxNjY1Mi41Ni4wLjA.' },
    ];

    return (
        <div className='helpcenter-container'>
            <h2>Trung tâm hỗ trợ</h2>
            <div className='helpcenter-content'>

                <section className='section-1'>
                    <h3>Chăm sóc khách hàng</h3>
                    <div className='support-items'>
                        <div className='item'>
                            <i className='fa-solid fa-phone'></i>
                            <p>Hotline</p>
                            <p style={{ fontSize: '18px', color: '#000' }}>1900-6035</p>
                            <p className='p3'>1000 đ/phút, 8h-21h kể cả thứ 7, CN</p>
                        </div>
                        <div className='item'>
                            <i className='fa-solid fa-user'></i>
                            <p>Gặp Trợ lý cá nhân</p>
                            <button>Chat ngay</button>
                            <p className='p3'>8h-21h kể cả Thứ 7, CN</p>
                        </div>
                        <div className='item'>
                            <i className='fa-solid fa-envelope'></i>
                            <p>Gửi yêu cầu hỗ trợ</p>
                            <button>Tạo đơn yêu cầu</button>
                            <p className='p3'>Hoặc email đến hotro@tiki.vn</p>
                        </div>
                    </div>
                </section>

                <section className='section-2'>
                    <h3>Tra cứu thông tin</h3>
                    <div className='support-items'>
                        {ListResearch.map((item, index) => (
                            <div key={index} className='item'>
                                <i className={item.icon}></i>
                                <h5>{item.name}</h5>
                                <p>{item.detail}</p>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">Xem chi tiết <i className='fa-solid fa-angle-right'></i></a>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
