/**
 * Created by andreysharshov on 08.09.2020.
 */

export class Ship {
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
      )
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
        break
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
        break
    }
    this.sound.play();
    this.animatedSprite.textures.forEach((texture) => {
      texture.rotate = this.rotate;
    });

  }
}