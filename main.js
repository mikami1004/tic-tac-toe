const scenetop = document.querySelector("#top");
const sceneend = document.querySelector("#end");
const start = document.querySelector("#start");
const start2 = document.querySelector("#start2");
const start3 = document.querySelector("#start3");
const start4 = document.querySelector("#start4");
const scenedisplay = document.querySelector("#display");
let field = document.querySelectorAll(".field");
let turn = document.querySelector("h2");
let judgedisplay = document.querySelector("#judge-display");
let game = document.querySelector("#game");

let board = Array(9); // 盤面の配列 1=player, 2=comquter
let winflag = true; // 勝敗が決まったらfalseに
let count = 0; // 偶数なら先手の手番、基数なら後手の手番

/*
0 1 2
3 4 5
6 7 8
*/
const win_patterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

init();
function init() {
    start.addEventListener('click', playingfirst, false);
    start2.addEventListener('click', playingsecond, false);
}

function changescene(hiddenscene, visiblescene) {
    hiddenscene.classList.add("is-hidden");
    hiddenscene.classList.remove("is-visible");
    visiblescene.classList.add("is-visible");
    visiblescene.classList.remove("is-hidden");
}

function playingfirst() {
    changescene(scenetop, scenedisplay);
    player();
}
function playingsecond() {
    changescene(scenetop,scenedisplay);
    count = 3;
    turn.textContent = "コンピューターの番です";
    com();
    player();
}

function turn_action() {
    if(count % 2 == 0) {
        turn.textContent = "コンピューターの番です";
    }else {
        turn.textContent = "あなたの番です";
    }
    Judgement();
    count++;
}

// マスがクリックされた時の処理
function player() {
    for(let i=0; i<field.length; i++) {
        field[i].onclick = () => {
            if(board[i] == undefined) {
                field[i].style.backgroundColor = "pink";
                board[i] = 1;
                turn_action();
                if(winflag) {
                    com();
                }
            }
        }
    }
}

// コンピューター側の手
function com() {
    game.classList.add('pointer-none');
    // コンピューターが後手の場合の一手目
    if(board[4] == 1 && count == 1) { // 真ん中が空いていないかつ後手の一手目
        drawingpiece(0);
        return;
    }else if(count == 1) { // 真ん中空いているかつ後手の一手目
        drawingpiece(4);
        return;
    }
    // 二手目
    if(count > 2) {
        for(let j=2; j>0;j--) {
            for(let i=0; i<win_patterns.length; i++) {
                let patterns = win_patterns[i];
                let square1 = (board[patterns[0]]);
                let square2 = (board[patterns[1]]);
                let square3 = (board[patterns[2]]);

                // 相手がリーチまたは自分がリーチかどうかを判定
                let x = square1 == undefined && square2 == j && square3 == j;
                let y = square1 == j && square2 == undefined && square3 == j;
                let z = square1 == j && square2 == j && square3 == undefined;

                if(x) {
                    drawingpiece(patterns[0]);
                    return;
                }else if(y) {
                    drawingpiece(patterns[1]);
                    return;
                }else if(z) {
                    drawingpiece(patterns[2]);
                    return;
                }
            }
        }
    }
    if(!count%2 == 0) { // どちらもリーチではなかった場合
        let flag = true;
        while(flag) {
            let random = Math.floor(Math.random()*board.length); // 0-8のランダムな整数を作成
            if(board[random] == undefined) {
                drawingpiece(random);
                flag = false;
            }
        }
    }
    function drawingpiece(place) {
        setTimeout(function () {
            field[place].style.backgroundColor = "skyblue";
            board[place] = 2;
            game.classList.remove('pointer-none');
            turn_action();
        }, 1000);
    }
}

// 三つそろったか判定
function Judgement() {
    for(let i=0; i<win_patterns.length; i++) {
        let patterns = win_patterns[i];
        let square1 = (board[patterns[0]]);
        let square2 = (board[patterns[1]]);
        let square3 = (board[patterns[2]]);
        let completed = square1 && square1 == square2 && square2 == square3 && square3 == square1;
        if(completed) {
            if(count%2 == 0) {
                judgetextcreate(0); // 先手の勝ち
                return;
            }else {
            judgetextcreate(1); // 後手の勝ち
            return;
            }
        }
    }
    if(board.includes(undefined) == false && winflag) {
        judgetextcreate(2);
        return;
    }

    function judgetextcreate(result) {
        let judgetext = ["先手の勝ちです","後手の勝ちです","引き分けです"];
        judgedisplay.textContent = judgetext[result];
        changescene(scenetop, sceneend);
        scenedisplay.classList.remove("is-visible");
        scenedisplay.classList.add("is-hidden");
        start3.textContent = "もう一度対戦する";
        start3.onclick = () => {document.location.reload()};
        start4.textContent = "TOPへ戻る";
        start4.onclick = () => {};
        game.classList.add("pointer-none");
        winflag = false;
        return;
    }
}
