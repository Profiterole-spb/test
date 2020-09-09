/**
 * Created by andreysharshov on 09.09.2020.
 */

export class Audio {

  static getSoundUrl() {
    return "../../assets/sound/wwiiiuuuu.mp3";
  }

  static loadFile(ctx, buf) {
    console.log('load file');
    let req = new XMLHttpRequest();
    req.open("GET",Audio.getSoundUrl(),true);
    req.responseType = "arraybuffer";
    req.onload = () => {
      ctx.decodeAudioData(req.response, (buffer) => {
        buf = buffer;
    });
  };
  req.send();
  }

  static play(ctx, buf) {
    let src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0)
  }
}