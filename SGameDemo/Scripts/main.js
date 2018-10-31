let windowWidth = window.innerWidth, windowHeight = window.innerHeight;
let gScale = 1.0;
let BGWidth = 720, BGHeight = 1280;

// Create aPixi Application
let app = new PIXI.Application({width: windowWidth, height: windowHeight});

// Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

// 如果你想让canvas占据整个窗口，你可以将这些CSS代码放在文档中，并且刷新你浏览器窗口的大小。
// 但是，如果你这么做了，要记得把padding和margin都设置成0：
// <style>* {padding: 0; margin: 0}</style>
//app.renderer.view.style.position = "absolute";
//app.renderer.view.style.display = "block";
//app.renderer.autoResize = true;
//app.renderer.resize(window.innerWidth, window.innerHeight);

let aladdin = null;
let sinbad = null;
let anubis = null;
let serpentQueen = null;
let shedu = null;
let skillUI = null;
let victory = null;
let activateArrow = null;
let targetArrow = null;
let aniSpeed = 0.06;

let canClick = true;
let activateRole = null;
let targetRole = null;

// 加载静态图
PIXI.loader
    .add("Assets/Images/Background.png")
    .add("Assets/Images/SkillUI.png")
    .add("Assets/Images/Victory.png")
    .add("Assets/Images/BloodBar.png")
    .add("Assets/Images/Activation.png")
    .add("Assets/Images/Target.png")
    .add("Assets/Images/Our.json")
    .add("Assets/Images/Enemy.json")
    .on("progress", function(){
        // do something when loading
    })
    .load(onAssetsLoaded);

// 背景图加载完成
function onAssetsLoaded()
{
    // 背景图
    let background = new PIXI.Sprite(PIXI.loader.resources["Assets/Images/Background.png"].texture);
    BGWidth = background.width;
    BGHeight = background.height;
    app.stage.addChild(background);

    // 调整背景图
    if (windowWidth > windowHeight) {
        background.width = windowHeight;
    }
    else {
        background.width = windowWidth;
    }
    gScale = background.width / BGWidth;
    background.height = background.height * gScale;
    background.x += (windowWidth - background.width) * 0.5;     // 图片水平居中
    background.y -= (background.height - windowHeight);     // 图片底部和窗口持平

    // aladdin
    var sheet = PIXI.loader.resources["Assets/Images/Our.json"].spritesheet;
    aladdin = new Role("Aladdin", background, sheet, true, BGWidth * 0.15, BGHeight * 0.557);
    aladdin.CreateAnimation("Idle", aniSpeed);
    aladdin.CreateAnimation("Hit", aniSpeed);
    aladdin.CreateAnimation("Skill", aniSpeed * 2);
    aladdin.CreateAnimation("Effect", aniSpeed * 4);
    aladdin.CreateSkillUI();
    aladdin.CreateBloodBar(new PIXI.Sprite(PIXI.loader.resources["Assets/Images/BloodBar.png"].texture));
    aladdin._Idle.click = SelectAladdin;
    aladdin._Idle.touchend = SelectAladdin;

    // sinbad
    sinbad = new Role("Sinbad", background, sheet, true, BGWidth * 0.15, BGHeight * 0.725);
    sinbad.CreateAnimation("Idle", aniSpeed);
    sinbad.CreateAnimation("Hit", aniSpeed);
    sinbad.CreateAnimation("Skill", aniSpeed * 2);
    sinbad.CreateSkillUI();
    sinbad.CreateBloodBar(new PIXI.Sprite(PIXI.loader.resources["Assets/Images/BloodBar.png"].texture));
    sinbad._Idle.click = SelectSinbad;
    sinbad._Idle.touchend = SelectSinbad;

    // serpentQueen
    sheet = PIXI.loader.resources["Assets/Images/Enemy.json"].spritesheet;
    serpentQueen = new Role("SerpentQueen", background, sheet, false, BGWidth * 0.85, BGHeight * 0.5);
    serpentQueen.CreateAnimation("Idle", aniSpeed);
    serpentQueen.CreateAnimation("Hit", aniSpeed);
    serpentQueen.CreateBloodBar(new PIXI.Sprite(PIXI.loader.resources["Assets/Images/BloodBar.png"].texture));
    serpentQueen._Idle.click = SelectSerpentQueen;
    serpentQueen._Idle.touchend = SelectSerpentQueen;
    
    // anubis
    anubis = new Role("Anubis", background, sheet, false, BGWidth * 0.85, BGHeight * 0.65);
    anubis.CreateAnimation("Idle", aniSpeed);
    anubis.CreateAnimation("Hit", aniSpeed);
    anubis.CreateAnimation("Skill", aniSpeed * 2);
    anubis.CreateBloodBar(new PIXI.Sprite(PIXI.loader.resources["Assets/Images/BloodBar.png"].texture));
    anubis._Idle.click = SelectAnubis;
    anubis._Idle.touchend = SelectAnubis;

    // shedu
    shedu = new Role("Shedu", background, sheet, false, BGWidth * 0.85, BGHeight * 0.8);
    shedu.CreateAnimation("Idle", aniSpeed);
    shedu.CreateAnimation("Hit", aniSpeed);
    shedu.CreateBloodBar(new PIXI.Sprite(PIXI.loader.resources["Assets/Images/BloodBar.png"].texture));
    shedu._Idle.click = SelectShedu;
    shedu._Idle.touchend = SelectShedu;

    // 激活目标
    activateArrow = new PIXI.Sprite(PIXI.loader.resources["Assets/Images/Activation.png"].texture);
    targetArrow = new PIXI.Sprite(PIXI.loader.resources["Assets/Images/Target.png"].texture);
    activateArrow.anchor.set(0.5);
    targetArrow.anchor.set(0.5);
    background.addChild(activateArrow);
    background.addChild(targetArrow);

    // 技能UI
    skillUI = new PIXI.Sprite(PIXI.loader.resources["Assets/Images/SkillUI.png"].texture);
    skillUI.x = BGWidth - skillUI.width;
    skillUI.y = BGHeight - skillUI.height;
    skillUI.interactive = true;
    skillUI.click = SelectSkill;
    background.addChild(skillUI);

    // 胜利
    victory = new PIXI.Sprite(PIXI.loader.resources["Assets/Images/Victory.png"].texture);
    victory.anchor.set(0.5);
    victory.x = windowWidth * 0.5;
    victory.y = windowHeight * 0.5;
    victory.scale.x = gScale;
    victory.scale.y = gScale;
    victory.visible = false;
    app.stage.addChild(victory);

    SelectAladdin();
    SelectAnubis();
}

