let windowWidth = window.innerWidth, windowHeight = window.innerHeight;
let gScale = 1.0;

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
let aladdin2 = null;
let skillUI = null;
let victory = null;
let activation = null;
let target = null;

// 加载静态图
PIXI.loader
    .add("Assets/Images/Background.png")
    .add("Assets/Images/SkillUI.png")
    .add("Assets/Images/NoSkill.png")
    .add("Assets/Images/Victory.png")
    .add("Assets/Images/BloodBar.png")
    .add("Assets/Images/Activation.png")
    .add("Assets/Images/Target.png")
    .add("Assets/Images/Roles/Aladdin.json")
    .on("progress", function(){
        // do something when loading
    })
    .load(onAssetsLoaded);

// 背景图加载完成
function onAssetsLoaded()
{
    // 背景图
    let backgroundSprite = new PIXI.Sprite(PIXI.loader.resources["Assets/Images/Background.png"].texture);
    app.stage.addChild(backgroundSprite);

    gScale = windowWidth / backgroundSprite.width;  // 调整背景图，铺满全屏，图片居中
    backgroundSprite.width = windowWidth;
    backgroundSprite.height = backgroundSprite.height * gScale;
    if (backgroundSprite.height > windowHeight) 
    {
        backgroundSprite.y -= (backgroundSprite.height - windowHeight) / 2;
    }

    // aladdin
    var sheet = PIXI.loader.resources["Assets/Images/Roles/Aladdin.json"].spritesheet;
    aladdin = new Role("Aladdin", sheet, windowWidth / 8, windowHeight / 2, gScale, gScale);
    aladdin.CreateAnimation("Idle", 0.05);
    aladdin.CreateAnimation("Hit", 0.05);
    aladdin.CreateAnimation("Skill", 0.1);
    aladdin.CreateAnimation("Effect", 0.1);
    aladdin.CreateSkillUI();
    aladdin.CreateBloodBar(new PIXI.Sprite(PIXI.loader.resources["Assets/Images/BloodBar.png"].texture));

    // aladdin2
    sheet = PIXI.loader.resources["Assets/Images/Roles/Aladdin.json"].spritesheet;
    aladdin2 = new Role("Aladdin", sheet, windowWidth * 7 / 8, windowHeight / 2, -gScale, gScale);
    aladdin2.CreateAnimation("Idle", 0.05);
    aladdin2.CreateAnimation("Hit", 0.05);
    aladdin2.CreateAnimation("Skill", 0.1);
    aladdin2.CreateAnimation("Effect", 0.1);
    aladdin2.CreateBloodBar(new PIXI.Sprite(PIXI.loader.resources["Assets/Images/BloodBar.png"].texture));

    // 激活目标
    activation = new PIXI.Sprite(PIXI.loader.resources["Assets/Images/Activation.png"].texture);
    target = new PIXI.Sprite(PIXI.loader.resources["Assets/Images/Target.png"].texture);
    activation.anchor.set(0.5);
    target.anchor.set(0.5);
    app.stage.addChild(activation);
    app.stage.addChild(target);

    // 技能UI
    skillUI = new PIXI.Sprite(PIXI.loader.resources["Assets/Images/SkillUI.png"].texture);
    skillUI.x = windowWidth - skillUI.width;
    skillUI.y = windowHeight - skillUI.height;
    app.stage.addChild(skillUI);
    UpdateSkillUI(aladdin);
}

function UpdateSkillUI(obj)
{
    skillUI.removeChildren();
    if (null != obj._SkillUI0) {
        skillUI.addChild(obj._SkillUI0);
        obj._SkillUI0.x += skillUI.width * 0.2;
        obj._SkillUI0.y += skillUI.height * 0.65;
    }
    if (null != obj._SkillUI1) {
        skillUI.addChild(obj._SkillUI1);
        obj._SkillUI1.x = skillUI.width * 0.5;
        obj._SkillUI1.y += skillUI.height * 0.65;
    }
    if (null != obj._SkillUI2) {
        skillUI.addChild(obj._SkillUI2);
        obj._SkillUI2.x += skillUI.width * 0.8;
        obj._SkillUI2.y += skillUI.height * 0.65;
    }

    activation.x = obj._X;
    activation.y = obj._Y - obj._Idle.height * 0.25;
    target.x = aladdin2._X;
    target.y = aladdin2._Y - aladdin2._Idle.height * 0.25;
}