import Phaser from 'phaser';
import { BaseScene } from './base-scene';

export class GameOverScene extends BaseScene {

  gameOverText: Phaser.GameObjects.Text;
  scoreText: Phaser.GameObjects.Text;
  highscoreText: Phaser.GameObjects.Text;
  playAgainButton: Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'GameOver' });
  }

  create(): void {
    super.create();

    // Show the game over text
    const gameOverText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 50,
      'Game Over',
      {
        fontSize: '64px',
        color: 'black',
        fontFamily: 'Arial'
      }
    );

    gameOverText.setOrigin(0.5, 0.5);

    // Show the score
    const scoreText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      `Score: ${this.registry.get('score')}`,
      {
        fontSize: '32px',
        color: 'black',
        fontFamily: 'Arial'
      }
    );

    scoreText.setOrigin(0.5, 0.5);

    // Show the previous best score
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

    // TODO - Add marketing pop-up?
    
    // Add a play again button
    const playAgainButton = this.add.image(this.scale.width / 2, this.scale.height / 2 + 100, 'playButton');
    playAgainButton.setOrigin(0.5, 0.5);
    playAgainButton.setInteractive({ useHandCursor: true });
    playAgainButton.on('pointerdown', () => {
      this.scene.start('Basketball');
    });

    // Do initial positioning of elements
    this.positionElements();
  }

  positionElements(): void {
    // Position the play again button
    this.scaleImage(this.playAgainButton, 0.2).setPosition(this.scale.width / 2, this.scale.height / 2 + 100);
    this.scaleImage(this.gameOverText, 0.2).setPosition(this.scale.width / 2, this.scale.height / 2 - 50);
    this.scaleImage(this.scoreText, 0.2).setPosition(this.scale.width / 2, this.scale.height / 2);
    this.scaleImage(this.highscoreText, 0.2).setPosition(this.scale.width / 2, this.scale.height / 2 + 50);
  }
}
