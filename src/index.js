import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
    
//     render() {
//       return (
//         <button className="square" onClick={ () => this.props.onClick() }>
//           {this.props.value}
//         </button>
//       );
//     }
//   }
function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {winner: squares[a], winnerRow: lines[i]};
      }
    }
    return { winner: null, winnerRow: null };
}

function Square(props) {
    return (
      <button className= {props.winner + " square"} onClick={props.onClick}>
        {props.value}
      </button>
    );
}
class Board extends React.Component {
    
    renderSquare(i) {
        const winnerClass = this.props.winnerRow && (this.props.winnerRow[0] === i ||this.props.winnerRow[1] === i ||this.props.winnerRow[2] === i)
        ? 'btn-green'
        : '';
      return <Square key={i} value={this.props.squares[i]} 
                    onClick= {()=> this.props.onClick(i)}
                    winner = {winnerClass}
                    />;
    }
    createBoard(row, col) {
        const board = [];
        let cnt = 0;
    
        for (let i = 0; i < row; i += 1) {
          const columns = [];
          for (let j = 0; j < col; j += 1) {
            columns.push(this.renderSquare(cnt++));
          }
          board.push(<div key={i} className="board-row">{columns}</div>);
        }
    
        return board;
      }
    render() {
        
      return (
        <div>
          {this.createBoard(3,3)}
        </div>
      );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          history: [{
            squares: Array(9).fill(null),
          }],
          xIsNext: true,
          stepNumber: 0,
        };
    }
    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
    }
    
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
          return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
            squares: squares,
            currentLocation: [parseInt(i/3), parseInt(i%3)],
            step: history.length
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
        });
    }
    sortMoves() {
        this.setState({
          history: this.state.history.reverse(),
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const {winner, winnerRow } = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const classButton = move === this.state.stepNumber ? 'btn-green' : '';
            console.log(step);
            const currentLocation = step.currentLocation ? `(${step.currentLocation[0]}, ${step.currentLocation[1]})` : '123';
            console.log(currentLocation);
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
              <li key={move}> 
                <button className={classButton} onClick={() => this.jumpTo(move)}>{desc} {currentLocation}</button>
              </li>
            );
          });

        let status;
        
        if (winner) {
          status = 'Winner: ' + winner;
        } else if(history.length === 10){
            status = 'Draw. No one won';
        } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} winnerRow={winnerRow} onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
          <button className="button" onClick={() => this.sortMoves()}>
                Sort moves
            </button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
