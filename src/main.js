import Phaser from './lib/phaser.js'

import Game from './scenes/Game.js'
console.dir(Phaser);

//create instance of Phaser game
export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    scene: Game,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            },
            //check for collision detection
            debug: true
        }
    }
})
