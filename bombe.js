var board = [];
var lignes = 10;
var colonnes = 10;

var compteur=5;

var bombelocal = []; 

var carreclic = 0; 
var flagEnabled = false;

var gameOver = false;
var timer ;
var value = 0;


window.onload = function() {
    startGame();
}

function changeValue() {
    document.getElementById("demo").innerHTML = ++value;
  }
  
  var timerInterval = null;
  function start() {
    stop(); 
   timerInterval = setInterval(changeValue, 1000);  
  }
  var stop = function() {
    clearInterval(timerInterval);
  }
 


function level() {

let niv = document.getElementById("pet-select");
console.log(niv.value);


if(niv.value=="Easy") {
    compteur=5;
         document.getElementById("mines-count").innerText = "timer :"+5 ;

  console.log(compteur);
}

if(niv.value=="Medium") {
    compteur=10-5;
         document.getElementById("mines-count").innerText =10;
    console.log(compteur);
}
if(niv.value=="Hard") {
    
    compteur= 17-5-7+5;   
    document.getElementById("mines-count").innerText =15;
   console.log(compteur);
}
setMines();

}





function setMines() {
    let minesLeft = compteur;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * lignes);
        let c = Math.floor(Math.random() * colonnes);
        let id = r.toString() + "-" + c.toString();

        if (!bombelocal.includes(id)) {
            bombelocal.push(id);
            minesLeft -= 1;
        }
    }
}


function startGame() {
    document.getElementById("mines-count").innerText = compteur;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();
   
 
    for (let r = 0; r < lignes; r++) {
        let colonne = [];
        for (let c = 0; c < colonnes; c++) {

            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickcarre);
            document.getElementById("board").append(tile);
            colonne.push(tile);
        }
        board.push(colonne);
    }

    console.log(board);

}
// fonction pour indiquer le couleur de "flag-button" selon la varible flagEnabled(etat de boutton)
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
//fonction qui décide l'etat de jeu aprés le click de bouton 
function clickcarre() {
    start();

    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🎌";
        }
        else if (tile.innerText == "🎌") {
            tile.innerText = "";
        }
        return;
    }

    if (bombelocal.includes(tile.id)) {
        
        gameOver = true;
        revealMines();
        facechange();
        stop();
        return;
    }


    let coords = tile.id.split("-"); 
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkBombe(r, c);

}
// fonction qui change le visage selon l'etat de jeu
function facechange() {
let face = document.getElementById("face");
        face.innerText ="😟";
        let loser = document.getElementById("mines-count").innerText = "Loser 🤕";
        
}

function revealMines() {
    for (let r= 0; r < lignes; r++) {
        for (let c = 0; c < colonnes; c++) {
            let tile = board[r][c];
            if (bombelocal.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red"; 

            }
        }
    }
}
//fonction qui consulte les bombes, si une 
function checkBombe(r, c) {

    if (r < 0 || r >= lignes || c < 0 || c >= colonnes) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    carreclic += 1;

    let minesFound = 0;

    minesFound += checkcarre(r-1, c-1);      
    minesFound += checkcarre(r-1, c);        
    minesFound += checkcarre(r-1, c+1);      

   
    minesFound += checkcarre(r, c-1);       
    minesFound += checkcarre(r, c+1);      


    minesFound += checkcarre(r+1, c-1);      
    minesFound += checkcarre(r+1, c);       
    minesFound += checkcarre(r+1, c+1);      

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        checkBombe(r-1, c-1);    
        checkBombe(r-1, c);      
        checkBombe(r-1, c+1);    

        checkBombe(r, c-1);      
        checkBombe(r, c+1);      

        checkBombe(r+1, c-1);   
        checkBombe(r+1, c);      
        checkBombe(r+1, c+1);    
    }

    if (carreclic == lignes * colonnes - compteur) {
        document.getElementById("mines-count").innerText = "Winner 🥇";
        gameOver = true;
        stop();

    }

}


function checkcarre(r, c) {
    if (r < 0 || r >= lignes || c < 0 || c >= colonnes) {
        return 0;
    }
    if (bombelocal.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}