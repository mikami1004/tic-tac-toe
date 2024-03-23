const scenetop = document.querySelector("#top");
const scenerule = document.querySelector("#rule");
const scenetrap = document.querySelector("#trap");
const sceneactive = document.querySelector("#active");
const sceneend = document.querySelector("#end");
const start = document.querySelector("#start");
const start2 = document.querySelector("#start2");
const start3 = document.querySelector("#start3");
const start4 = document.querySelector("#start4");
const scenedisplay = document.querySelector("#display");
const back = document.querySelector("#back");
let field = document.querySelectorAll(".field");
let traptext = document.querySelector("#trap-text");
let turn = document.querySelector("#turn-text");
let judgedisplay = document.querySelector("#judge-display");
let game = document.querySelector("#game");

let board = Array(9).fill(0); // 盤面の配列 1=先手, 2=後手
let winflag = true; // 勝敗が決まったらfalseに
let count = 0; // 偶数なら先手の手番、基数なら後手の手番
let delay = 2000; // 

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
    start.addEventListener('click', trap, false);
    start2.addEventListener('click', rule, false);
}

function changescene(hiddenscene, visiblescene) {
    hiddenscene.classList.add("is-hidden");
    hiddenscene.classList.remove("is-visible");
    visiblescene.classList.add("is-visible");
    visiblescene.classList.remove("is-hidden");
}
let flag=0;
function trap() {
    let masu = -1; // トラップを置くマスを保存しておく変数
    changescene(scenetop, scenetrap);
    if(flag==1) {traptext.textContent = "後手はトラップマスを指定してください";}

    for(let i=0; i<field.length; i++) {
        field[i].onclick = () => {
            if(i != masu) {
                if(flag==0) {
                    reset();
                    field[i].style.backgroundColor = "pink";
                    masu = i;
                }else {
                    reset();
                    field[i].style.backgroundColor = "skyblue";
                    masu = i;
                }
                traptext.textContent = "ここでよかったらマスをもう一度タップ";
            }else if(flag==0) {
                reset();
                board[masu]+=-1;
                traptext.textContent = "";
                flag = 1;
                trap();
            }else {
                reset();
                board[masu]+=-2;
                traptext.textContent = "";
                playstart();
            }
        }
    }
    function reset() {
        for(let i=0; i<field.length; i++) {
            field[i].style.backgroundColor = "transparent";
        }
        return;
    }
}
function playstart() {
    changescene(scenetrap, scenedisplay);
    player();
}
function rule() {
    changescene(scenetop,scenerule);
    back.addEventListener('click', () => {
        changescene(scenerule, scenetop);
    });
}

function turn_action() {
    if(count % 2 == 0) {
        turn.textContent = "後手の番です";
    }else {
        turn.textContent = "先手の番です";
    }
    // Judgement();
    count++;
}

// マスがクリックされた時の処理
async function player() {
    console.log(board);
    console.log(count);
    for(let i=0; i<field.length; i++) {
        field[i].onclick = () => {
            delay = 0;
            if(board[i]<=0) {
                if(board[i]==0) {
                    if(count%2 == 0) {
                        field[i].style.backgroundColor = "pink";
                        board[i]=1;
                    }else {
                        field[i].style.backgroundColor = "skyblue";
                        board[i]=2;
                    }
                }else if(board[i]==-3) {
                    delay = 3200;
                    if(count%2 == 0) {
                        field[i].style.backgroundColor = "pink";
                        TrapActived(1,i);
                        setTimeout(() => {
                            TrapActived(0,i);
                            board[i]=1;
                        },1800);
                    }else {
                        field[i].style.backgroundColor = "skyblue";
                        TrapActived(0,i);
                        setTimeout(() => {
                            TrapActived(1,i);
                            board[i]=2;
                        },1800);
                    }
                }else if(board[i]==-2) {
                    if(count%2 == 0) {
                        delay=1100;
                        TrapActived(1,i);
                        board[i]=2;
                    }else {
                        field[i].style.backgroundColor = "skyblue";
                    }
                }else if(board[i]==-1) {
                    if(count%2 == 0) {
                        field[i].style.backgroundColor = "pink";
                    }else {
                        delay=1100;
                        TrapActived(0,i);
                        board[i]=1;
                    }
                }
                setTimeout(() => {
                    Judgement();
                    if(winflag) {
                        turn_action();
                        player();
                    }
                },delay);
            }
        }
    }
}

// トラップマス発動
async function TrapActived(side2,i) {
    changescene(scenedisplay,sceneactive);
    let color = ["pink","skyblue"];
    let counter = side2;
    const blink = setInterval(() => {
        field[i].style.backgroundColor = color[counter%2];
        counter++;

        if(counter == side2+5) {
            clearInterval(blink);
        }
    },200);
    setTimeout(() => {
        changescene(sceneactive,scenedisplay);
        return;
    },1000);
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
            if(square1%2 == 0) {
                judgetextcreate(1); // 後手の勝ち
                winflag=false;
                return;
            }else {
            judgetextcreate(0); // 先手の勝ち
            winflag=false;
            return;
            }
        }
    }
    if(board.includes(0) == false && winflag) {
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
        start4.textContent = "";
        start4.onclick = () => {};
        game.classList.add("pointer-none");
        winflag = false;
        return;
    }
}
