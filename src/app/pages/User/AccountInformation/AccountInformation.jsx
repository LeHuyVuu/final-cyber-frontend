import React from 'react';
import './AccountInformation.css';
import PersonalInformation from './PersonalInformation/PersonalInformation.jsx';

export default function AccountInformation() {
    return (
        <div className='accountinformation-container'>
            <h2>Thông tin tài khoản</h2>
            <div className='accountinformation-content'>
                <PersonalInformation />
                <div className='info-vertical'></div>
                {/* <PhoneNumberAndEmail /> */}
            </div>
        </div>
    )
}
