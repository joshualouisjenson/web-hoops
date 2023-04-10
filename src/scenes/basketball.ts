import Phaser from 'phaser';
import { BaseScene } from './base-scene';

export class BasketballScene extends BaseScene {

  public ball: Phaser.Physics.Arcade.Sprite;
  public rim: Phaser.Physics.Arcade.Sprite;
  public goal: Phaser.GameObjects.Sprite;
  public timerText: Phaser.GameObjects.Text;
  public scoreText: Phaser.GameObjects.Text;
  public timerBackground: Phaser.GameObjects.Rectangle;

  private countDownInterval?: number;
  private ballResetTimeout?: number;
  private attachInterval?: number;

  private dragging = false;
  private ballThrown = false;
  private ballThrownTime?: number;
  private ballBouncedOut = false;
  private pointerVector?: Phaser.Math.Vector2;
  private originalBallScale: number;

  private goalYoffset = 400;
  private ballYoffset = -120;

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

    this.timerBackground = this.add.rectangle(this.scale.width / 2, 150, 150, 70, 0x000000).setOrigin(0.5, 0.6);
    const timeString = this.game.registry.get('time').toFixed(1).toString();
    this.timerText = this.add.text(this.scale.width / 2 , 150, timeString, {
      fontSize: '48px',
      color: 'red',
      fontFamily: 'SevenSegmentBold'
    });
    this.timerText.setOrigin(0.5);

    this.scoreText = this.add.text(150, 150, 'Score: 0', {
      fontSize: '48px',
      color: 'black',
      fontFamily: 'sport'
    });
    this.scoreText.setOrigin(0.5);

    // Add sprites
    this.goal = this.add.sprite(this.scale.width / 2, this.goalYoffset, 'goal');
    this.rim = this.physics.add.staticSprite(this.scale.width / 2, this.goalYoffset + (this.goal.scale * 35), 'transparent');
    this.ball = this.physics.add.sprite(this.scale.width / 2, this.scale.height + this.ballYoffset, 'ball');

    // Readd banner and logo so the ball renders below them
    this.addBannerAndLogo();

