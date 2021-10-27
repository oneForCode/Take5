// import castle from './castle.jpeg';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
// import './App.css';

const h = 15;
const w = 15;
const WIN = 5;

const OutterDiv = styled.div`
    position: relative;
`;

const InnerDiv = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffffa6;
    width: fit-content;
`;

const Td = styled.td`
    border: 1px solid black;
    border-collapse: collapse;
    width: 40px;
    height: 40px;
    text-align: center;
    font-weight: bolder;
    font-size: xx-large;
`;

const NextMove = styled.h3`
    position: fixed;
    bottom: 0.5em;
    left: 1em;
    color: bisque;
`;

const GameOver = styled.h1`
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translate(-50%, 0%);
    color: red;
    background-color: #f5deb37a;
    border-radius: 6px;
`;

const board = Array(h)
    .fill('')
    .map((x) => Array(w).fill(''));

function App() {
    const [nextMove, setNextMove] = useState('X');
    const [gameOver, setGameOver] = useState(false);

    const click = (i, j) => {
        if (gameOver) return;

        if (board[i][j]) return;

        board[i][j] = nextMove;

        setNextMove(nextMove === 'X' ? 'O' : 'X');
    };

    useEffect(() => {
        checkWin();
    }, [nextMove]);

    /**
     * Highlight horizontal or vertical win
     * @param {*} x
     * @param {*} i
     * @param {*} isCol
     */
    const highlightWin = (x, i, isCol) => {
        let el;
        for (let index = 0; index < WIN; index++) {
            const id = isCol ? `c_${i - index}_${x}` : `c_${x}_${i - index}`;
            el = document.getElementById(id);
            el.style.background = 'green';
        }
        setGameOver(el.textContent);
    };

    /**
     * Highlight diagonal win.
     * @param {int} row - row coordinate of last element of winning sequence (WIN of the same kind)
     * @param {int} col - column coordinate of the same
     * @param {bool} isUp - Up or Down diagonal
     */
    const highlightD_Win = (row, col, isUp) => {
        let el;
        for (let index = 0; index < WIN; index++) {
            let id;
            if (isUp) {
                id = `c_${row + index}_${col - index}`;
            } else {
                id = `c_${row - index}_${col - index}`;
            }

            el = document.getElementById(id);
            el.style.background = 'green';
        }
        setGameOver(el.textContent);
    };

    /**
     * Check horizontals or verticals
     * @param {int} x - row or column number to check
     * @param {bool} isCol - checking verticals
     */
    const checkX = (x, isCol) => {
        let totalX = 0;
        let totalO = 0;
        const lim = isCol ? h : w;

        for (let index = 0; index < lim; index++) {
            const el = isCol ? board[index][x] : board[x][index];

            if (!el) {
                totalO = 0;
                totalX = 0;
            }
            if (el === 'X') {
                totalO = 0;
                totalX += 1;
            }
            if (el === 'O') {
                totalX = 0;
                totalO += 1;
            }

            if (totalX >= WIN) {
                console.log('>> X won!');
                highlightWin(x, index, isCol);
            }

            if (totalO >= WIN) {
                console.log('>> O won!');
                highlightWin(x, index, isCol);
            }
        }
    };

    /**
     * Check Diagonals
     * @param {bool} isCol - scanning columns (horizontal edge), otherwise vertical edge.
     * @param {bool} isUp - rising left to right diagonals
     */
    const checkD = (isCol, isUp) => {
        for (let x = 0; x < (isCol ? w : h); x++) {
            let totalX = 0;
            let totalO = 0;
            for (let i = 0; true; i++) {
                let row;
                if (isUp) {
                    row = isCol ? h - 1 - i : x - i;
                } else {
                    row = isCol ? i : x + i;
                }
                const col = isCol ? x + i : i;

                if (row < 0 || row >= h || col < 0 || col >= w) break;

                const el = board[row][col];

                if (!el) {
                    totalO = 0;
                    totalX = 0;
                }
                if (el === 'X') {
                    totalO = 0;
                    totalX += 1;
                }
                if (el === 'O') {
                    totalX = 0;
                    totalO += 1;
                }

                if (totalX >= WIN) {
                    console.log('>> X won!');
                    highlightD_Win(row, col, isUp);
                }

                if (totalO >= WIN) {
                    console.log('>> O won!');
                    highlightD_Win(row, col, isUp);
                }
            }
        }
    };

    const checkWin = async () => {
        // Check verticals
        for (let c = 0; c < w; c++) {
            checkX(c, true);
        }
        // Check horizontals
        for (let r = 0; r < h; r++) {
            checkX(r);
        }

        // Check diagonals Up
        checkD(false, true);
        checkD(true, true);

        // Check diagonals Down
        checkD();
        checkD(true);
    };

    return (
        <>
            <OutterDiv className='App'>
                <img width='100%' src={'./castle.jpeg'} alt='' />
                {!gameOver && <NextMove>{`Next move: ${nextMove}`}</NextMove>}
                <InnerDiv>
                    <table>
                        <tbody>
                            {board.map((el, i) => {
                                return (
                                    <tr key={i}>
                                        {el.map((t, j) => (
                                            <Td
                                                id={`c_${i}_${j}`}
                                                key={j}
                                                onClick={() => click(i, j)}
                                            >
                                                {board[i][j]}
                                                {/* {i},{j} */}
                                            </Td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </InnerDiv>
            </OutterDiv>
            {gameOver && <GameOver>{gameOver} Wins!</GameOver>}
        </>
    );
}

export default App;
