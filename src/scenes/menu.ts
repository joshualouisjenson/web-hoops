import Phaser from 'phaser';
import { BaseScene } from './base-scene';

export class MenuScene extends BaseScene {

  public banner: Phaser.GameObjects.Image;
  public playNowButton: Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'Menu' });
  }

  create() {
    super.create();

    // Add the "Play Now" button
    this.playNowButton = this.add.image(this.scale.width / 2, this.scale.height / 2, 'playButton');
    this.playNowButton.setOrigin(0.5, 0.5);
    this.playNowButton.setInteractive({ useHandCursor: true });
    this.playNowButton.on('pointerdown', () => {
      this.scene.start('Basketball');
    });

    // Display the high score if they have one
    const highscore = this.registry.get('highscore');
    if (highscore) {
      const highscoreText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2 + 50,
        `Highscore: ${highscore}`,
        {
          fontSize: '32px',
          color: 'black',
          fontFamily: 'Arial'
        }
      );
      highscoreText.setOrigin(0.5, 0.5);
    }

    // Do initial positioning of elements
    this.positionElements();
  }

  positionElements(): void {
    this.scaleImage(this.playNowButton, 0.2).setPosition(this.scale.width / 2, this.scale.height / 2);
  }

}
