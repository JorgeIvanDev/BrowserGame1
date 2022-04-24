//REFERENCE FOR NUMBERKEYS https://www.oreilly.com/library/view/javascript-dhtml/9780596514082/apb.html//
const KEY_RIGHT = 39;
const KEY_LEFT = 37;

//DECLARING HEIGHT DIMENSIONS FOR GAME WINDOW//
const GAME_WIDTH = 820; //changed dimension from 800 to allow for character to return//
const GAME_HEIGHT = 600;

//STORES KEY PARAMETERS OF GAME//(POSITION OF GAME CHARACTTER)//
const STATE = {
    x_pos : 0,
    y_pos : 0,
    move_left : false,
    move_right : false,
    character_width : 50
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

function bound(x){
    if (x <= 0){
        STATE.x_pos = 0;
        return STATE.x_pos
      } else {
        return x;
      }
    }


// Player/Character
function createPlayer($container) {
    STATE.x_pos = GAME_WIDTH / 2.35;
    STATE.y_pos = GAME_HEIGHT - 150;
    const $player = document.createElement("img");
    $player.src = "images/character.png";
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
    const $player = document.querySelector(".player");
    setPosition($player, bound(STATE.x_pos), STATE.y_pos);
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

    window.requestAnimationFrame(update)
}

  //INITIALIZING GAME//
  //SELECTING CONTAINER TO CREATE GAME, IN .main  DIV, SET CONTAINER EQUAL TO NODE .main
const $container = document.querySelector(".main");
createPlayer($container);

//Event Listeners
window.addEventListener("keydown", KeyPress);
window.addEventListener("keyup", KeyRelease);

//CALL UPDATE FUNCTION: RUN GAME
update();
