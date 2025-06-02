import React, { useEffect, useState } from 'react';
import './WhatIsThePassword.css';

export default function WhatIsThePassword() {
    const LoginUser = localStorage.getItem('LoginUser');

    const [Password, setPassword] = useState('');
    const [Error, setError] = useState('');
    const [Refresh, setRefresh] = useState(0);

    const handleSubmitCurrentGuess = (e) => {
        e.preventDefault();
        if (Number(localStorage.getItem(`gameplay${LoginUser}`)) <= 0) return;
        checkInputPassword(e.target.guessedpassword.value);
        e.target.guessedpassword.value = '';
    }

    const [HasWon, setHasWon] = useState(false);
    const [GuessedTime, setGuessedTime] = useState(-1);
    const [GuessedCount, setGuessedCount] = useState(0);
    const [GuessedPassword, setGuessedPassword] = useState(Array(10).fill(0).map(() => ({
        index: 0,
        value: '',
        correctNumber: 0,
        correctPosition: 0
    })));

    const clearInput = () => {
        setError('');
    }

    const checkInputPassword = (InputPassword) => {
        console.log('checkInputPassword');
        if (GuessedTime === -1) setGuessedTime(0);
        if (checkValidate(InputPassword)) {
            const index = GuessedCount;
            const value = InputPassword;
            const correctNumber = checkCorrectNumber(InputPassword);
            const correctPosition = checkCorrectPosition(InputPassword);

            setGuessedPassword(PrevState => {
                let NewState = [...PrevState];
                NewState[index] = {
                    index: index,
                    value: value,
                    correctNumber: correctNumber,
                    correctPosition: correctPosition
                };
                return NewState;
            });
            checkWin(correctNumber, correctPosition);
            setGuessedCount(GuessedCount + 1);
        }
        console.log('checkInputPassword Success');
    }

    const checkValidate = (InputCheckValidate) => {

        let InputIndex4 = InputCheckValidate % 10;
        let InputIndex3 = (Math.floor(InputCheckValidate / 10)) % 10;
        let InputIndex2 = (Math.floor(InputCheckValidate / 100)) % 10;
        let InputIndex1 = (Math.floor(InputCheckValidate / 1000)) % 10;

        if (
            InputIndex1 == InputIndex2 || InputIndex1 == InputIndex3 || InputIndex1 == InputIndex4 ||
            InputIndex2 == InputIndex3 || InputIndex2 == InputIndex4 ||
            InputIndex3 == InputIndex4 ||
            InputCheckValidate.length !== 4 ||
            !/^\d+$/.test(InputCheckValidate)
        ) {
            setError('There must be 4 different digits!');
            console.log('check false');
            return false
        }
        setError('');
        console.log('check true');
        return true;
    }

    const checkCorrectNumber = (InputPassword) => {
        console.log('checkCorrectNumber');

        let RandomIndex4 = Password % 10;
        let RandomIndex3 = (Math.floor(Password / 10)) % 10;
        let RandomIndex2 = (Math.floor(Password / 100)) % 10;
        let RandomIndex1 = (Math.floor(Password / 1000)) % 10;

        let InputIndex4 = InputPassword % 10;
        let InputIndex3 = (Math.floor(InputPassword / 10)) % 10;
        let InputIndex2 = (Math.floor(InputPassword / 100)) % 10;
        let InputIndex1 = (Math.floor(InputPassword / 1000)) % 10;

        let Check = 0;
        let CorrectNumber = 0;
        for (let i = 1; i <= 4; i++) {
            if (i == 1) Check = InputIndex1;
            if (i == 2) Check = InputIndex2;
            if (i == 3) Check = InputIndex3;
            if (i == 4) Check = InputIndex4;
            if (Check == RandomIndex1 || Check == RandomIndex2 || Check == RandomIndex3 || Check == RandomIndex4) {
                CorrectNumber++;
            }
        }
        console.log('checkCorrectNumber Success');
        return CorrectNumber;
    }

    const checkCorrectPosition = (InputPassword) => {
        console.log('checkCorrectPosition');

        let RandomIndex4 = Password % 10;
        let RandomIndex3 = (Math.floor(Password / 10)) % 10;
        let RandomIndex2 = (Math.floor(Password / 100)) % 10;
        let RandomIndex1 = (Math.floor(Password / 1000)) % 10;

        let InputIndex4 = InputPassword % 10;
        let InputIndex3 = (Math.floor(InputPassword / 10)) % 10;
        let InputIndex2 = (Math.floor(InputPassword / 100)) % 10;
        let InputIndex1 = (Math.floor(InputPassword / 1000)) % 10;

        let CorrectPosition = 0;
        if (InputIndex1 == RandomIndex1) CorrectPosition++;
        if (InputIndex2 == RandomIndex2) CorrectPosition++;
        if (InputIndex3 == RandomIndex3) CorrectPosition++;
        if (InputIndex4 == RandomIndex4) CorrectPosition++;
        console.log('checkCorrectPosition Success');
        return CorrectPosition;
    }

    const checkWin = (correctNumber, correctPosition) => {
        if (correctNumber === 4 && correctPosition === 4 && GuessedCount <= 10) {
            console.log('You have won the game!');
            setHasWon(true);
        } else {
            console.log('You have NOT won yet');
        }
        return;
    }

    useEffect(() => {
        const generateRandomPassword = () => {
            console.log('generateRandomPassword');

            let RandomIndex1 = 0;
            let RandomIndex2 = 0;
            let RandomIndex3 = 0;
            let RandomIndex4 = 0;

            while (
                RandomIndex1 == RandomIndex2 || RandomIndex1 == RandomIndex3 || RandomIndex1 == RandomIndex4 ||
                RandomIndex2 == RandomIndex3 || RandomIndex2 == RandomIndex4 ||
                RandomIndex3 == RandomIndex4 ||
                RandomIndex1 >= 10 || RandomIndex2 >= 10 || RandomIndex3 >= 10 || RandomIndex4 >= 10
            ) {
                RandomIndex1 = Math.floor(Math.random() * 10);
                RandomIndex2 = Math.floor(Math.random() * 10);
                RandomIndex3 = Math.floor(Math.random() * 10);
                RandomIndex4 = Math.floor(Math.random() * 10);
            }

            const NewPassword = RandomIndex1.toString() + RandomIndex2.toString() + RandomIndex3.toString() + RandomIndex4.toString();

            setPassword(NewPassword.toString());
            console.log('generateRandomPassword Success');
        };

        setError('');
        setHasWon(false);
        setGuessedTime(-1);
        setGuessedCount(0);
        setGuessedPassword(Array(10).fill(0).map(() => ({
            index: 0,
            value: '',
            correctNumber: 0,
            correctPosition: 0
        })));
        generateRandomPassword();
    }, [Refresh]);

    useEffect(() => {
        let Interval;
        if (HasWon === false && GuessedCount < 10 && GuessedTime !== -1) {
            Interval = setInterval(() => {
                setGuessedTime(GuessedTime + 1);
            }, 1000);
        }
        return () => clearInterval(Interval);
    }, [GuessedTime, HasWon]);



    const Point = localStorage.getItem(`point${LoginUser}`);
    const GamePlay = localStorage.getItem(`gameplay${LoginUser}`);
    const addPoint = () => {
        localStorage.setItem(`point${LoginUser}`, Number(localStorage.getItem(`point${LoginUser}`)) + 200);
        localStorage.setItem(`gameplay${LoginUser}`, Number(localStorage.getItem(`gameplay${LoginUser}`)) - 1);
        setRefresh(Refresh + 1);
    }

    return (
        <div className='whatisthepassword-container'>
            <div className='heading'>
                <div className='sub-title'>WHAT IS THE</div>
                <div className='title'>PASSWORD?</div>
                {/* <div>Password: {Password}</div> */}
            </div>

            <div className='whatisthepassword-box'>
                <div className='result'>
                    {
                        ((HasWon === true) || (HasWon === false && GuessedCount >= 10)) &&
                        <div className='answer'>
                            {HasWon === true &&
                                <>
                                    <div className='game-status' style={{ color: '#28a745' }}><b>THẮNG RỒI!</b></div>
                                    <div><b>Đáp án là: {Password}</b></div>
                                </>
                            }
                            {HasWon === false && GuessedCount >= 10 &&
                                <>
                                    <div className='game-status' style={{ color: '#dc3545' }}><b>THUA RỒI...</b></div>
                                    <div><b>Đáp án là: {Password}</b></div>
                                </>
                            }
                        </div>
                    }



                    <div>
                        <div className='your-point'>
                            <label>Xu của bạn: </label>
                            <span>{Point}</span>
                        </div>
                        <div>
                            <label>Lượt chơi của bạn: </label>
                            <b>{GamePlay}</b>
                        </div>
                        {GuessedTime !== -1 &&
                            <div className='runtime'>
                                <i className='fa-solid fa-clock'></i>Thời gian: <b>{GuessedTime}</b>
                            </div>
                        }
                    </div>
                </div>

                {GuessedCount < 10 && HasWon === false &&
                    <form onSubmit={handleSubmitCurrentGuess}>
                        <div className='form-password'>
                            <input type='text' placeholder='Enter password' name='guessedpassword' />
                        </div>
                        <button type='submit' className='btn'>KIỂM TRA</button>
                        <button type='reset' className='btn btn-reset' onClick={clearInput}>XÓA</button>
                    </form>
                }

                <div className='error-message'>{Error && Error}</div>

                <div className='content'>
                    <table
                        className='no-wrap align-middle table'
                    >
                        <thead className='list-header'>
                            <tr>
                                <th>LẦN ĐOÁN</th>
                                <th>ĐÃ NHẬP</th>
                                <th>SỐ ĐÚNG</th>
                                <th>VỊ TRÍ ĐÚNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* <tr>
                            <td>
                                {GuessedPassword.length}
                            </td>
                        </tr> */}
                            {GuessedPassword
                                .filter(guessedpassword => guessedpassword.value != '')
                                .sort((b, a) => a.index - b.index)
                                .map((guessedpassword, index) => (
                                    <tr key={index}>
                                        <td>
                                            {guessedpassword.index + 1}
                                        </td>
                                        <td>
                                            {guessedpassword.value}
                                        </td>
                                        <td>
                                            {guessedpassword.correctNumber}
                                        </td>
                                        <td>
                                            {guessedpassword.correctPosition}
                                        </td>
                                    </tr>
                                ))
                            }
                            {GuessedPassword.filter(guessedpassword => guessedpassword.value != '').length === 0 &&
                                <tr>
                                    <td>--</td>
                                    <td>--</td>
                                    <td>--</td>
                                    <td>--</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>

                <div className='detail'>
                    <form>
                        <label><u>Note:</u></label>
                        <div className='form-note'>
                            <textarea as='textarea' placeholder='Bạn có thể note tất cả mọi thứ ở đây!' />
                        </div>
                    </form>

                    <div className='active-button'>
                        {HasWon == true ?
                            <button className='btn' onClick={() => { addPoint() }}>+200</button>
                            :
                            <button className='btn' onClick={() => setRefresh(Refresh + 1)}>CHƠI LẠI</button>
                        }
                        <button className='btn btn-giveup' onClick={() => { setGuessedCount(10), setGuessedTime(0) }}>BỎ CUỘC</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
