//writer oliheavi(olih) 2020/8/25

let cvs_width = 912;
let cvs_height = 624;
let field_width=8;
let field_height=8;

let field_left = 24;
let field_up = 24;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var field;

field = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 4, 1, 0, 0, 0],
    [0, 1, 2, 3, 5, 1, 0, 0]
];

var click_x = -1, click_y = -1, click_flg = false;

function make_field(){
    for(var y=3;y<8;y++){
        for(var x=0;x<8;x++){
            field[y][x]=randint(1,8);
        }
    }
}

window.addEventListener("click", function () {
    let px = event.clientX;
    let py = event.clientY;

    let obj = document.elementFromPoint(px,py);
    let objx = obj.getBoundingClientRect().left;
    let objy = obj.getBoundingClientRect().top;

    click_x=px-objx;
    click_y=py-objy;
    click_flg=1;
});

window.addEventListener('load', function () {
    document.getElementById("canvas").addEventListener('touchend', logPosition);
});

function logPosition(event) {

    if (event.changedTouches[0]) {
        // ページ
        let px=event.changedTouches[0].clientX;
        let py=event.changedTouches[0].clientY;

        let obj = document.elementFromPoint(px, py);
        let objx = obj.getBoundingClientRect().left;
        let objy = obj.getBoundingClientRect().top;

        click_x = px - objx;
        click_y = py - objy;
        click_flg = 1;
    }
}


function display_message(){
    window.alert("縦・横・斜めに3つブロックを揃えると消える\n2行目より上のブロックを全て消せばクリア\nクリック回数が少ないほどランクが高くなる");
}

function draw_frame(){
    context.fillStyle = "white";
    for (var y = 0; y <= field_width; y++) {
        context.fillRect(field_left + y * 72, field_up, 1, field_height * 72);
    }
    for (var x = 0; x <= field_height; x++) {
        context.fillRect(field_left, field_up + x * 72, field_width * 72, 1);
    }
}

function draw_block(){
    delete_block();
    for (var y = 0; y < field_height; y++) {
        for (var x = 0; x < field_width; x++) {
            if (field[y][x] != 0) {
                decide_color(field[y][x]);
                context.fillRect(field_left + x * 72 + 1, field_up + y * 72 + 1, 72 - 2, 72 - 2);
            }
        }
    }
}

function decide_color(color_number){
    if (color_number == 1) {
        context.fillStyle = "red";
    } else if (color_number == 2) {
        context.fillStyle = "green";
    } else if (color_number == 3) {
        context.fillStyle = "blue";
    } else if (color_number == 4) {
        context.fillStyle = "yellow";
    } else if (color_number == 5) {
        context.fillStyle = "purple";
    } else if (color_number == 6) {
        context.fillStyle = "white";
    } else if (color_number == 7) {
        context.fillStyle = "gray";
    } else if (color_number == 8){
        context.fillStyle = "skyblue";
    }
}

function delete_block() {
    for (var y = 0; y < field_height; y++) {
        for (var x = 0; x < field_width; x++) {
            context.clearRect(field_left + x * 72 + 1, field_up + y * 72 + 1, 72 - 2, 72 - 2);
        }
    }
}

function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function fall_block(){
    var flag=false;
    for(var y=6;y>=0;y--){
        for(var x=0;x<8;x++){
            if(field[y][x]!=0 && field[y+1][x]==0){
                field[y+1][x]=field[y][x];
                field[y][x]=0;
                flag=true;
            }
        }
    }

    return flag;
}

function sweep_block(){
    var cnt=0;
    for(var y=0;y<8;y++){
        for(var x=0;x<8;x++){
            if(field[y][x]==8){
                field[y][x]=0;
                cnt++;
            }
        }
    }

    return cnt;
}

var ins=[
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]

]

function check_three(){
    for(var y=0;y<8;y++){
        for(var x=0;x<8;x++){
            ins[y][x]=field[y][x];
        }
    }
    for(var y=1;y<7;y++){
        for(var x=0;x<8;x++){
            if(ins[y][x]!=0){
                if(ins[y-1][x]==ins[y][x] && ins[y][x]==ins[y+1][x]){
                    field[y-1][x]=field[y][x]=field[y+1][x]=8;
                }
            }
        }
    }
    for(var y=0;y<8;y++){
        for(var x=1;x<7;x++){
            if(ins[y][x]!=0){
                if(ins[y][x-1]==ins[y][x] && ins[y][x]==ins[y][x+1]){
                    field[y][x-1]=field[y][x]=field[y][x+1]=8;
                }
            }
        }
    }
    for(var y=1;y<7;y++){
        for(var x=1;x<7;x++){
            if(ins[y][x]!=0){
                if(ins[y-1][x-1]==ins[y][x] && ins[y][x]==ins[y+1][x+1]){
                    field[y-1][x-1]=field[y][x]=field[y+1][x+1]=8;
                }
            }
        }
    }
    for(var y=1;y<7;y++){
        for(var x=1;x<7;x++){
            if(ins[y][x]!=0){
                if(ins[y-1][x+1]==ins[y][x] && ins[y][x]==ins[y+1][x-1]){
                    field[y-1][x+1]=field[y][x]=field[y+1][x-1]=8;
                }
            }
        }
    }
}

