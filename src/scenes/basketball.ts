import Phaser from 'phaser';
import { BaseScene } from './base-scene';

export class BasketballScene extends BaseScene {

  public ball: Phaser.Physics.Arcade.Sprite;
  public goal: Phaser.GameObjects.Sprite;
  public timerText: Phaser.GameObjects.Text;
  public scoreText: Phaser.GameObjects.Text;

  private ballResetTimeout?: number;
  private lastPointerX?: number;
  private lastPointerY?: number;
  private pointerVector?: Phaser.Math.Vector2;

  constructor() {
    super({ key: 'Basketball' });
  }

  create() {
    super.create();

    // Set up the pointer and touch events
    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointermove', this.onPointerMove, this);
    this.input.on('pointerup', this.onPointerUp, this);
    this.input.on('touchstart', this.onPointerDown, this);
    this.input.on('touchmove', this.onPointerMove, this);
    this.input.on('touchend', this.onPointerUp, this);
    
    this.game.registry.set('score', 0);
    this.game.registry.set('time', 60.0);


    // Add sprites
    this.goal = this.add.sprite(this.scale.width / 2, 200, 'goal');
    this.goal.body = new Phaser.Physics.Arcade.Body(this.physics.world, this.goal);
    this.goal.body.setSize(100, 50);

    this.ball = this.physics.add.sprite(this.scale.width / 2, this.scale.height, 'ball');

    const timeString = this.game.registry.get('time').toFixed(1).toString();
    this.timerText = this.add.text(this.scale.width / 2 , 10, timeString, {
      fontSize: '32px',
      color: 'red',
      fontFamily: '7S Bold'
    });

    this.scoreText = this.add.text(10, 10, 'Score: ', {
      fontSize: '32px',
      color: 'black',
      fontFamily: 'Arial'
    });
    

    // Set up physics
    this.ball.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
    
    this.physics.add.collider(this.ball, this.goal, this.onBallHitGoal, undefined, this);

    this.ball.setBounce(1);
    this.ball.setCollideWorldBounds(true);


    // Create a timer that will count down from 60 seconds
    window.setInterval(this.updateTimer, 100);


    // Do initial positioning of elements
    this.positionElements();
  }

  shutdown(): void {
    super.shutdown();

    if (this.ballResetTimeout) {
      window.clearTimeout(this.ballResetTimeout);
    }
    this.pointerVector = undefined;

    this.input.off('pointerdown', this.onPointerDown, this);
    this.input.off('pointermove', this.onPointerMove, this);
    this.input.off('pointerup', this.onPointerUp, this);
    this.input.off('touchstart', this.onPointerDown, this);
    this.input.off('touchmove', this.onPointerMove, this);
    this.input.off('touchend', this.onPointerUp, this);
  }

  positionElements(): void {
    this.goal.setPosition(this.scale.width / 2, 300);
    this.ball.setPosition(this.scale.width / 2, this.scale.height - 100);
    this.scaleImage(this.ball, 0.1);
    this.scaleImage(this.goal, 0.25);
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    // Check if the pointer was clicked on the ball
    if (this.ball.getBounds().contains(pointer.x, pointer.y)) {
      // Create a new vector object to store the pointer movement
      this.pointerVector = new Phaser.Math.Vector2();
    }
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    // If the pointer is moving, update the pointer vector
    if (this.pointerVector && this.input.activePointer.isDown) {
      this.pointerVector.setTo(
        this.input.activePointer.x - this.lastPointerX!,
        this.input.activePointer.y - this.lastPointerY!
      );
      this.pointerVector.normalize();
    }

    // Store the last pointer position for use in the next update loop
    this.lastPointerX = this.input.activePointer.x;
    this.lastPointerY = this.input.activePointer.y;
  }

  private onPointerUp(pointer: Phaser.Input.Pointer) {
    // If the pointer is released, apply the pointer vector to the ball
    if (this.pointerVector) {
      this.ball.setVelocity(
        this.pointerVector.x * 800,
        this.pointerVector.y * 800
      );

      // Suspend mouse events on the ball until it is reset
      this.ball.disableInteractive();

      // Reset the ball 2 seconds after it is moved
      this.ballResetTimeout = window.setTimeout(() => {
        this.resetBall();
      }, 2000);
    }

    // Reset the pointer vector when the pointer is released
    this.pointerVector = undefined;
  }

  private resetBall() {
    // Reset the ball position
    this.ball.setVelocity(0, 0);
    this.positionElements();

    // Enable mouse events on the ball
    this.ball.setInteractive();

    // Clear the ball reset timeout
    window.clearTimeout(this.ballResetTimeout);
  }

  private onBallHitGoal() {
    // Update the score in the registry
    const score = this.game.registry.get('score');
    this.game.registry.set('score', score + 1);
    
    // Update the score text
    this.scoreText.setText(`Score: ${score}`);

    // Reset the ball
    this.resetBall();
  }

  private updateTimer = () => {
    // Update the time in the registry
    const time = this.game.registry.get('time');
    if (time > 0) {
      this.game.registry.set('time', time - 0.1);
    }

    // Update the time text
    const timeString = time.toFixed(1).toString();
    this.timerText.setText(timeString);

    // If the time is up, end the game
    if (this.game.registry.get('time') <= 0) {
      this.scene.start('GameOver');
    }
  }
}
