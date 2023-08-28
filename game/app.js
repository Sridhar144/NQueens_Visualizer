'use strict'
const numberbox = document.getElementById("numberbox");
const slider = document.getElementById("slider");
const progressBar = document.getElementById("progress-bar")
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById("pause-button");

const queen = '<i class="fas fa-chess-queen" style="color:red"></i>';
let n, speed, tempSpeed, q, Board = 0;
// Board = 0;

// Creating array for all the possible arrangements of the N-Queen
var array, value;
let lister=[];
function valid(matrix, row, col) {
  for (var i = 0; i < row; i += 1) {
    if (col === matrix[i] || row - i === Math.abs(col - matrix[i])) {
      return false;
    }
  }

  return true;
}
let submatrix=[]
function nq(n) {
  var answer, matrix, i, placehold, row;
  i = 0;
  submatrix=[]
  let example=[]
  matrix=[]
  for (let i = 0; i < n; i++) {
    matrix.push(-1)
  }  
  row = 0;
  answer = 0;

  while (row !== -1) {
    placehold = false;

    for (var col = matrix[row] + 1; col < n; col += 1) {
      placehold = valid(matrix, row, col);

      if (placehold) {
        matrix[row] = col;
        row += 1;
        break;
      }
    }
    
    if (row === n) {
      answer += 1;
      matrix[n-1] = -1;
      row = n - 2;
    }

    if (placehold===false) {
      matrix[row] = -1;
      row -= 1;
    }
  }

  return answer + 1;
}

array = [0];

for (var i = 1; i < 9; i += 1) {

  value = nq(i);

  array.push(value);
}
console.log(array)
// Used to store the state of the boards;
let pos = {};
// let position = {};


// Setting the slider value onSlide
speed = (100 - slider.value) * 10;
tempSpeed = speed;
slider.oninput = function () {
    progressBar.style.width = this.value + "%";
    speed = slider.value;
    speed = (100 - speed) * 10;
}

class Queen {
    constructor() {
        this.position = Object.assign({}, pos);
        // this.Board = 0;
        this.uuid = [];
    }

    nQueen = async () => {
        Board = 0;
        this.position[`${Board}`] = {};
        numberbox.disabled = true;
        await q.solveQueen(Board, 0, n);
        await q.clearColor(Board);
        numberbox.disabled = false;
    }

    isValid = async (board, r, col, n) => {
        //Setting the current box color to orange
        const table = document.getElementById(`table-${this.uuid[board]}`);
        const currentRow = table.firstChild.childNodes[r];
        const currentColumn = currentRow.getElementsByTagName("td")[col];
        currentColumn.innerHTML = queen;
        // currentColumn.style.backgroundColor = "white";
        await q.delay();

        // Checking the queen in the same column
        for (let i = r - 1; i >= 0; --i) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[col];

            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#330000";
                currentColumn.innerHTML = "-"
                return false;
            }
            column.style.backgroundColor = "beige";
            await q.delay();
        }

        //Checking the upper left diagonal
        for (let i = r - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];
            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#330000";
                currentColumn.innerHTML = "-"
                return false;
            }
            column.style.backgroundColor = "beige";
            await q.delay();
        }

        // Checking the upper right diagonal
        for (let i = r - 1, j = col + 1; i >= 0 && j < n; --i, ++j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];

            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#330000";
                currentColumn.innerHTML = "-"
                return false;
            }
            column.style.backgroundColor = "beige";
            await q.delay();
        }
        return true;
    }

    clearColor = async (board) => {
        for (let j = 0; j < n; ++j) {
            const table = document.getElementById(`table-${this.uuid[board]}`);
            const row = table.firstChild.childNodes[j];
            for (let k = 0; k < n; ++k)
                (j + k) & 1
                    ? (row.getElementsByTagName("td")[k].style.backgroundColor = "white")
                    : (row.getElementsByTagName("td")[k].style.backgroundColor = "black");
        }
    }

    delay = async () => {
        await new Promise((done) => setTimeout(() => done(), speed));
    }

    solveQueen = async (board, r, n) => {
        if (r == n) {
            ++Board;
            let table = document.getElementById(`table-${this.uuid[Board]}`);
            for (let k = 0; k < n; ++k) {
                let row = table.firstChild.childNodes[k];
                row.getElementsByTagName("td")[this.position[board][k]].innerHTML = queen;
            }
            this.position[Board] = this.position[board];
            return;
        }

        for (let i = 0; i < n; ++i) {
            await q.delay();
            // console.log("outside:" + board);
            await q.clearColor(board);
            if (await q.isValid(board, r, i, n)) {
                await q.delay();
                // console.log("inside:" + board)
                await q.clearColor(board);
                let table = document.getElementById(`table-${this.uuid[board]}`);
                let row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[i].innerHTML = queen;

                this.position[board][r] = i;

                if (await q.solveQueen(board, r + 1, n))
                    await q.clearColor(board);

                await q.delay();
                board = Board;
                // console.log(this.Board)
                table = document.getElementById(`table-${this.uuid[board]}`);
                // console.log(JSON.parse(JSON.stringify(table)));
                row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[i].innerHTML = "-";

                delete this.position[`${board}`][`${r}`];
            }
        }
    }
}
function doit() {
    location.reload()
}

function button(){
    n=numberbox.value;
    n=parseInt(n)
    document.querySelector('#queens-value').innerHTML=`<h3>The number of arrngements for this input value is:</h3>`
}

playButton.onclick = async function visualise() {
    const chessBoard = document.getElementById("n-queen-board");
    const arrangement = document.getElementById("queen-arrangement");

    n = numberbox.value;
    q = new Queen();

    if (n > 8) {
        numberbox.value = "";
        alert("Queen value is too large");
        return;
    } else if (n < 1) {
        numberbox.value = "";
        alert("Queen value is too small");
        return;
    }

    // Removing all the of previous execution context
    while (chessBoard.hasChildNodes()) {
        chessBoard.removeChild(chessBoard.firstChild);
    }
    if (arrangement.hasChildNodes()) {
        arrangement.removeChild(arrangement.lastChild)
    }

    const para = document.createElement("p");
    para.setAttribute("class", "queen-info");
    para.innerHTML = `For ${n}x${n} board, ${array[n] - 1} arrangements are possible.`;
    arrangement.appendChild(para);

    //Adding boards to the Div
    if (chessBoard.childElementCount === 0) {
        for (let i = 0; i < array[n]; ++i) {
            q.uuid.push(Math.random());
            let div = document.createElement('div');
            let table = document.createElement('table');
            let header = document.createElement('h4');
            // div.setAttribute("id", `div-${100 + uuid[i]}`)
            header.innerHTML = `<h3>Combination number ${i + 1}:`
            table.setAttribute("id", `table-${q.uuid[i]}`);
            header.setAttribute("id", `paragraph-${i}`);
            chessBoard.appendChild(div);
            div.appendChild(header);
            div.appendChild(table);
        }
    }

    for (let k = 0; k < array[n]; ++k) {
        let table = document.getElementById(`table-${q.uuid[k]}`);
        for (let i = 0; i < n; ++i) {
            const row = table.insertRow(i); // inserting ith row
            row.setAttribute("id", `Row${i} `);
            for (let j = 0; j < n; ++j) {
                const col = row.insertCell(j); // inserting jth column
                (i + j) & 1
                    ? (col.style.backgroundColor = "white")
                    : (col.style.backgroundColor = "black");
                col.innerHTML = "-";
                col.style.border = "0.3px solid #373f51";
            }
        }
        await q.clearColor(k);
    }
    await q.nQueen();
};