function game_clear(){
    var flag=true;
    for(var x=0;x<8;x++){
        if(field[5][x]!=0){
            flag=false;
        }
    }
    return flag;
}

function game_over(){
    var flag=true;
    for(var x=0;x<8;x++){
        if(field[0][x]==0){
            flag=false;
        }
    }
    return flag;
}

var process=2,click_counter=0,next_block=randint(1,8);
var flag_cnt=true;
var first_flg=true;
var time_cnt=0;

requestAnimationFrame(main);
function main(){
    
    if(time_cnt!=5){
        time_cnt++;
    } else {
        time_cnt = 0;
        context.clearRect(0, 0, cvs_width, cvs_height);

        if (first_flg == true) {
            first_flg = false;
            make_field();
            draw_frame();
            delete_block();
            draw_block();

            display_message();
        }else{
            draw_frame();
            delete_block();
            draw_block();
        }

        context.strokeStyle = "white";
        context.fillStyle = "white";
        context.font = "bold 25pt sans-serif";
        context.textAlign = "center";
        context.fillText("NEXT BLOCK", 752, 24 + 72);
        context.fillText("COUNT : "+click_counter,752,24+72*5);
        
        if (process == 1) {
            if (fall_block() == false) {
                process = 2;
            }
            draw_block();
        } else if (process == 2) {
            check_three();
            draw_block();
            process = 3;
        } else if (process == 3) {
            var deleted = sweep_block();
            if (deleted != 0) {
                process = 1;
            } else {
                if (game_over() == false) {
                    if (game_clear() == true) {
                        process = 5;
                    } else {
                        process = 4;
                    }
                } else {
                    process = 6;
                }
            }
            draw_block();

        } else if (process == 4) {
            var cursor_x = Math.floor((click_x - 24) / 72);
            var cursor_y = 0;

            if (24 <= click_x && click_x < 24 + 72 * 8 && 24 <= click_y && click_y < 24 + 72 * 8) {
                if (click_flg == true && field[cursor_y][cursor_x] == 0) {
                    click_counter++;
                    field[cursor_y][cursor_x] = next_block;
                    next_block = randint(1, 8);
                }
                process = 1;
            }

            click_flg = false;

            context.clearRect(752 + 1 - 36, 168 + 1 - 36, 72 - 2, 72 - 2);
            decide_color(next_block);
            context.fillRect(752 + 1 - 36, 168 + 1 - 36, 72 - 2, 72 - 2);

            draw_block();
        } else if (process == 5) {
            context.strokeStyle = "white";
            context.fillStyle = "white";
            context.font = "bold 30pt sans-serif";
            context.textAlign = "center";
            context.fillText("GAME CLEAR!", 24 + 72 * 4, 24 + 72 * 3);

            var string = "YOU CLICKED " + click_counter + " TIMES";
            context.fillText(string, 24 + 72 * 4, 24 + 72 * 4);

            var rank;
            if(click_counter<=30){
                rank="S";
            }else if(click_counter<=50){
                rank="A";
            }else if(click_counter<=80){
                rank="B";
            }else if(click_counter<=110){
                rank="C";
            }else if(click_counter<=140){
                rank="D";
            }else{
                rank="E";
            }

            context.fillText("YOUR RANK : " + rank, 24 + 72 * 4, 24 + 72 * 5);

        } else if (process == 6) {
            context.strokeStyle = "black";
            context.fillStyle = "black";
            context.font = "bold 30pt sans-serif";
            context.textAlign = "center";
            context.fillText("GAME OVER...", 24 + 72 * 4, 24 + 72 * 4);
        }

        context.clearRect(752 + 1 - 36, 168 + 1 - 36, 72 - 2, 72 - 2);
        decide_color(next_block);
        context.fillRect(752 + 1 - 36, 168 + 1 - 36, 72 - 2, 72 - 2);
    }
    requestAnimationFrame(main);
}