function UpdateSkillUI(obj)
{
    skillUI.removeChildren();
    if (null != obj._SkillUI0) {
        skillUI.addChild(obj._SkillUI0);
        obj._SkillUI0.x = skillUI.width * 0.08;
        obj._SkillUI0.y = skillUI.height * 0.378;
    }
    if (null != obj._SkillUI1) {
        skillUI.addChild(obj._SkillUI1);
        obj._SkillUI1.x = skillUI.width * 0.39;
        obj._SkillUI1.y = skillUI.height * 0.378;
    }
    if (null != obj._SkillUI2) {
        skillUI.addChild(obj._SkillUI2);
        obj._SkillUI2.x = skillUI.width * 0.697;
        obj._SkillUI2.y = skillUI.height * 0.378;
    }

    activateArrow.x = obj._X;
    activateArrow.y = obj._Y - obj._Idle.height * 0.33;
}

function SelectAladdin()
{
    if (!canClick) {
        return;
    }
    activateRole = aladdin;
    UpdateSkillUI(activateRole);
}

function SelectSinbad()
{
    if (!canClick) {
        return;
    }
    activateRole = sinbad;
    UpdateSkillUI(activateRole);
}

function SelectSerpentQueen()
{
    if (!canClick) {
        return;
    }
    targetRole = serpentQueen;
    targetArrow.x = targetRole._X;
    targetArrow.y = targetRole._Y - targetRole._Idle.height * 0.29;
}

function SelectAnubis()
{
    if (!canClick) {
        return;
    }
    targetRole = anubis;
    targetArrow.x = targetRole._X;
    targetArrow.y = targetRole._Y - targetRole._Idle.height * 0.29;
}

function SelectShedu()
{
    if (!canClick) {
        return;
    }
    targetRole = shedu;
    targetArrow.x = targetRole._X;
    targetArrow.y = targetRole._Y - targetRole._Idle.height * 0.29;
}

function SelectSkill()
{
    if (!canClick) {
        return;
    }
    canClick = false;
    activateRole.Skill();
    activateRole._Skill.onComplete = function(){ 
        activateRole._Skill.visible = false; 
        activateRole._Idle.visible = true;
        activateRole._Idle.gotoAndPlay(0);
        PlayOurEffect();  // 特效
    };
}

// Setup the animation loop.
function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}
requestAnimationFrame(animate);

function PlayOurEffect()
{
    aladdin._Effect.visible = true;
    aladdin._Effect.gotoAndPlay(0);
    var coords = { x: activateRole._X, y: activateRole._Y }; // Start at (0, 0)
    var tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to({ x: targetRole._X, y: targetRole._Y }, 500) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
        .onUpdate(function() { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
        //    box.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)');
            aladdin._Effect.x = coords.x;
            aladdin._Effect.y = coords.y;
        })
        .onComplete(function() {
            TargetHit();
            aladdin._Effect.visible = false;
        })
        .start(); // Start the tween immediately.
}

function PlayEnemyEffect()
{
    aladdin._Effect.visible = true;
    aladdin._Effect.gotoAndPlay(0);
    var coords = { x: anubis._X, y: anubis._Y }; // Start at (0, 0)
    var tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to({ x: activateRole._X, y: activateRole._Y }, 500) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
        .onUpdate(function() { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
        //    box.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)');
            aladdin._Effect.x = coords.x;
            aladdin._Effect.y = coords.y;
        })
        .onComplete(function() {
            aladdin._Effect.visible = false;

            anubis._Skill.visible = false; 
            anubis._Idle.visible = true;
            activateRole.Hit();
            canClick = true;
        })
        .start(); // Start the tween immediately.
}

function TargetHit()
{
    targetRole.Hit();
    targetRole._Hit.onComplete = function(){ 
        targetRole._Hit.visible = false; 
        targetRole._Idle.visible = true;
        targetRole._Idle.gotoAndPlay(0);
        
        // anubis反击
        if (anubis._Idle.visible)
        {
            anubis.Skill();
            anubis._Skill.onComplete = function(){ 
                anubis._Skill.visible = false; 
                anubis._Idle.visible = true;
                PlayEnemyEffect();
            };
        } else {
            canClick = true;
        }
    };
}