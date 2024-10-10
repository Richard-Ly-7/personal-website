let board = [
    ["", new Piece(0,1,"red",false,false), "", new Piece(0,3,"red",false,false), "", new Piece(0,5,"red",false,false), "", new Piece(0,7,"red",false,false)],
    [new Piece(1,0,"red",false,false), "", new Piece(1,2,"red",false,false), "", new Piece(1,4,"red",false,false), "", new Piece(1,6,"red",false,false), ""],
    ["", new Piece(2,1,"red",false,false), "", new Piece(2,3,"red",false,false), "", new Piece(2,5,"red",false,false), "", new Piece(2,7,"red",false,false)],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "" ,"" ,"" ,"" ,""],
    [new Piece(5,0,"gray",false,false), "", new Piece(5,2,"gray",false,false), "", new Piece(5,4,"gray",false,false), "", new Piece(5,6,"gray",false,false), ""],
    ["", new Piece(6,1,"gray",false,false), "", new Piece(6,3,"gray",false,false), "", new Piece(6,5,"gray",false,false), "", new Piece(6,7,"gray",false,false)],
    [new Piece(7,0,"gray",false,false), "", new Piece(7,2,"gray",false,false), "", new Piece(7,4,"gray",false,false), "", new Piece(7,6,"gray",false,false), ""]
];

let checkerboard = document.getElementById("checkerboard");
let ctx = checkerboard.getContext("2d");
window.addEventListener("load", function(){
    drawBoard();
    drawPieces();
});

document.getElementById("checkerboard").addEventListener("click", function(event){
    let x = Math.floor(event.offsetX / 100);
    let y = Math.floor(event.offsetY / 100);
    if(board[y][x] != ""){
        let selectedPiece = getSelectedPiece();
        if(selectedPiece){
            selectedPiece.isClicked = !selectedPiece.isClicked;
        }else{
            board[y][x].isClicked = !board[y][x].isClicked;
        }
    }else{
        let selectedPiece = getSelectedPiece();
        if(selectedPiece && selectedPiece.isValidMove(y, x)){
            board[selectedPiece.row][selectedPiece.col] = "";
            selectedPiece.move(y,x);
            board[y][x] = selectedPiece;
            board[y][x].isClicked = !board[y][x].isClicked;
        }
    }
    drawBoard();
    drawPieces();
});

function Piece(rowInput, colInput, colorInput, isClickedInput, isKingInput){
    this.row = rowInput;
    this.col = colInput;
    this.color = colorInput;
    this.isClicked = isClickedInput;
    this.isKing = isKingInput;
    this.draw = function(){
        let x = 50 + this.col * 100;
        let y = 50 + this.row * 100;

        if(this.isClicked){
            ctx.beginPath();
            ctx.arc(x, y, 40, 0, 2 * Math.PI);
            ctx.fillStyle = "yellow";
            ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, 35, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();

        if(this.isKing){
            ctx.strokeStyle = "white";
            ctx.fillStyle = "white";

            ctx.beginPath();
            ctx.arc(x-10, y-10, 5, 0, 2 * Math.PI);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x+10, y-10, 5, 0, 2 * Math.PI);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, y+10, 10, 0, Math.PI);
            ctx.stroke();
        }
    }
    this.checkKing = function(){
        if(this.color === "red" && this.row === 7 || this.color === "gray" && this.row === 0){
            this.isKing = true;
        }
    }
    this.move = function(newRow, newCol){
        this.row = newRow;
        this.col = newCol;
        this.checkKing();
    }
    this.isValidMove = function(newRow, newCol){
        let isWhite = newRow % 2 === newCol % 2;
        let goingDown = newRow === this.row+1 && (newCol === this.col-1 || newCol === this.col+1);
        let goingUp = newRow === this.row-1 && (newCol === this.col-1 || newCol === this.col+1);
        let skippingDown = newRow === this.row+2 && (newCol === this.col-2 || newCol === this.col+2);
        let skippingUp = newRow === this.row-2 && (newCol === this.col-2 || newCol === this.col+2);

        if(isWhite){
            return false;
        }else if((this.isKing || this.color === "red") && goingDown && board[newRow][newCol] === ""){
            return true;
        }else if((this.isKing || this.color === "gray") && goingUp && board[newRow][newCol] === ""){
            return true;
        }else if(((this.isKing || this.color === "red") && skippingDown && board[newRow][newCol] === "") ||
                 ((this.isKing || this.color === "gray") && skippingUp && board[newRow][newCol] === "")){
            let midRow = (this.row + newRow) / 2;
            let midCol = (this.col + newCol) / 2;
            let midPiece = board[midRow][midCol];
            if(midPiece != "" && midPiece.color !== this.color){
                board[midRow][midCol] = "";
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
}


function drawBoard(){
    let isWhite = true;
    let x = 0;
    let y = 0;

    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            if(isWhite){
                ctx.fillStyle = "white";
            }else{
                ctx.fillStyle = "black";
            }
            ctx.fillRect(x, y, 100, 100);
            isWhite = !isWhite;
            x += 100;
        }
        x = 0;
        y += 100;
        isWhite = !isWhite;
    }
}

function drawPieces(){
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            if(board[i][j] != ""){
                board[i][j].draw();
            }
        }
    }

}

function getSelectedPiece(){
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j];
            if (piece != "" && piece.isClicked) {
                return piece;
            }
        }
    }
    return null;
}