import Phaser from '../lib/phaser.js';
import Carrot from '../game/carrot.js'

export default class Game extends Phaser.Scene {
    player; platforms; cursors
    
    constructor()
    {
        //every scene has to be defined by a unique key. 'game' is the key for this scene
        super('game')
    }

    preload()
    {

        //load image background
        this.load.image('background', './assets/PNG/Background/bg_layer1.png')

        //load the platform image
        this.load.image('platform', './assets/PNG/Environment/ground_grass.png')

        //load player image
        this.load.image('bunny-stand', './assets/PNG/Players/bunny1_stand.png')

        //load carrot image
        this.load.image('carrot', 'assets/PNG/Items/carrot.png')

        //create user input
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create()
    {
        //add image background to canvas
        this.add.image(240, 320, 'background')
        .setScrollFactor(1,0)


        //add physics to the platform image in the middle of the canvas
        this.platforms = this.physics.add.staticGroup()

        //create 5 platforms

        for (let i = 0; i <5; ++i)
        {
            //x should be positioned between 85 and 400
            const x = Phaser.Math.Between(85, 400)
            // y position should be 150 pixels apart
            const y = 150 * i

            const platform = this.platforms.create(x, y, 'platform')
            platform.scale = 0.5

            const body = platform.body
            //refresh physics body based on changes made from game object
            body.updateFromGameObject()
        }

        this.player = this.physics.add.sprite(240,320, 'bunny-stand')
        .setScale(0.5)
       
        //create a collider to prevent free falling
        this.physics.add.collider(this.platforms,this.player)

        //collision should be false when body moves up,left, right
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false


        //follow bunny as it jumps
        this.cameras.main.startFollow(this.player)

        //set the horizontal dead zone
        this.cameras.main.setDeadzone(this.scale.width * 1.5)

        console.log(this.scale.width)


    }



    //anything in update will be executed over and over again
    update(t, dt)
    {
        const touchingDown = this.player.body.touching.down

        if (touchingDown)
        {
            //bunny should jump straight up
            this.player.setVelocityY(-300)
        }

        this.platforms.children.iterate(child => {
            const platform = child

            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY + 700)
            {
                platform.y = scrollY - Phaser.Math.Between(50, 100)
                platform.body.updateFromGameObject()
            }
        })

        //check for right and left input logic
        if (this.cursors.left.isDown && !touchingDown)
        {
            this.player.setVelocityX(-200)
        }
        else if (this.cursors.right.isDown && !touchingDown)
        {
            this.player.setVelocityX(200)
        }
        else
        {
            //no movement if not left or right
            this.player.setVelocityX(0)
        }
        this.horizontalWrap(this.player)
    }

    horizontalWrap(sprite)
    {
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width 
        if (sprite.x < -halfWidth) {
            sprite.x = gameWidth + halfWidth
            
        }
        else if (sprite.x > gameWidth + halfWidth)
        {
            sprite.x = -halfWidth
        }
    }

}

