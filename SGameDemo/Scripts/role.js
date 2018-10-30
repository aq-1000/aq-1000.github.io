function Role(name, sheet, x, y, scaleX, scaleY){
    this._Name = name;
    this._Sheet = sheet;
    this._X = x;
    this._Y = y;
    this._ScaleX = scaleX;
    this._ScaleY = scaleY;
}

Role.prototype = {
    _This:this,
    _Name:"",
    _Sheet:null,
    _X:0,
    _Y:0,
    _Scale:1.0,
    _Idle:null,
    _Hit:null,
    _Skill:null,
    _Walk:null,
    _Effect:null,
    _SkillUI0:null,
    _SkillUI1:null,
    _SkillUI2:null,
    _BloodBar:null,

    Hide:function()
    {
        if (typeof this._Idle != "undefined" && this._Idle != null) {
            this._Idle.visible = false;
        }
        if (typeof this._Hit != "undefined" && this._Hit != null) {
            this._Hit.visible = false;
        }
        if (typeof this._Skill != "undefined" && this._Skill != null) {
            this._Skill.visible = false;
        }
        if (typeof this._Walk != "undefined" && this._Walk != null) {
            this._Walk.visible = false;
        }
        if (typeof this._Effect != "undefined" && this._Effect != null) {
            this._Effect.visible = false;
        }
    },

    Hit:function()
    {
        this.Hide();
        this._Hit.visible = true;
        this._Hit.gotoAndPlay(0);
        this._Hit.onComplete = function(){ 
            this._Hit.visible = false; 
            this._Idle.visible = true;
            this._Idle.gotoAndPlay(0);
        }.bind(this);
    },

    Skill:function()
    {
        this.Hide();
        this._Skill.visible = true;
        this._Skill.gotoAndPlay(0);
        this._Skill.onComplete = function(){ 
            this._Skill.visible = false; 
            this._Idle.visible = true;
            this._Idle.gotoAndPlay(0);
        }.bind(this);
    },

    CreateAnimation:function(aniName, speed)
    {
        var ani = new PIXI.extras.AnimatedSprite(this._Sheet.animations[this._Name + "_" + aniName]);
        ani.animationSpeed = speed;
    //    var.onComplete = function(){ aladdinIdle.visible = false; };
        ani.x = this._X;
        ani.y = this._Y;
        ani.scale.x = this._ScaleX;
        ani.scale.y = this._ScaleY;
        ani.anchor.set(0.5);
        ani.visible = false;
        ani.loop = false;
        ani.gotoAndPlay(0);
        app.stage.addChild(ani);

        if (aniName == "Idle") {
            ani.visible = true;
            ani.loop = true;
            this._Idle = ani;
            this._Idle.interactive = true;
            this._Idle.click = this.Skill.bind(this);
            this._Idle.touchend = this.Skill.bind(this);
        } else if (aniName == "Hit") {
            this._Hit = ani;
        } else if (aniName == "Skill") {
            this._Skill = ani;
        } else if (aniName == "Walk") {
            this._Walk = ani;
        } else if (aniName == "Effect") {
            this._Effect = ani;
        }
    },

    CreateSkillUI:function()
    {
        this._SkillUI0 = new PIXI.Sprite(this._Sheet.textures[this.Name + "_Skill_UI0.png"]);
        this._SkillUI1 = new PIXI.Sprite(this._Sheet.textures[this.Name + "_Skill_UI1.png"]);
        this._SkillUI2 = new PIXI.Sprite(this._Sheet.textures[this.Name + "_Skill_UI2.png"]);
    },

    CreateBloodBar:function(sprite)
    {
        this._BloodBar = sprite;
        this._BloodBar.anchor.set(0.5);
        this._BloodBar.x = this._X;
        this._BloodBar.y = this._Y - this._Idle.height * 0.2;
        app.stage.addChild(this._BloodBar);
    },
}
