function Role(name, sheet, x, y, scaleX, scaleY)
{
    this.name = name;
    this.sheet = sheet;
    this.x = x;
    this.y = y;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
}

Role.prototype = {
    CreateAnimation:function(aniName, speed, loop, visible)
    {
        var ani = new PIXI.extras.AnimatedSprite(this.sheet.animations[this.name + "_" + aniName]);
        ani.animationSpeed = speed;
        ani.loop = loop;
    //    var.onComplete = function(){ aladdinIdle.visible = false; };
        ani.x = this.x;
        ani.y = this.y;
        ani.scale.x = this.scaleX;
        ani.scale.y = this.scaleY;
        ani.anchor.set(0.5);
        ani.visible = visible;
        ani.play();
        app.stage.addChild(ani);

        if (aniName == "Idle") {
            this.idle = ani;
        } else if (aniName == "Hit") {
            this.hit = ani;
        } else if (aniName == "Skill") {
            this.shill = ani;
        } else if (aniName == "Walk") {
            this.walk = ani;
        } else if (aniName == "Effect") {
            this.effect = ani;
        }
    }
}
