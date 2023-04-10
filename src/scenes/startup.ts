import Phaser from 'phaser';

export class StartupScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Startup' });
  }

  preload() {
    // Load your assets here
    this.load.setPath('/images/');
    this.load.image('logo', 'nba2k-logo.png');
    this.load.image('playButton', 'play-now.png');
    this.load.image('replayButton', 'try-again.png');
    this.load.image('background', 'bg-white.png');
    this.load.image('ball', 'ball.png');
    this.load.image('goal', 'goal.png');
    this.load.image('rim', 'rim.png');
    this.load.image('side_rim', 'side_rim.png');
    this.load.image('transparent', 'transparent.png');

    var newFont = new FontFace('SevenSegmentBold', `url('/fonts/DSEG7Classic-Bold.ttf')`, { style: 'normal', weight: 'normal' });
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    });

    
    var newFont = new FontFace('sport', `url('/fonts/octin sports rg.otf')`, { style: 'normal', weight: 'normal' });
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    });

    this.load.setPath('/sounds/');
    this.load.audio('swoosh', 'swoosh.mp3');
    this.load.audio('buzzer', 'buzzer.mp3');
    this.load.audio('swoosh2', 'swoosh2.mp3');
    this.load.audio('bounce', 'bounce.wav');
    this.load.audio('backboard', 'backboard.mp3');
  }

  create () {
    this.registry.set('highscore', 0);

    const debugGameover = false;
    if (!debugGameover) {
      this.scene.start('Menu'); 
    } else {
      this.registry.set('score', 25);
      this.registry.set('highscore', 50);
      this.scene.start('GameOver');
    }
  }
}
