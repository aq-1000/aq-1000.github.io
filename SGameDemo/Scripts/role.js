function Role(name, parent, sheet, our, x, y, maxhp){
    this._Name = name;
    this._Parent = parent;
    this._Sheet = sheet;
    this._Our = our;
    this._X = x;
    this._Y = y;
    this._MAXHP = maxhp;
    this._HP = maxhp;
}

Role.prototype = {
    _Name:"",
    _Parent:null,
    _Sheet:null,
    _Our:true,
    _X:0,
    _Y:0,
    _MAXHP:1,
    _HP:1,
    _Idle:null,
    _Hit:null,
    _Skill:null,
    _Dead:null,
    _Walk:null,
    _Effect:null,
    _SkillUI0:null,
    _SkillUI1:null,
    _SkillUI2:null,
    _BloodBar:null,
    _InterBar:null,

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
        // if (typeof this._Effect != "undefined" && this._Effect != null) {
        //     this._Effect.visible = false;
        // }
    },

    Hit:function()
    {
        this.Hide();
        this._Hit.visible = true;
        this._Hit.gotoAndPlay(0);
        if (this._Our) {
            this._Hit.onComplete = function(){ 
                this._Hit.visible = false; 
                this._Idle.visible = true;
                this._Idle.gotoAndPlay(0);
            }.bind(this);
        }
    },

    Skill:function()
    {
        this.Hide();
        this._Skill.visible = true;
        this._Skill.gotoAndPlay(0);
    },

    CreateAnimation:function(aniName, speed)
    {
        var ani = new PIXI.extras.AnimatedSprite(this._Sheet.animations[this._Name + "_" + aniName]);
        ani.animationSpeed = speed;
    //    var.onComplete = function(){ aladdinIdle.visible = false; };
        ani.x = this._X;
        ani.y = this._Y;
        if (!this._Our) {
            ani.scale.x = -1;
        }
        ani.anchor.set(0.5);
        ani.visible = false;
        ani.loop = false;
        ani.gotoAndPlay(0);
        this._Parent.addChild(ani);

        if (aniName == "Idle") {
            ani.visible = true;
            ani.loop = true;
            this._Idle = ani;
            this._Idle.interactive = true;
        } else if (aniName == "Hit") {
            this._Hit = ani;
        } else if (aniName == "Skill") {
            this._Skill = ani;
        } else if (aniName == "Dead") {
            this._Dead = ani;
        } else if (aniName == "Walk") {
            this._Walk = ani;
        } else if (aniName == "Effect") {
            this._Effect = ani;
            this._Effect.loop = true;
        }
        return ani;
    },

    CreateSkillUI:function()
    {
        this._SkillUI0 = new PIXI.Sprite(this._Sheet.textures[this._Name + "_UI0.png"]);
        this._SkillUI1 = new PIXI.Sprite(this._Sheet.textures[this._Name + "_UI1.png"]);
        this._SkillUI2 = new PIXI.Sprite(this._Sheet.textures[this._Name + "_UI2.png"]);
    },

    CreateBloodBar:function()
    {
        let sheet = PIXI.loader.resources["Assets/Images/Common.json"].spritesheet;
        this._BloodBar = new PIXI.Sprite(sheet.textures["BloodBar0.png"]);
        this._BloodBar.x = this._X - this._BloodBar.width * 0.5;
        this._BloodBar.y = this._Y - this._Idle.height * 0.22;
        this._Parent.addChild(this._BloodBar);

        if (this._Our) {
            this._InterBar = new PIXI.Sprite(sheet.textures["BloodBar1.png"]);
        } else {
            this._InterBar = new PIXI.Sprite(sheet.textures["BloodBar2.png"]);
        }
        this._BloodBar.addChild(this._InterBar);
    },
}
