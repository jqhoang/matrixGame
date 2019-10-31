let state  = 
{
    numberQuestionTiles: 5,
    score: 0,
    rows: 5,
    columns: 5,
    correctTiles: [],
    selectedTiles: 0,
    oneWrong: false,
    ready: false


}

//TODO add terminate button functionality
//TODO server stuff
//TODO strings file
//TODO file heiarchy

function initiate ()
{
    let matrix = generateMatrix(state.rows, state.columns);
    matrix = generateQuestionLocations(matrix, state.numberQuestionTiles);
    generateBoard();
    generateMenu();
    generateMatrixContainerBackground();
    generateMatrixContainer();
    generateTiles(matrix);
    generateStartButton(matrix);
}

function generateBoard ()
{
    let board = document.createElement("div");
    board.setAttribute("id", "board");
    document.body.appendChild(board);
}

function generateMenu ()
{
    let tilesBox = document.createElement("div");
    tilesBox.setAttribute("id", "tilesBox");
    tilesBox.innerText = "0";
    document.getElementById("board").appendChild(tilesBox);

    let scoreBox = document.createElement("div");
    scoreBox.setAttribute("id", "scoreBox");
    scoreBox.innerText = "0";
    document.getElementById("board").appendChild(scoreBox);
}

function generateMatrixContainerBackground () {
    let matrixContainerBackground = document.createElement("div");
    matrixContainerBackground.setAttribute("id", "matrixContainerBackground");
    document.getElementById("board").appendChild(matrixContainerBackground);
}

function generateMatrixContainer ()
{
    let matrixContainer = document.createElement("div");
    matrixContainer.setAttribute("id", "matrixContainer");
    document.getElementById("matrixContainerBackground").appendChild(matrixContainer);
}

function generateMatrix (rows, columns)
{
    let matrix = [rows];

    for(let row = 0; row < rows; row++)
    {
        matrix[row] =[columns];
        for(let column = 0; column < columns; column++)
        {
            matrix[row][column] = false;
        }
    }
    return matrix;
}

function generateTiles (matrix)
{
    let id = 1;
    for(let row = 0; row < matrix.length; row++)
    {
        for(let column = 0; column < matrix[0].length; column++)
        {
            tile = document.createElement("div");
            tile.setAttribute("id", id);
            if(!matrix[row][column])
            {
                tile.setAttribute("class", "wrongTile");
                tile.setAttribute("onClick", "wrongTileOnClick(this)");
            } else {
                tile.setAttribute("class", "correctTile");
                tile.setAttribute("onClick", "correctTileOnClick(this)");
            }
            document.getElementById("matrixContainer").appendChild(tile);
            id = id + 1;
        }
    }
}

function generateQuestionLocations (matrix, numTiles)
{
    let counterNumTiles = 0;
    while(counterNumTiles != numTiles)//while(counterNumTiles != numTiles)
    {
        //Generate random row and column
        let randRow = Math.floor(Math.random() * matrix.length);
        let randColumn = Math.floor(Math.random() * matrix[0].length);

        //Only increment if position is not already chosen
        if(!matrix[randRow][randColumn])
        {
            matrix[randRow][randColumn] = true;
            state.correctTiles.push(randRow * state.columns + randColumn + 1);
            counterNumTiles = counterNumTiles + 1;
        }
    }
    return matrix;
}

function generateStartButton (matrix)
{
    let startButton = document.createElement("div");
    startButton.setAttribute("id", "startButton");
    startButton.innerText = "START GAME";//TODO make part of string file
    startButton.setAttribute("onClick", "startButtonOnClick()");
    document.getElementById("board").appendChild(startButton);
}

function deleteStartButton ()
{
    document.getElementById("startButton").parentNode.removeChild(document.getElementById("startButton"));
}

function generateTerminateButton () {
    let terminateButton = document.createElement("div");
    terminateButton.setAttribute("id", "startButton");
    terminateButton.innerText = "END GAME";
    terminateButton.setAttribute("onClick", "terminateButtonOnClick()");
    document.getElementById("board").appendChild(terminateButton);
}

function correctTileOnClick (correctTile) {
    //Block user input if program is generating/rotating matrix
    if(state.ready == true)
    {
        correctTile.style.webkitTransform = "rotateY(180deg)";
        correctTile.style.backgroundColor = "#68B44D";

        state.selectedTiles = state.selectedTiles + 1;
        updateTilesSelected();
        updateScore(1);
        if(state.selectedTiles == state.numberQuestionTiles)
        {
            window.setTimeout(function() {
                newRound();
            }, 1500);
        }
    }
}

function wrongTileOnClick (wrongTile) {
    //Block user input if program is generating/rotating matrix
    if(state.ready == true) {
        //Used in deciding new rounds matrix changes
        state.oneWrong = true;

        wrongTile.style.webkitTransform = "rotateY(180deg)";
        wrongTile.style.backgroundColor = "#BF6F2F";
        
        state.selectedTiles = state.selectedTiles + 1;
        updateTilesSelected();
        updateScore(-1);
        if(state.selectedTiles == state.numberQuestionTiles)
        {
            window.setTimeout(function() {
                newRound();
            }, 1500);
        }
    }
}

