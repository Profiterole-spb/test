/**
 * Created by andreysharshov on 08.09.2020.
 */

export class Background {
  static getTextureSrc() {
    return '/assets/textures/background.jpg'
  }

  constructor() {
    return new PIXI.Sprite(
     PIXI.loader.resources[Background.getTextureSrc()].texture
    )
  }
}