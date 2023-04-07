export class Ball extends Phaser.GameObjects.Button {
  body: Phaser.Physics.Arcade.Body;

  constructor() {
    this.initSprite();
    this.scene.add.existing(this);
  }

  private initSprite() {
    this.setScale(0.5);
  }

  private initPhysics() {
    this.scene.physics.world.enable(this);
    this.body.setVelocity(100, 200);
    this.body.setBounce(1, 1);
    this.body.setCollideWorldBounds(true);
  }
}
