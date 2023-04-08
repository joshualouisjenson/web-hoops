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
    this.load.image('background', 'bg-white.png');
    this.load.image('ball', 'ball.png');
    this.load.image('goal', 'goal.png');

    // TODO - Sounds
  }

  create () {
      this.registry.set('highscore', 0);

      this.scene.start('Menu');
  }
}
