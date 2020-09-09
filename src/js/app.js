import {Background} from './ui/background.js';
import {Ship} from './ui/ship.js';
import {Joystick} from './ui/joystick.js';
import {Audio} from './audio/audio.js';

let ctx;
let buf;

function init() {
  console.log("in init");
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    loadFile();
  } catch(e) {
    alert('you need webaudio support');
  }
}

function loadFile() {
  let req = new XMLHttpRequest();
  req.open("GET","./assets/sound/wwiiiuuuu.mp3",true);
  req.responseType = "arraybuffer";
  req.onload = function() {
    ctx.decodeAudioData(req.response, function(buffer) {
      buf = buffer;
    });
  };
  req.send();
}

function play() {
  let src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start(0)
}

window.addEventListener('load',init,false);

const app = new PIXI.Application({
  width: 640,
  height: 480,
  antialias: true
});

document.body.appendChild(app.view);

const renderer = app.renderer;

renderer.backgroundColor = 0x77d7b4;
renderer.view.style.position = 'absolute';
renderer.view.style.left = '50%';
renderer.view.style.top = '50%';
renderer.view.style.transform = 'translate(-50%, -50%)';
renderer.view.style.display = 'block';


PIXI.loader
  .add([
    Background.getTextureSrc(),
    Ship.getTextureSrc()
  ])
  .load(setup);

function setup() {
  const background = new Background();
  background.width = renderer.width;
  background.height = renderer.height;
  const ship = new Ship(renderer, play);
  ship.animatedSprite.position.set(0, 0);
  const joystick = new Joystick(
    renderer,
    ship,
  );
  const space = new PIXI.Container();
  space.addChild(ship.animatedSprite);
  space.position.set(
    renderer.width / 2,
    renderer.height / 2,
  );
  joystick.scale(0.25);
  joystick.setPosition(
    renderer.width / 2,
    renderer.height - joystick.container.height / 2 - 15
  );
  app.stage.addChild(
    background,
    space,
    joystick.container
  );
  app.ticker.add((delay) => {
    switch(ship.state) {
      case 'up':
        ship.move(
          0,
          -ship.velocity * delay
        );
        break;
      case 'down':
        ship.move(
          0,
          ship.velocity * delay
        );
        break;
      case 'left':
        ship.move(
          -ship.velocity * delay,
          0
        );
        break;
      case 'right':
        ship.move(
          ship.velocity * delay,
          0
        );
        break;
      default:
        return;
        break
    }
  });
}
