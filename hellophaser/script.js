window.onload = function () {

    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '',
        {preload: preload, create: create, update: update, render: render});
    var tank1;
    var upKey;
    var downKey;
    var leftKey;
    var rightKey;
    var speed = 800;
    var weapon;

    function preload() {

        game.load.image('logo', 'phaser.png');
        game.load.image('tank1', 'tank1.png');
        game.load.image('tank2', 'tank2.png');
        game.load.image('bullet', 'bullet.png');
    }

    function create() {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        tank1 = game.add.sprite(300, 300, 'tank1');
        tank1.anchor.set(0.5);
        game.physics.enable(tank1, Phaser.Physics.ARCADE);

        //tank1.body.setZeroDamping();
        tank1.body.fixedRotation = true;
        tank1.body.drag.x = 500;
        tank1.body.drag.y = 500;
        tank1.body.maxVelocity.set(200);

        cursors = game.input.keyboard.createCursorKeys();

        upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

        game.input.mouse.capture = true;

        weapon = game.add.weapon(30, 'bullet');
        weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        weapon.bulletLifespan = 2000;
        weapon.bulletSpeed = 600;
        weapon.trackSprite(tank1, 0, 0, true);

        weapon.fireRate = 100;

        tank1.bringToTop()
    }

    function update() {

        //tank1.body.setZeroVelocity();
        var targetAngle = (360 / (2 * Math.PI)) * game.math.angleBetween(
                tank1.x, tank1.y,
                this.game.input.activePointer.x, this.game.input.activePointer.y);

        if (targetAngle < 0)
            targetAngle += 360;

        tank1.angle = targetAngle;

        if(game.input.activePointer.leftButton.isDown) {
            weapon.fire();
            /*var t2 = game.add.sprite(tank1.body.x, tank1.body.y, 'bullet');
            game.physics.p2.enable(t2);
            t2.body.velocity.x = Math.cos(targetAngle / (360 / (2 * Math.PI)) ) * 100;*/
            //t2.body.velocity.y = Math.sin(targetAngle / (360 / (2 * Math.PI)) ) * 100;

        }
        if(Math.abs(tank1.body.acceleration.x) < 40) {
            if (tank1.body.velocity.x > 0) tank1.body.acceleration.x -= 30;
            if (tank1.body.velocity.x < 0) tank1.body.acceleration.x += 30;
            if(Math.abs(tank1.body.velocity.x) < 20 ) tank1.body.velocity.x = 0;
        }
        if(Math.abs(tank1.body.acceleration.y) < 40) {
            if (tank1.body.velocity.y > 0) tank1.body.acceleration.y -= 30;
            if (tank1.body.velocity.y < 0) tank1.body.acceleration.y += 30;
            if(Math.abs(tank1.body.velocity.y) < 20 ) tank1.body.velocity.y = 0;
        }




        if (leftKey.isDown) {
            tank1.body.acceleration.x = -speed;
        }
        else if (rightKey.isDown) {
            tank1.body.acceleration.x = +speed;
        }

        if (upKey.isDown) {
            tank1.body.acceleration.y = -speed;
        }
        else if (downKey.isDown) {
            tank1.body.acceleration.y = +speed;
        }




    }

    function render() {

        weapon.debug();
        tank1.debug();

    }

};
