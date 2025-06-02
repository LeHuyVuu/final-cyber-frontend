import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dice.css';

export default function Dice() {

    const navigate = useNavigate();
    const LoginUser = localStorage.getItem('LoginUser');
    useEffect(() => {
        if (!LoginUser) {
            navigate('/login');
        }
    }, [LoginUser, navigate]);

    const [NumberOfDice, setNumberOfDice] = useState(1);
    const [LastGamePlay, setLastGamePlay] = useState(parseInt(localStorage.getItem(`gameplay${LoginUser}`)));

    const PossibleValue = [[
        [1, 4, 6, 3,],
        [5, 4, 2, 3,],
        [6, 4, 1, 3,],
        [2, 4, 5, 3,],
    ], [
        [1, 2, 6, 5,],
        [4, 2, 3, 5,],
        [6, 2, 1, 5,],
        [3, 2, 4, 5,],
    ], [
        [1, 3, 6, 4,],
        [2, 3, 5, 4,],
        [6, 3, 1, 4,],
        [5, 3, 2, 4,],
    ], [
        [1, 5, 6, 2,],
        [3, 5, 4, 2,],
        [6, 5, 1, 2,],
        [4, 5, 3, 2,],
    ]];

    const [ActiveButton, setActiveButton] = useState(true);
    const [Number, setNumber] = useState(null);
    const [Point, setPoint] = useState(0);
    useEffect(() => {
        setPoint(0);

        if (!Number) {
            setActiveButton(true);
            return;
        }
        if (LastGamePlay === 0) {
            setActiveButton(true);
            return;
        }

        setLastGamePlay(p => p - NumberOfDice)
        localStorage.setItem(`gameplay${LoginUser}`, LastGamePlay - NumberOfDice);

        const timer = setTimeout(() => {
            const newPoint = (Number?.length || 0) > 0 ? [...Array(Number.length)].reduce((sum, _, i) => {
                const value = PossibleValue[Number[i]?.[2]]?.[Number[i]?.[1]]?.[Number[i]?.[0]];
                return value !== undefined ? sum * 10 + value : sum;
            }, 0) : 0;

            const LastPoint = localStorage.getItem(`point${LoginUser}`);
            localStorage.setItem(`point${LoginUser}`, parseInt(LastPoint) + newPoint);
            setPoint(newPoint);

            showButton(newPoint);
        }, 5000);

        return () => clearTimeout(timer);
    }, [Number]);



    const rollDice = async () => {
        setActiveButton(false);
        if (NumberOfDice > LastGamePlay) {
            setActiveButton(true);
            return;
        }

        const dices = document.getElementsByClassName('dice');
        let Value = [];

        Array.from(dices).forEach(dice => {
            dice.style.animation = 'none';
        });

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(10);

        Array.from(dices).forEach(dice => {
            let RandomNumberX = Math.floor((Math.random() * 60)) * (Math.random() < 0.5 ? 1 : -1);
            let RandomAngleX = RandomNumberX * 90;
            let RandomNumberY = Math.floor((Math.random() * 60)) * (Math.random() < 0.5 ? 1 : -1);
            let RandomAngleY = RandomNumberY * 90;
            let RandomNumberZ = Math.floor((Math.random() * 60)) * (Math.random() < 0.5 ? 1 : -1);
            let RandomAngleZ = RandomNumberZ * 90;

            Value = [...Value, [
                RandomNumberX % 4 >= 0 ? RandomNumberX % 4 : RandomNumberX % 4 + 4,
                RandomNumberY % 4 >= 0 ? RandomNumberY % 4 : RandomNumberY % 4 + 4,
                RandomNumberZ % 4 >= 0 ? RandomNumberZ % 4 : RandomNumberZ % 4 + 4,
            ]];

            setNumber(Value);
            dice.style.transform = `rotateX(${RandomAngleX}deg) rotateY(${RandomAngleY}deg) rotateZ(${RandomAngleZ}deg)`;
        });
    };

    const [PointText, setPointText] = useState(localStorage.getItem(`point${LoginUser}`));
    const [PointClass, setPointClass] = useState('prev-point');
    const showButton = (newPoint) => {
        setPointClass('prev-point show-point');

        setTimeout(() => {
            setPointText(parseInt(PointText) + newPoint);
        }, 1200);

        setTimeout(() => {
            setPointClass('prev-point hide-point');
            setActiveButton(p => true);
        }, 2000);
    }

    return (
        <div style={{ backgroundColor: '#0055aa' }}>
            <div className='dice-container'>

                <i className='fa-solid fa-coins coins-show'></i>
                <div className={PointClass}>
                    <div>{PointText}</div>
                    {/* <i className='fa-solid fa-coins'></i> */}
                </div>

                <div className='heading'>
                    <h1>XÚC XẮC MAY MẮN</h1>

                    {/* {Number &&
                        <>
                            <h2>{Number[0][0]} | {Number[0][1]} | {Number[0][2]}</h2>


                            {[...Array(Number.length)].map((_, i) => (
                                <h3 key={i}>DICE {i + 1}: {PossibleValue[Number[i][2]][Number[i][1]][Number[i][0]]}</h3>
                            ))}

                            <pre>{Point}</pre>

                            <pre>{Number.length}</pre>

                            <pre>{JSON.stringify(Number, null, 0).replace(/,\n/g, ',').replace(/],/g, '],\n')}</pre>
                        </>
                    } */}
                    {/* <h2>{AngleX % 4} | {AngleY % 4} | {AngleZ % 4}</h2> */}
                </div>
                <div className='content'>
                    {[...Array(NumberOfDice)].map((_, index) => (
                        <div key={index} className='scene-dice'>
                            <div id='dice' className='dice'>
                                <div className='face one'>
                                    {[...Array(1)].map((_, i) => (
                                        <i key={i} className={`fa-solid fa-circle one-dot one-${i}`}></i>
                                    ))}
                                </div>
                                <div className='face two'>
                                    {[...Array(4)].map((_, i) => (
                                        <i key={i} className={`fa-solid fa-circle two-dot two-${i}`}></i>
                                    ))}
                                </div>
                                <div className='face three'>
                                    {[...Array(9)].map((_, i) => (
                                        <i key={i} className={`fa-solid fa-circle three-dot three-${i}`}></i>
                                    ))}
                                </div>
                                <div className='face four'>
                                    {[...Array(4)].map((_, i) => (
                                        <i key={i} className={`fa-solid fa-circle four-dot four-${i}`}></i>
                                    ))}
                                </div>
                                <div className='face five'>
                                    {[...Array(9)].map((_, i) => (
                                        <i key={i} className={`fa-solid fa-circle five-dot five-${i}`}></i>
                                    ))}
                                </div>
                                <div className='face six'>
                                    {[...Array(6)].map((_, i) => (
                                        <i key={i} className={`fa-solid fa-circle six-dot six-${i}`}></i>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {Point > 0 ?
                    <div className='earned-point'>Bạn nhận được <span>{Point}</span> xu!</div>
                    :
                    <div className='earned-point'></div>
                }

                <p className='available-dice'>Bạn đang có {LastGamePlay} xúc xắc</p>

                {ActiveButton ?
                    <div className='btn-box'>
                        <button className='btn btn-up-down' onClick={() => NumberOfDice < 3 && setNumberOfDice(p => p + 1)}><i className='fa-solid fa-plus'></i></button>
                        <button className='btn btn-up-down' onClick={() => NumberOfDice > 1 && setNumberOfDice(p => p - 1)}><i className='fa-solid fa-minus'></i></button>
                        <button className='btn' onClick={() => { rollDice() }}>CHƠI</button>
                    </div>
                    :
                    <div className='btn-box'>
                        <button className='btn btn-up-down'><i className='fa-solid fa-plus'></i></button>
                        <button className='btn btn-up-down'><i className='fa-solid fa-minus'></i></button>
                        <button className='btn'>CHƠI</button>
                    </div>
                }
            </div>
        </div>
    )
}