    // Set up physics
    this.ball.setCollideWorldBounds(true);
    this.physics.add.overlap(this.ball, this.rim, this.onBallHitGoal, undefined, this);
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height, false, false, false, true);
    
    this.ball.setBounce(0.8);
    const worldBoundProp = 'onWorldBounds'
    this.ball.body[worldBoundProp] = true;
    this.ball.setGravity(0, -this.game.config.physics.arcade.gravity.y);
    this.physics.world.on('worldbounds', this.onBallHitGround, this);


    // Create a timer that will count down from 60 seconds
    this.countDownInterval = window.setInterval(this.updateTimer, 100);


    // Do initial positioning of elements
    this.positionElements();
  }

  shutdown(): void {
    super.shutdown();

    window.clearTimeout(this.ballResetTimeout);
    window.clearInterval(this.attachInterval);
    window.clearInterval(this.countDownInterval);

    this.pointerVector = undefined;

    this.input.off('pointerdown', this.onPointerDown, this);
    this.input.off('pointermove', this.onPointerMove, this);
    this.input.off('pointerup', this.onPointerUp, this);
    this.input.off('touchstart', this.onPointerDown, this);
    this.input.off('touchmove', this.onPointerMove, this);
    this.input.off('touchend', this.onPointerUp, this);

    this.ballThrown = false;
    this.dragging = false;
    this.ballBouncedOut = false;
  }

  positionElements(): void {
    this.timerBackground.setPosition(this.scale.width / 2, 150);
    this.goal.setPosition(this.scale.width / 2, this.goalYoffset);
    this.ball.setPosition(this.scale.width / 2, this.scale.height + this.ballYoffset);
    this.rim.setPosition(this.scale.width / 2, this.goalYoffset + (this.goal.scale * 25));
    this.rim.body.updateCenter();
    this.rim.setOrigin(0.5, 0.5);
    this.timerText.setPosition(this.scale.width / 2, 150);
    this.scoreText.setPosition(100, 150);
    
    this.scaleImage(this.ball, 0.1);
    this.scaleImage(this.goal, 0.3);
    this.rim.setBodySize(this.goal.displayWidth * 0.2, 1);
  }

  private onBallHitGround() {
    if (this.ballThrown) {
      // Scale the volume of the bounce sound based on the velocity of the ball
      const volume = Math.abs(this.ball.body.velocity.y) / 2000;
      this.sound.play('bounce', { volume: volume });
    }
  };

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    // Check if the pointer was clicked on the ball
    if (!this.ballThrown && this.ball.getBounds().contains(pointer.x, pointer.y)) {
      this.dragging = true;
      // Attach the ball to the cursor
      if (this.attachInterval) {
        window.clearInterval(this.attachInterval);
      }
      this.attachInterval = window.setInterval(() => {
        this.physics.moveToObject(this.ball, this.input, 60, 250);
      }, 10);
    }
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    // If the pointer is down and the ball is being dragged, update the pointer vector
    if (this.dragging) {
      // Store the pointer vector
      this.pointerVector = new Phaser.Math.Vector2(
        pointer.x - this.ball.x,
        pointer.y - this.ball.y
      );
    }
  }

  private onPointerUp(pointer: Phaser.Input.Pointer) {
    window.clearInterval(this.attachInterval);

    // If the pointer is released, apply the pointer vector to the ball
    if (this.pointerVector) {
      this.ball.setVelocity(0, 0);
      this.dragging = false;
      this.ballThrown = true;
      this.ballThrownTime = Date.now();

      this.sound.play('swoosh2');
      
      this.ball.setGravity(0, this.game.config.physics.arcade.gravity.y);
      this.ball.setVelocity(
        this.pointerVector.x * 3,
        this.pointerVector.y * 3
      );

      // Suspend mouse events on the ball until it is reset
      this.ball.disableInteractive();

      // Shrink the ball as it is thrown
      this.originalBallScale = this.ball.scale;
      this.tweens.add({
        targets: this.ball,
        duration: 2000,
        scaleX: this.ball.scale * 0.5,
        scaleY:  this.ball.scale * 0.5,
        ease: 'Power2',
      });

      // Spin the ball as it is thrown
      this.tweens.add({
        targets: this.ball,
        duration: 2000,
        angle: 360,
        ease: 0.2,
      });

      // Reset the ball 2 seconds after it is moved
      this.ballResetTimeout = window.setTimeout(() => {
        this.resetBall();
        this.tweens.killAll();
      }, 2000);
    }

    // Reset the pointer vector when the pointer is released
    this.pointerVector = undefined;
  }

  private resetBall() {
    // Clear timeouts
    window.clearInterval(this.attachInterval);
    window.clearTimeout(this.ballResetTimeout);
    
    // Reset the ball position
    this.tweens.killAll();
    this.ball.setVelocity(0, 0);
    this.positionElements();
    this.dragging = false;
    this.ballThrownTime = null;
    this.ballThrown = false;
    this.ballBouncedOut = false;
    this.ball.setGravity(0, -this.game.config.physics.arcade.gravity.y);

    // Enable mouse events on the ball
    this.ball.setInteractive();
  }

  private onBallHitGoal() {
    const ballMovingDown = this.ball.body.velocity.y > 0;
    if (this.ballThrown && ballMovingDown && !this.ballBouncedOut) {
      // Simulate distance by only adding a point if the ball has been thrown for a certain amount of time
      const timeSinceThrown = Date.now() - this.ballThrownTime;
      const xCenterOffset = this.ball.x - (this.scale.width / 2);
      const centerOutsideRim = Math.abs(xCenterOffset) > (this.rim.body.width / 2);
      const centerBelowRim = this.ball.y > this.rim.y;

      if (timeSinceThrown > 800 && !centerOutsideRim) {
        this.sound.play('swoosh', { volume: 0.7 });
        this.addPoint();
      } else if (timeSinceThrown > 700 || centerBelowRim || centerOutsideRim) {
        this.ballBouncedOut = true;
        this.sound.play('backboard', { volume: 0.5 });

        // This simulates the effect of the ball bouncing off a curved rim by translating vertical velocity to 
        //    horizontal velocity based on the ball's distance from the center the goal
        const bounceXMultiplier = (xCenterOffset / 100);
        let xVelocity = this.ball.body.velocity.y * bounceXMultiplier;
        let yVelocity = -(this.ball.body.velocity.y - Math.abs((this.ball.body.velocity.y * bounceXMultiplier)));

        if (centerBelowRim) {
          // If the ball is below the rim, reverse the vertical velocity to make it bounce down
          yVelocity *= -1;
        }

        this.ball.setVelocity(xVelocity, yVelocity);

        // Reverse the ball's shrinking animation
        this.tweens.killAll();
        this.tweens.add({
          targets: this.ball,
          duration: 2000,
          scaleX: this.originalBallScale,
          scaleY: this.originalBallScale,
          ease: 'Power2',
        });
  
        // Add a random spin to the ball
        this.tweens.add({
          targets: this.ball,
          duration: 2000,
          angle: Math.random() * 360,
          ease: Math.random(),
        });
      }
    }
  }

  private addPoint() {
    // Update the score in the registry
    const score = this.game.registry.get('score') + 1;
    this.game.registry.set('score', score);
    
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
