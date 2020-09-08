/**
 * Created by andreysharshov on 08.09.2020.
 */
import {Button} from './button.js';

export class Joystick {
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
    const buttons = [this.upBtn, this.downBtn, this.leftBtn, this.rightBtn]
    buttons.forEach((btn) => {
      btn.buttonMode = true;
      btn.interactive = true;
      btn.hitArea = new PIXI.Rectangle(
        (-Math.sqrt(2) * btn.width / 2) / 2,
        (-Math.sqrt(2) * btn.width / 2) / 2,
        Math.sqrt(2) * btn.width / 2,
        Math.sqrt(2) * btn.width / 2
      )
    });
    this.upBtn
      .on('pointerdown', ()=>{this.onPointerDown('up')})
      .on('pointerup', this.onPointerUp.bind(this));
    this.downBtn
      .on('pointerdown', ()=>{this.onPointerDown('down')})
      .on('pointerup', this.onPointerUp.bind(this));
    this.leftBtn
      .on('pointerdown', ()=>{this.onPointerDown('left')})
      .on('pointerup', this.onPointerUp.bind(this));
    this.rightBtn
      .on('pointerdown', ()=>{this.onPointerDown('right')})
      .on('pointerup', this.onPointerUp.bind(this));
  }

  scale(val) {
    this.container.scale.set(val, val) ;
  }

  setPosition(x, y) {
    this.container.position.set(
      x,
      y
    )
  }

  onPointerDown(state) {
    this.object.state = state;
    console.log(`state: ${this.object.state}`)
  }

  onPointerUp() {
    this.object.state = 'stop';
    console.log(`state: ${this.object.state}`)
  }
}