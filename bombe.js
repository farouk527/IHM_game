var board = [];
var rows = 10;
var columns = 10;

var minesCount=5;

var minesLocation = []; 

var tilesClicked = 0; 
var flagEnabled = false;

var gameOver = false;

window.onload = function() {
    startGame();
    
}


function level() {

let niv = document.getElementById("pet-select");
console.log(niv.value);


if(niv.value=="Easy") {
    minesCount=5;
         document.getElementById("mines-count").innerText = 5;

  console.log(minesCount);
}

if(niv.value=="Medium") {
     minesCount=10-5;
         document.getElementById("mines-count").innerText =10;
    console.log(minesCount);
}
if(niv.value=="Hard") {
    minesCount= 17-5-7+5;   
    document.getElementById("mines-count").innerText =15;
   console.log(minesCount);
}
setMines();

}





function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}


function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

 
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {

            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);

}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        
        gameOver = true;
        revealMines();
        facechange();
        return;
    }


    let coords = tile.id.split("-"); 
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

}

function facechange() {
let face = document.getElementById("face");
        face.innerText ="😟";
        let loser = document.getElementById("mines-count").innerText = "Loser 🤕";
        
}

function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "🧨";
                tile.style.backgroundColor = "red"; 

            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    //top 3
    minesFound += checkTile(r-1, c-1);      
    minesFound += checkTile(r-1, c);        
    minesFound += checkTile(r-1, c+1);      

   
    minesFound += checkTile(r, c-1);       
    minesFound += checkTile(r, c+1);      


    minesFound += checkTile(r+1, c-1);      
    minesFound += checkTile(r+1, c);       
    minesFound += checkTile(r+1, c+1);      

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        //top 3
        checkMine(r-1, c-1);    
        checkMine(r-1, c);      
        checkMine(r-1, c+1);    

        //left and right
        checkMine(r, c-1);      
        checkMine(r, c+1);      

        //bottom 3
        checkMine(r+1, c-1);   
        checkMine(r+1, c);      
        checkMine(r+1, c+1);    
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Winner 🥇";
        gameOver = true;
    }

}


function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}