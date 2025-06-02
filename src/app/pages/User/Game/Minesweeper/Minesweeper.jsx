import React, { useEffect, useState } from 'react';
// import { Button, Form } from 'react-bootstrap';
import './Minesweeper.css';

export default function Minesweeper() {
    console.log('Minesweeper Render');
    const LoginUser = localStorage.getItem('LoginUser');

    const [GameMode, setGameMode] = useState({
        rowCount: 18,
        colCount: 14,
        bombNumber: 40,
        flagNumber: 40,
    });
    const [Flag, setFlag] = useState(GameMode.flagNumber);
    const [Time, setTime] = useState(-1);
    const [HasWon, setHasWon] = useState(0);
    const [Refresh, setRefresh] = useState(0);

    const [GameBoard, setGameBoard] = useState(Array(GameMode.rowCount).fill(0).map(() =>
        Array(GameMode.colCount).fill(0).map(() => ({ value: 0, isRevealed: false, flag: false }))
    ));

    useEffect(() => {
        const generateGameBoardBomb = () => {
            console.log('generateGameBoardBomb');
            const NewGameBoard = Array(GameMode.rowCount).fill(0).map(() =>
                Array(GameMode.colCount).fill(0).map(() => ({ value: 0, isRevealed: false, flag: false }))
            );

            let count = 0;
            while (count < GameMode.bombNumber) {
                const row = Math.floor(Math.random() * GameMode.rowCount);
                const col = Math.floor(Math.random() * GameMode.colCount);
                if (NewGameBoard[row][col].value !== 9) {
                    NewGameBoard[row][col].value = 9;
                    count++;
                }
            }

            setGameBoard(NewGameBoard);
            console.log('generateGameBoardBomb Success');
        };

        setFlag(GameMode.flagNumber);
        setTime(-1);
        setHasWon(0);
        generateGameBoardBomb();
    }, [GameMode, Refresh]);

    const checkSurroundingCells = (row, col) => {
        let count = 0;
        if (GameBoard[row][col].value === 9) return 9;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const NewRow = row + i;
                const NewCol = col + j;
                if (NewRow >= 0 && NewRow < GameMode.rowCount && NewCol >= 0 && NewCol < GameMode.colCount) {
                    if (GameBoard[NewRow][NewCol].value === 9) {
                        count++;
                    }
                }
            }
        }
        GameBoard[row][col].value = count;
        return count;
    };

    const checkSurroundingFlags = (row, col) => {
        console.log('checkSurroundingFlags');
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const NewRow = row + i;
                const NewCol = col + j;
                if (NewRow >= 0 && NewRow < GameMode.rowCount && NewCol >= 0 && NewCol < GameMode.colCount) {
                    if (GameBoard[NewRow][NewCol].flag === true) {
                        count++;
                    }
                }
            }
        }
        console.log('checkSurroundingFlags Success');
        return count;
    };

    const revealCell = (row, col) => {
        if (HasWon !== 0) return;
        if (Number(localStorage.getItem(`gameplay${LoginUser}`)) <= 0) return;
        console.log('revealCell');

        if (Time === -1) setTime(0);

        if (GameBoard[row][col].isRevealed) return;//Đã mở rồi thì không mở nữa
        if (GameBoard[row][col].flag) return;//Đã cắm cờ rồi thì không mở được

        if (GameBoard[row][col].value === 9) revealAllCellBomb();
        const NewGameBoard = [...GameBoard];
        NewGameBoard[row][col].isRevealed = true;
        setGameBoard(NewGameBoard);

        if (GameBoard[row][col].value === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const NewRow = row + i;
                    const NewCol = col + j;
                    if (NewRow >= 0 && NewRow < GameMode.rowCount && NewCol >= 0 && NewCol < GameMode.colCount) {
                        revealCell(NewRow, NewCol);
                    }
                }
            }
        }
        console.log('revealCell Success');
        checkWin();
    };

    const revealCellAround = (row, col) => {
        console.log('revealCellAround');
        console.log('SurroundingFlags', checkSurroundingFlags(row, col));
        if (!GameBoard[row][col].isRevealed) return;// Chưa mở thì chưa được doubleClick
        if (GameBoard[row][col].flag) return;// Đã cắm cờ rồi thì không mở xung quang được

        if (GameBoard[row][col].value === 9) revealAllCellBomb();

        if (checkSurroundingFlags(row, col) == checkSurroundingCells(row, col)) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const NewRow = row + i;
                    const NewCol = col + j;
                    if (NewRow >= 0 && NewRow < GameMode.rowCount && NewCol >= 0 && NewCol < GameMode.colCount) {
                        revealCell(NewRow, NewCol);
                    }
                }
            }
        }
        console.log('revealCellAround Success');
    };

    const setTheFlag = (row, col) => {
        if (HasWon !== 0) return;
        console.log('setTheFlag');
        if (GameBoard[row][col].isRevealed) return;
        if (GameBoard[row][col].flag === false && Flag === 0) return;
        const NewGameBoard = [...GameBoard];
        NewGameBoard[row][col].flag = !NewGameBoard[row][col].flag;
        NewGameBoard[row][col].flag ? setFlag(Flag - 1) : setFlag(Flag + 1);
        setGameBoard(NewGameBoard);
        console.log('setTheFlag Success');
    }

    const revealAllCellBomb = () => {
        console.log('revealAllCellBomb');
        const NewGameBoard = [...GameBoard];
        NewGameBoard.forEach((row, RowIndex) => {
            row.forEach((cell, ColIndex) => {
                if (cell.value === 9) {
                    NewGameBoard[RowIndex][ColIndex].isRevealed = true;
                }
            });
        });
        setGameBoard(NewGameBoard);
        setHasWon(2);
        console.log('revealAllCellBomb Success');
    };

    const checkWin = () => {
        let hasWon = true;
        GameBoard.forEach((row) => {
            row.forEach((cell) => {
                if ((cell.value !== 9 && !cell.isRevealed) || (cell.value === 9 && cell.isRevealed)) {
                    hasWon = false;
                    return;
                }
            });
        });
        if (hasWon) {
            console.log('You have won the game!');
            setHasWon(1);
        }
    }

    useEffect(() => {
        let Interval;
        if (HasWon === 0 && Time !== -1) {
            Interval = setInterval(() => {
                setTime(Time + 1);
            }, 1000);
        }
        return () => clearInterval(Interval);
    }, [Time, HasWon]);

    const Point = localStorage.getItem(`point${LoginUser}`);
    const GamePlay = localStorage.getItem(`gameplay${LoginUser}`);
    const addPoint = () => {
        localStorage.setItem(`point${LoginUser}`, Number(localStorage.getItem(`point${LoginUser}`)) + 200);
        localStorage.setItem(`gameplay${LoginUser}`, Number(localStorage.getItem(`gameplay${LoginUser}`)) - 1);
        localStorage.setItem(`score${LoginUser}-${ListScore.length + 1}`, Time);
        setRefresh(p => p + 1);
    }
    // let ListScore = ['ABC'];
    // for (let i = 0; i < 100; i++) {
    //     const item = localStorage.getItem(`score${LoginUser}-${i}`);
    //     if (item !== null) {
    //         ListScore.push(item);
    //     }
    // }
    // localStorage.setItem(`score${LoginUser}-${0}`, 120);
    const ListScore = Array.from({ length: 100 }, (_, i) =>
        localStorage.getItem(`score${LoginUser}-${i}`)
    ).filter(item => item !== null).sort((a, b) => {
        return Number(a) - Number(b);
    }).slice(0, 7);



    const countMines = () => {
        return GameBoard.reduce((acc, row) => {
            return acc + row.reduce((innerAcc, cell) => {
                return cell.value === 9 ? innerAcc + 1 : innerAcc;
            }, 0);
        }, 0);
    };

    return (
        <div className='minesweeper-container'>
            <div className='heading'>
                <h1>DÒ MÌN</h1>
            </div>

            <div className='content'>
                <table
                    className='no-wrap align-middle table'
                    style={{
                        '--table-width': GameMode.colCount,
                        '--table-height': GameMode.rowCount,
                        border:
                            HasWon === 1 ?
                                '4px solid #28a745'
                                :
                                (HasWon === 2 ?
                                    '4px solid #dc3545'
                                    :
                                    '4px solid #d97720'
                                ),
                        backgroundColor:
                            HasWon === 1 ?
                                '#28a745'
                                :
                                (HasWon === 2 ?
                                    '#dc3545'
                                    :
                                    '#d97720'
                                ),
                    }}
                >
                    <tbody>
                        {[...Array(GameMode.rowCount)].map((_, index_row) => (
                            <tr key={index_row}>
                                {[...Array(GameMode.colCount)].map((_, index_col) => (
                                    <td key={index_col}
                                        style={{
                                            cursor:
                                                checkSurroundingCells(index_row, index_col) !== 0 ?
                                                    (GameBoard[index_row][index_col].isRevealed ?
                                                        'pointer'
                                                        :
                                                        'pointer'
                                                    )
                                                    :
                                                    (GameBoard[index_row][index_col].isRevealed ?
                                                        'default'
                                                        :
                                                        'pointer'
                                                    )
                                            ,
                                            backgroundColor:
                                                GameBoard[index_row][index_col].isRevealed ?
                                                    (GameBoard[index_row][index_col].value !== 9 ?
                                                        '#ffd9a9'
                                                        :
                                                        GameBoard[index_row][index_col].flag ?
                                                            '#d97720'
                                                            :
                                                            '#dc3545'
                                                    )
                                                    :
                                                    ((index_row + index_col) % 2 === 0 ? '#ffcc80' : '#ffab40')
                                        }}
                                        onClick={() => { revealCell(index_row, index_col) }}
                                        onDoubleClick={() => { revealCellAround(index_row, index_col) }}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            setTheFlag(index_row, index_col)
                                        }}
                                    >
                                        <p>
                                            {(GameBoard[index_row][index_col].isRevealed ?//Được mở mới hiện số, không thì kiểm tra có cờ không
                                                (checkSurroundingCells(index_row, index_col) !== 9 ?//In ra số nếu không phải bom
                                                    (checkSurroundingCells(index_row, index_col) !== 0 &&//Khác 0 mới hiện số
                                                        checkSurroundingCells(index_row, index_col)
                                                    )
                                                    :
                                                    <i className='fa-solid fa-bomb'></i>//In ra quả bom
                                                )
                                                :
                                                (GameBoard[index_row][index_col].flag &&//Nếu được cắm cờ thì hiện cờ
                                                    <i className='fa-solid fa-flag' style={{ color: 'red' }}></i>
                                                )
                                            )}
                                        </p>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='detail-container'>
                    <div className='detail'>
                        <div className='support'>
                            <div className='flag'><i className='fa-solid fa-flag' style={{ color: 'red' }}></i> {Flag}</div>
                            {HasWon === 1 ?
                                <button className='btn' onClick={() => { addPoint() }}>+200</button>
                                :
                                <button className='btn btn-reset' onClick={() => { setRefresh(p => p + 1) }}>CHƠI LẠI</button>
                            }
                        </div>

                        <div className='your-point'>
                            <label>Xu của bạn: </label>
                            <span>{Point}</span>
                        </div>

                        <div>
                            <label>Lượt chơi của bạn: </label>
                            <span>{GamePlay}</span>
                        </div>

                        {Time !== -1 &&
                            <div className='runtime'>
                                <label><i className='fa-solid fa-clock'></i>Thời gian: </label>
                                <span>{Time}</span>
                            </div>
                        }

                        {(HasWon === 1 || HasWon === 2) &&
                            <div className='result'
                                style={{
                                    border:
                                        HasWon === 1 ?
                                            '4px solid #28a745'
                                            :
                                            (HasWon === 2 ?
                                                '4px solid #dc3545'
                                                :
                                                'none'
                                            )
                                }}
                            >
                                {HasWon === 1 && <div style={{ color: '#28a745' }}>THẮNG RỒI!</div>}
                                {HasWon === 2 && <div style={{ color: '#dc3545' }}>THUA RỒI...</div>}
                            </div>
                        }
                    </div>

                    <div className='high-score'>
                        <div className='title'>KỶ LỤC CÁ NHÂN</div>
                        {/* <div className='item'>
                            <div>TOP</div>
                            <div>Điểm (Giây)</div>
                        </div> */}
                        {ListScore.map((score, index) => (
                            <div key={index} className='item'>
                                <div>
                                    <i
                                        className='fa-solid fa-star'
                                        style={{
                                            color: index === 0 ? '#ffd700' :
                                                (index === 1 ? '#c0c0c0' :
                                                    (index === 2 ? '#cd7f32' :
                                                        'transparent'
                                                    )
                                                )
                                        }}
                                    ></i>
                                    {index + 1}
                                </div>
                                <div className='score'>{score} (Giây)</div>
                            </div>
                        ))}
                        {ListScore.length === 0 &&
                            <div className='item no-score'>*Không có kỷ lục nào*</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
