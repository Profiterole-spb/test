/**
 * Created by andreysharshov on 09.09.2020.
 */

export class Audio {

  static getSoundUrl() {
    return "./assets/sound/wwiiiuuuu.mp3";
  }

  constructor() {
    window.addEventListener('load',this.init,false);
  }

  init() {
    console.log("in init");
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.loadFile();
    } catch(e) {
      alert('you need webaudio support');
    }
  }

  loadFile() {
    let req = new XMLHttpRequest();
    req.open("GET",Audio.getSoundUrl(),true);
    req.responseType = "arraybuffer";
    req.onload = function() {
      this.ctx.decodeAudioData(req.response, function(buffer) {
        buf = buffer;
      });
    };
    req.send();
  }

  play() {
    let src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.connect(this.ctx.destination);
    src.start(0)
  }
}