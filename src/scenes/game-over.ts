import Phaser from 'phaser';
import { BaseScene } from './base-scene';

export class GameOverScene extends BaseScene {

  private gameOverText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private highscoreText: Phaser.GameObjects.Text;
  private playAgainButton: Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'GameOver' });
  }

  create(): void {
    super.create();

    this.sound.play('buzzer', { volume: 0.3, loop: false, detune: -700, rate: 1.2 });

    // Set new high score if applicable
    const score = this.registry.get('score');
    let highscore = this.registry.get('highscore');
    if (score > highscore) {
      highscore = score;
      this.registry.set('highscore', score);
    }

    // Show the game over text
    this.gameOverText = this.add.text(
      this.scale.width / 2,
      250,
      'Game Over!',
      {
        fontSize: '80px',
        color: 'black',
        fontFamily: 'sport'
      }
    );

    // Show the score
    this.scoreText = this.add.text(
      this.scale.width / 2,
      400,
      `Score: ${this.registry.get('score')}`,
      {
        fontSize: '48px',
        color: 'black',
        fontFamily: 'sport'
      }
    );

    // Show the previous best score
    this.highscoreText = this.add.text(
      this.scale.width / 2,
      460,
      `High Score: ${highscore}`,
      {
        fontSize: '48px',
        color: 'black',
        fontFamily: 'sport'
      }
    );

    this.gameOverText.setOrigin(0.5, 0.5);
    this.scoreText.setOrigin(0.5, 0.5);
    this.highscoreText.setOrigin(0.5, 0.5);

    // TODO - Add marketing pop-up?
    
    // Add a play again button
    this.playAgainButton = this.add.image(this.scale.width / 2, this.scale.height / 2 + 200, 'replayButton');
    this.playAgainButton.setOrigin(0.5, 0.5);
    this.playAgainButton.setInteractive({ useHandCursor: true });
    this.playAgainButton.on('pointerdown', () => {
      this.scene.start('Basketball');
    });

    // Do initial positioning of elements
    this.positionElements();
  }

  positionElements(): void {
    // Position the play again button
    this.scaleImage(this.playAgainButton, 0.2).setPosition(this.scale.width / 2, this.scale.height / 2 + 200);
    this.gameOverText.setPosition(this.scale.width / 2, 300);
    this.scoreText.setPosition(this.scale.width / 2, 400);
    this.highscoreText.setPosition(this.scale.width / 2, 460);
  }
}