function startButtonOnClick () {
    displayQuestions();
    deleteStartButton();
    generateTerminateButton();
}

async function terminateButtonOnClick() {
    let score = document.getElementById("scoreBox").innerText;
    const intermediary = {
        body: score,
        method: "POST"
    }
    response = await fetch('sendScore', intermediary);
}


function displayQuestions () {
    for(let idIndex = 0; idIndex <  state.correctTiles.length; idIndex++){
        let id = state.correctTiles[idIndex];
        correctTile = document.getElementById(id);
        correctTile.style.backgroundColor = "#68B44D";
        correctTile.style.webkitTransform = "rotateY(180deg)";
        window.setTimeout(function (){
            hideQuestions();
            window.setTimeout(function() {
                rotateMatrix();
                //After rotation has completed, user input is accepted
                state.ready = true;
            }, 2000);
        }, 2000);
    }
    console.log(state.correctTiles);
}

function hideQuestions ()
{
    for(let idIndex = 0; idIndex <  state.correctTiles.length; idIndex++){
        let id = state.correctTiles[idIndex];
        correctTile = document.getElementById(id)
        correctTile.style.backgroundColor = "#4C382D";
        correctTile.style.webkitTransform = "rotateY(-180deg)";
    }
}

function rotateMatrix () {
    let choice = Math.floor(Math.random() * 2);
    if(choice == 1) {
        document.getElementById("matrixContainer").style.transform = "rotate(90deg)";
    } else {
        document.getElementById("matrixContainer").style.transform = "rotate(-90deg)";
    }
}

function newRound () {

    //Block user input while a new round is generating
    state.ready = false;

    //Make a new matrix based on what the users result was
    psuedoRandomUpdateState();

    //Call functions to set up next round
    let newMatrix = updateMatrix(); 
    updateTilesSelected();
    updateMatrixContainer();
    generateTiles(newMatrix);
    displayQuestions();
}

function updateMatrix () {

    //Reset the game state
    state.correctTiles = [];
    state.selectedTiles = 0;
    state.oneWrong = false;

    //Make a new 2d representation of the matrix
    let newMatrix = generateMatrix(state.rows, state.columns);
    newMatrix = generateQuestionLocations(newMatrix, state.numberQuestionTiles);

    return newMatrix;
}

function updateMatrixContainer () {
    //Delete old matrix
    let deletedMatrix = document.getElementById("matrixContainer");
    deletedMatrix.parentNode.removeChild(deletedMatrix);

    //Calculate appropriate size of new container
    let margin = 3.5;
    let defaultX = state.columns * 50;
    let defaultY = state.rows * 50;
    let xGaps = state.columns * 2;
    let yGaps = state.rows * 2;
    let totalX = (margin * xGaps) + defaultX;
    let totalY = (margin * yGaps) + defaultY;

    //Create new matrix
    let currentMatrixContainer = document.createElement("div");
    currentMatrixContainer.setAttribute("id", "matrixContainer");
    currentMatrixContainer.style.height = "" + totalY + "px";
    currentMatrixContainer.style.width = "" + totalX + "px";
    document.getElementById("matrixContainerBackground").appendChild(currentMatrixContainer);
}

function psuedoRandomUpdateState () {
    //Make a new matrix based on what the users result was
    if(state.oneWrong) { //If the user failed
        if(state.rows > state.columns) //Ensure matrix does not become heavily unbalanced
        {
            state.rows = state.rows - 1;
        } else if (state.rows < state.columns) {
            state.columns = state.columns - 1;
        } else if (state.numberQuestionTiles == 1) {
            //Do not decrease to 0 tiles
        }
        else {
            let choice = Math.floor(Math.random() * 3);
            if(choice == 0) 
            {
                state.rows = state.rows - 1;
            }
            if(choice == 1) 
            {
                state.columns = state.columns - 1;
            }
            if(choice == 2) 
            {
                state.numberQuestionTiles = state.numberQuestionTiles - 1;
            }
        }
    } else { //If the user succeeded
        if(state.rows > state.columns) //Ensure matrix does not become heavily unbalanced
        {
            state.columns = state.columns + 1;
        } else if (state.rows < state.columns) {
            state.rows = state.rows + 1;
        } else {
            let choice = Math.floor(Math.random() * 3);
            //Do not let question tiles exceed matrix capacity
            let tileCheck = state.numberQuestionTiles == state.rows * state.columns;
            if(choice == 2 && !tileCheck) 
            {
                state.numberQuestionTiles = state.numberQuestionTiles + 1;
            }
            else if(choice == 0) 
            {
                state.rows = state.rows + 1;
            }
            else
            {
                state.columns = state.columns + 1;
            }
        }
    }
}

function updateScore (addedValue) {
    //If increase is true increase the score, otherwise decrease
    let scoreBox = document.getElementById("scoreBox");
    state.score = state.score + addedValue ;
    scoreBox.innerText = state.score.toString();
}

function updateTilesSelected () {
    let tilesBox = document.getElementById("tilesBox");
    tilesBox.innerText = state.selectedTiles;
}
