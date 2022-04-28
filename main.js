//REFERENCE FOR NUMBERKEYS https://www.oreilly.com/library/view/javascript-dhtml/9780596514082/apb.html//
const KEY_RIGHT = 39;
const KEY_LEFT = 37;

//DECLARING HEIGHT DIMENSIONS FOR GAME WINDOW//
const GAME_WIDTH = 800; //changed dimension from 800 to allow for character to return//
const GAME_HEIGHT = 600;

//STORES KEY PARAMETERS OF GAME//(POSITION OF GAME CHARACTTER)//
const STATE = {
    x_pos : 0,
    y_pos : 0,
    move_left : false,
    move_right : false,
    character_width : 100,
    enemy_width: 50,
    enemies: [],
    number_of_enemies: 8,

}


// General purpose functions
//position takes argument the DOM Element(image of character), and x and y coordinate of character
function setPosition($element, x, y) {
    $element.style.transform = `translate(${x}px, ${y}px)`;
  }

  //Takes as its argument DOM element and a width, scales image in window//
function setSize($element, width) {
    $element.style.width = `${width}px`;
    $element.style.height = "auto";
  }
////  one boundary for right one for left side of screeen//
function boundary(x){
    if(x >= GAME_WIDTH- STATE.character_width)
        STATE.x_pos = GAME_WIDTH-STATE.character_width;
        return STATE.x_pos
    }
function boundary1(x){
    if (x <= 0){
        STATE.x_pos = 0;
        return 0
      } else {
        return x;
      }
}

// Player/Character
function createPlayer($container) {
    STATE.x_pos = GAME_WIDTH / 2.35;
    STATE.y_pos = GAME_HEIGHT - 97;
    const $player = document.createElement("img");
    $player.src = "images/owl.png";
    $player.className = "player";
    $container.appendChild($player);
    setPosition($player, STATE.x_pos, STATE.y_pos);
    setSize($player, STATE.character_width);
  }

function updatePlayer(){
    if(STATE.move_left){
        STATE.x_pos -= 5;
    } if(STATE.move_right){
        STATE.x_pos += 5;
    } 
    /// boundary stops it from right, boundary1 stop it at left.!!!//
    const $player = document.querySelector(".player");
    setPosition($player, boundary(STATE.x_pos), STATE.y_pos);
    setPosition($player, boundary1(STATE.x_pos), STATE.y_pos);
}


// Enemies
function createEnemy($container, x,y){
    const $enemy = document.createElement("img");
     $enemy.src = "images/fallinbaby.png";
     $enemy.className = "enemy";
     $container.appendChild($enemy);
     const enemy = {x, y, $enemy}
     STATE.enemies.push(enemy);
     setSize($enemy, STATE.enemy_width);
     setPosition($enemy, x, y);
}

function updateEnemies($container){
  const dx = Math.sin(Date.now()/1000)*40;
  const dy = Math.cos(Date.now()/1000)*30;
  const enemies = STATE.enemies;
  for (let i = 0; i < enemies.length; i++){
    const enemy = enemies[i];
    var a = enemy.x + dx;
    var b = enemy.y + dy;
    setPosition(enemy.$enemy, a, b);
  }
}

//1st for loop creates first row of enemies, x and y coordinates in firstn and secon row different//
function createEnemies($container){
  for (let i = 0; i<= STATE.number_of_enemies/2; i++){
    createEnemy($container, i*80, 100);
  }
}
  //KEY Presses
//sets state variable to move right to true, set state variable to true if left key pressed//
//add move left and right state variables to CONST: State

function KeyPress(event) {
    if (event.keyCode === KEY_RIGHT) {
        STATE.move_right = true;
      console.log("right key is pressed")
    } else if (event.keyCode === KEY_LEFT) {
        STATE.move_left = true;
      console.log("left key is pressed")
    }
  }

function KeyRelease(event) {
    if (event.keyCode === KEY_RIGHT) {
        STATE.move_right = false;
      } else if (event.keyCode === KEY_LEFT) {
        STATE.move_left = false;
      }
    }

//MAIN UPDATE FUNCTION
//UPDATES PLAYER/ MOVE PLAYER LEFT AND RIGHT AND PAINTS CANVAS EVERY SINGLE FRAME
function update(){
    updatePlayer();
    updateEnemies();

    window.requestAnimationFrame(update)
}

  //INITIALIZING GAME//
  //SELECTING CONTAINER TO CREATE GAME, IN .main  DIV, SET CONTAINER EQUAL TO NODE .main
const $container = document.querySelector(".main");
createPlayer($container);
createEnemies($container);

//Event Listeners
window.addEventListener("keydown", KeyPress);
window.addEventListener("keyup", KeyRelease);

//CALL UPDATE FUNCTION: RUN GAME
update();


