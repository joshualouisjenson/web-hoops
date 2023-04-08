import Phaser from 'phaser';

export abstract class BaseScene extends Phaser.Scene {

  private background?: Phaser.GameObjects.Image;
  private banner?: Phaser.GameObjects.Rectangle;
  private logo?: Phaser.GameObjects.Image;

  public create(): void {
    // Set up the full-screen canvas
    const { width, height } = this.scale;

    
    // Add the background, banner, and logo
    this.cameras.main.setBackgroundColor('#020202');
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    
    this.banner = this.add.rectangle(0, 0, this.game.canvas.width, 100, 0x000000);
    this.banner.setOrigin(0, 0);
    
    this.logo = this.add.image(this.game.canvas.width / 2, 50, 'logo');
    this.logo.setOrigin(0.5, 0.5);
    
    // Scale the background image to the size of the window
    this.scaleImage(this.background).setPosition(0, 0);
    
    // Redraw the canvas to fill the screen if the window is resized
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      const { width, height } = gameSize;
      this.cameras.default.setViewport(0, 0, width, height);
      
      this.scaleImage(this.background)
      this.banner.setSize(width, 100);
      this.logo.setPosition(width / 2, 50);

      this.positionElements();
    });
  }

  shutdown() {
    // Remove event listeners
    this.events.off('shutdown');
    this.scale.off('resize');
  }

  // Implment this in your scene to resize and reposition elements during resize events
  protected abstract positionElements(): void;

  protected scaleImage(image: Phaser.GameObjects.Image, scaleMultiplier: number = 1): Phaser.GameObjects.Image {
    if (image) {
      const scaleX = window.innerWidth / image.width;
      const scaleY = window.innerHeight / image.height;
      const scale = Math.max(scaleX, scaleY);
      image.setScale(scale * scaleMultiplier);
    }
    return image;
  }
}
