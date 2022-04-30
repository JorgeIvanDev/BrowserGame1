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
    number_of_enemies: 5,
    gameOver : false,
    start: false,
    seconds: 0,
    minutes: 0,
    num_caught_babies: 0,
    score: 0
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
// 1) created the owl image element
// 2) appended it to the main container
// 3) set the position of the owl image
// 4) set the size of the owl image
function createPlayer($container) {
    STATE.x_pos = GAME_WIDTH / 2.35;
    STATE.y_pos = GAME_HEIGHT - 97;

    // create player image and 
    const $player = document.createElement("img");
    $player.src = "images/catchingCharacter1a.png";
    $player.className = "player";
    // and add it to the html doc
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
    setPosition($player, boundary(STATE.x_pos), STATE.y_pos -15);
    setPosition($player, boundary1(STATE.x_pos), STATE.y_pos - 15);
}


// Enemies
function createEnemy($container, x,y){
     // create a baby image
     const $enemy = document.createElement("img");
     $enemy.src = "images/fallenAngel.png";
     $enemy.className = "enemy";
     // add the baby image to the html doc
     $container.appendChild($enemy);

    // set the initial data for each baby
    // and add it to state
     const enemy = {x, y, $enemy, falling_rate: Math.floor(Math.random() * 150)}
     STATE.enemies.push(enemy);

     setSize($enemy, STATE.enemy_width);
     setPosition($enemy, x, y);
}

// if the game is over, then show them the "lose"
// pop-up and the losing message
function show_game_over(text_content) {
  const $score_lose = document.querySelector('.score_lose')
  $score_lose.textContent = text_content
  document.querySelector(".lose").style.display = "block";
  return
}


function check_for_timeout(){
  if ( STATE.seconds >= 30) {
    pause()
    // const $score_lose = document.querySelector('.score_lose')
    // $score_lose.textContent = "Sorry! You ran out of time"
    // document.querySelector(".lose").style.display = "block";
    show_game_over("Sorry! You ran out of time")
    return
  }
  return
}

function updateEnemies($container){
  const dx = 0
  const dy = -.05
  const enemies = STATE.enemies;

  // if a certain amount of time has passed and the player
  // has not yet caught all of the babies, then 
  // tell them they timed out and end the game
  check_for_timeout()

  const $player = document.querySelector(".player")

  // if start is true, the game should run
  // otherwise, the babies shouldn't fall
  if (STATE.start == true) {
      for (let i = 0; i < enemies.length; i++){

        const enemy = enemies[i];
        // set the baby's x coordinates (x doesn't change for this iteration)
        var a = enemy.x + dx;

        // animate the baby down by a certain amount
        // depending on what their falling_rate is.
        // The higher the falling_rate, the faster
        // they fall
        enemy.y = enemy.y - dy * enemy.falling_rate
        setPosition(enemy.$enemy, a, enemy.y);

        // if this baby is close to the owl (player)
        // then we can say the baby was caught.
        // So if the baby's x and y coordinates are close
        // to the player's --> baby was caught
        if (
          Math.abs(($player.getBoundingClientRect().top - enemy.$enemy.getBoundingClientRect().bottom)) <= 10
          && Math.abs($player.getBoundingClientRect().x - enemy.$enemy.getBoundingClientRect().x) <= 50
          ){
            // hide the baby after it's caught
            enemy.$enemy.style.display = 'none'
            // increment the # of babies caught so far
            STATE.num_caught_babies++

            // if the num_caught_babies is = the # of 
            // babies in the beginning of the game,
            // they have caught all of the babies
            if(STATE.num_caught_babies === STATE.number_of_enemies){
              // if the player has caught all babies,
              // pause the game and then calculate their score
              pause()
              const $score = document.querySelector('.score')

              if( STATE.seconds <= 10 ) {
                // if the player catches all babies w/in
                // this amount of time, set the score to be 100 
                // and tell them they won
                STATE.score = 100
                $score.textContent = "Top Score: " + STATE.score
                document.querySelector(".win").style.display = "block"
              } else if ( STATE.seconds <= 22 ) {
                // if the player catches all babies w/in
                // this amount of time, set the score to 75
                // and tell them they won
                STATE.score = 75
                $score.textContent = "Score: " + STATE.score
                document.querySelector(".win").style.display = "block"
              } else {

                // if player catches all babies, but
                // takes a long time, they get a score of 0
                // and the game ends

                STATE.score = 0
                show_game_over("Score: " + STATE.score)
                // const $score_lose = document.querySelector('.score_lose')
                // $score_lose.textContent = "Score: " + STATE.score
                // document.querySelector(".lose").style.display = "block";
                //STATE.gameOver = true; 
              }

            }
          }
            
          // if the baby falls into the fire, send it back
          // to the top of the screen
          if ( enemy.y > GAME_HEIGHT + enemy.$enemy.height){
            enemy.y = 0
            setPosition(enemy.$enemy, a, enemy.y)
          }
          
      }
  }
  else {
    return
  }
}

//1st for loop creates first row of enemies, x and y coordinates in firstn and secon row different//
function createEnemies($container){
  for (let i = 0; i<= STATE.number_of_enemies - 1; i++){
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


"use strict";

let hour = 0;
let minute = 0;
let second = 0;
let millisecond = 0;

let cron;

document.form_main.start.onclick = () => start();
document.form_main.pause.onclick = () => pause();
document.form_main.reset.onclick = () => reset();

function start() {
  pause();

  // starts the baby animation
  STATE.start = true
  
  // start the background animation
  const $main = document.querySelector('.main')
  $main.style.animation = 'scroll-background 1.7s linear infinite'

  // play the audio
  const $audio = document.getElementById("audio")
  $audio.play()

  cron = setInterval(() => { timer(); }, 10);
}

function pause() {
  // this stops the baby animation
  STATE.start = false

  // stop the background from animating
  const $main = document.querySelector('.main')
  $main.style.animation = 'none'

  // pauses the audio
  const $audio = document.getElementById("audio")
  $audio.pause()

  clearInterval(cron);
}

function reset() {
  hour = 0;
  minute = 0;
  second = 0;
  millisecond = 0;
  document.getElementById('hour').innerText = '00';
  document.getElementById('minute').innerText = '00';
  document.getElementById('second').innerText = '00';
  document.getElementById('millisecond').innerText = '000';

  window.location.reload()
}

function timer() {
  if ((millisecond += 10) == 1000) {
    millisecond = 0;
    second++;
  }
  if (second == 60) {
    second = 0;
    minute++;
  }
  if (minute == 60) {
    minute = 0;
    hour++;
  }

  // Add time information to state for reference later
  // (during the win/lose if statements)
  STATE.seconds = second
  STATE.minutes = minute

  document.getElementById('hour').innerText = returnData(hour);
  document.getElementById('minute').innerText = returnData(minute);
  document.getElementById('second').innerText = returnData(second);
  document.getElementById('millisecond').innerText = returnData(millisecond);
}

function returnData(input) {
  return input > 10 ? input : `0${input}`
}