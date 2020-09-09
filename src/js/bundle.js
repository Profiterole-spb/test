(function () {
  'use strict';

  /**
   * Created by andreysharshov on 08.09.2020.
   */

  class Background {
    static getTextureSrc() {
      return '/assets/textures/background.jpg'
    }

    constructor() {
      return new PIXI.Sprite(
       PIXI.Loader.shared.resources[Background.getTextureSrc()].texture
      )
    }
  }

  /**
   * Created by andreysharshov on 08.09.2020.
   */

  class Ship {
    static getTextureSrc() {
      return '/assets/textures/saboteur.png';
    }

    static frameSize() {
      return {
        width: 128 / 4,
        height: 32
      }
    }
    static get frames() {
      return 4;
    }
    get velocity() {
      return 3;
    }

    constructor(renderer, play) {
      this.sound = new Audio("../../assets/sound/wwiiiuuuu.mp3");
      this.state = 'stop';
      this.play = play;
      this.renderer = renderer;
      this.rotate = 0;
      this.getTextures();
      this.animatedSprite = new PIXI.AnimatedSprite(this.textures);
      this.animatedSprite.anchor.set(0.5);
      this.animatedSprite.animationSpeed = 0.1;
      this.animatedSprite.play();
      this.animatedSprite.buttonMode = true;
      this.animatedSprite.interactive = true;
      this.animatedSprite.on('pointerup', this.onPointerUp.bind(this));
    }

    getTextures() {
      this.textures = [];
      for (let i = 0; i < Ship.frames; i++){
        const baseTexture = new PIXI.BaseTexture(PIXI.Loader.shared.resources[Ship.getTextureSrc()].data);
        this.textures.push(new PIXI.Texture(baseTexture));
        this.textures[this.textures.length-1].frame = new PIXI.Rectangle(
          i * Ship.frameSize().width,
          0,
          Ship.frameSize().width,
          Ship.frameSize().height,
        );
      }
    }

    move(x, y){
      switch(this.state) {
        case 'up':
          this.rotate = 0;
          break;
        case 'down':
          this.rotate = 4;
          break;
        case 'left':
          this.rotate = 2;
          break;
        case 'right':
          this.rotate = 6;
          break;
        default:
          return;
      }
      this.animatedSprite.textures.forEach((texture) => {
        texture.rotate = this.rotate;
      });
      const newX = this.animatedSprite.x + x;
      const newY = this.animatedSprite.y + y;
      const topCollision = newY - Ship.frameSize().height / 2 >= -this.renderer.height / 2;
      const bottomCollision = newY + Ship.frameSize().height / 2 <= this.renderer.height / 2;
      const leftCollision = newX - Ship.frameSize().width / 2 >= -this.renderer.width / 2;
      const rightCollision = newX + Ship.frameSize().width / 2 <= this.renderer.width / 2;
      if(topCollision && bottomCollision)
        this.animatedSprite.y = newY;
      if(leftCollision && rightCollision)
        this.animatedSprite.x = newX;
    }
    onPointerUp() {
      switch(this.rotate) {
        case 0:
          this.rotate = 4;
          break;
        case 2:
          this.rotate = 6;
          break;
        case 4:
          this.rotate = 0;
          break;
        case 6:
          this.rotate = 2;
          break;
        default:
          return;
      }
      this.sound.play();
      this.animatedSprite.textures.forEach((texture) => {
        texture.rotate = this.rotate;
      });

    }
  }

  /**
   * Created by andreysharshov on 08.09.2020.
   */

  class Button {
    constructor(renderer, text) {
      const sprite = new PIXI.Sprite(this.buildTexture(renderer, text));
      sprite.anchor.set(0.5);
      return sprite;
    }

    buildTexture(renderer, text) {
      const container = new PIXI.Container();
      const pixiText = new PIXI.Text(text, {fontSize: 50, fill: 'red'});
      const gr = new PIXI.Graphics;
      gr.lineStyle(10, 0xffffff);
      gr.beginFill(0xffed00);
      gr.drawCircle(0, 0, 80);
      gr.endFill();
      gr.closePath();
      container.addChild(gr, pixiText);
      pixiText.anchor.set(0.5);
      return renderer.generateTexture(container)
    }
  }

  /**
   * Created by andreysharshov on 08.09.2020.
   */

  class Joystick {
    constructor(renderer, object){
      this.object = object;
      this.upBtn = new Button(renderer, '<');
      this.downBtn = new Button(renderer, '<');
      this.leftBtn = new Button(renderer, '<');
      this.rightBtn = new Button(renderer, '<');
      this.container = new PIXI.Container();
      this.container.addChild(
        this.upBtn,
        this.downBtn,
        this.leftBtn,
        this.rightBtn
      );
      this.upBtn.position.set(0, -140);
      this.upBtn.angle = 90;
      this.downBtn.position.set(0, 140);
      this.downBtn.angle = -90;
      this.leftBtn.position.set(-140, 0);
      this.rightBtn.position.set(140, 0);
      this.rightBtn.angle = 180;
      const buttons = [this.upBtn, this.downBtn, this.leftBtn, this.rightBtn];
      buttons.forEach((btn) => {
        btn.buttonMode = true;
        btn.interactive = true;
        btn.hitArea = new PIXI.Rectangle(
          (-Math.sqrt(2) * btn.width / 2) / 2,
          (-Math.sqrt(2) * btn.width / 2) / 2,
          Math.sqrt(2) * btn.width / 2,
          Math.sqrt(2) * btn.width / 2
        );
      });
      this.upBtn
        .on('pointerdown', ()=>{this.onPointerDown('up');})
        .on('pointerup', this.onPointerUp.bind(this));
      this.downBtn
        .on('pointerdown', ()=>{this.onPointerDown('down');})
        .on('pointerup', this.onPointerUp.bind(this));
      this.leftBtn
        .on('pointerdown', ()=>{this.onPointerDown('left');})
        .on('pointerup', this.onPointerUp.bind(this));
      this.rightBtn
        .on('pointerdown', ()=>{this.onPointerDown('right');})
        .on('pointerup', this.onPointerUp.bind(this));
    }

    scale(val) {
      this.container.scale.set(val, val) ;
    }

    setPosition(x, y) {
      this.container.position.set(
        x,
        y
      );
    }

    onPointerDown(state) {
      this.object.state = state;
      console.log(`state: ${this.object.state}`);
    }

    onPointerUp() {
      this.object.state = 'stop';
      console.log(`state: ${this.object.state}`);
    }
  }

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

  PIXI.Loader.shared
    .add([
      Background.getTextureSrc(),
      Ship.getTextureSrc()
    ])
    .load(setup);

  function setup() {
    const background = new Background();
    background.width = renderer.width;
    background.height = renderer.height;
    const ship = new Ship(renderer);
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
      }
    });
  }

}());
