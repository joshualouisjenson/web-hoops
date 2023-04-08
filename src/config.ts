import { BasketballScene } from './scenes/basketball';
import { GameOverScene } from './scenes/game-over';
import { MenuScene } from './scenes/menu';
import { StartupScene } from './scenes/startup';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'NBA 2K Web',
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: 'white',
  type: Phaser.AUTO,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [StartupScene, MenuScene, BasketballScene, GameOverScene ],
};
