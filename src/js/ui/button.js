/**
 * Created by andreysharshov on 08.09.2020.
 */

export class Button {
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