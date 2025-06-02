import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dice from '../User/Game/Dice/Dice';
import Minesweeper from '../User/Game/Minesweeper/Minesweeper';
import LogoDice from '../../assets/Game/LogoDice.png';
import LogoMinesweeper from '../../assets/Game/LogoMinesweeper.png';
import './GameShortCut.css';

export default function GameShortCut() {

    const [LinkAccount, setLinkAccount] = useState(false);
    const location = useLocation();
    useEffect(() => {
        setLinkAccount(location.pathname.includes('dice') || location.pathname.includes('minesweeper') || location.pathname.includes('account'));
    }, [location])

    const RandomNumber = useMemo(() => Math.floor(Math.random() * 1), []);

    const [OpenPopup, setOpenPopup] = useState(false);
    const [OpenShortCut, setOpenShortCut] = useState(true);
    const navigate = useNavigate();
    const handleOpenPopup = () => {
        console.log('OpenPopup');
        setOpenPopup(true);
    }
    const handleClosePopup = () => {
        console.log('ClosePopup');
        setOpenPopup(false);
        navigate('#');
    }
    const handleCloseShortCut = () => {
        console.log('CloseShortCut');
        setOpenShortCut(false);
    }

    return (
        <>
            {OpenShortCut && LinkAccount === false &&
                <div className='dice-logo'>
                    <div className='link-logo'>
                        <a href='#popup' onClick={() => { handleOpenPopup() }}>
                            {RandomNumber === 0 ?
                                <img className='img-dice' src={LogoDice} alt='LogoDice' />
                                :
                                <img className='img-minesweeper' src={LogoMinesweeper} alt='LogoMinesweeper' />
                            }
                        </a>
                    </div>
                    <i className='fa-solid fa-xmark' onClick={() => { handleCloseShortCut() }}></i>
                </div>
            }

            {OpenPopup && (
                <div id='popup' className='overlay'>
                    <div className='popup'>
                        <button className='btn-close' onClick={() => { handleClosePopup() }}>CLOSE</button>
                        {RandomNumber === 0 ?
                            <Dice />
                            :
                            <Minesweeper />
                        }
                    </div>
                </div>
            )}
        </>
    )
}
