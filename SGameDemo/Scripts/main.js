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

// 加载静态图
PIXI.loader
    .add("Assets/Images/Background.png")
    .add("Assets/Images/Aladdin.json")
    .on("progress", function(){
        // do something when loading
    })
    .load(onAssetsLoaded);

// 背景图加载完成
function onAssetsLoaded()
{
    let backgroundSprite = new PIXI.Sprite(PIXI.loader.resources["Assets/Images/Background.png"].texture);
    app.stage.addChild(backgroundSprite);

    // 调整背景图，铺满全屏，图片居中
    gScale = windowWidth / backgroundSprite.width;
    backgroundSprite.width = windowWidth;
    backgroundSprite.height = backgroundSprite.height * gScale;
    if (backgroundSprite.height > windowHeight) 
    {
        backgroundSprite.y -= (backgroundSprite.height - windowHeight) / 2;
    }

    // let aladdinSheets = PIXI.loader.resources["Assets/Images/Aladdin.json"].spritesheet;
    // let aladdinIdle = new PIXI.extras.AnimatedSprite(aladdinSheets.animations["Aladdin_Idle"]);
    // aladdinIdle.x = app.screen.width / 2;
    // aladdinIdle.y = app.screen.height / 2;
    // //   aladdinIdle.anchor.set(0.5);
    // aladdinIdle.animationSpeed = 0.05;
    // aladdinIdle.loop = true;
    // //    aladdinIdle.onComplete = function(){ aladdinIdle.visible = false; };
    // //    aladdinIdle.play();
    // aladdinIdle.visible = false;
    // app.stage.addChild(aladdinIdle);
    var sheet = PIXI.loader.resources["Assets/Images/Aladdin.json"].spritesheet;
    var aladdin = new Role("Aladdin", sheet, 200, app.screen.height / 2, gScale, gScale);
    aladdin.CreateAnimation("Idle", 0.05, true, true);
    aladdin.CreateAnimation("Hit", 0.05, false, false);

    sheet = PIXI.loader.resources["Assets/Images/Aladdin.json"].spritesheet;
    var aladdin2 = new Role("Aladdin", sheet, app.screen.width - 200, app.screen.height / 2, -gScale, gScale);
    aladdin2.CreateAnimation("Idle", 0.05, true, true);
    aladdin2.CreateAnimation("Hit", 0.05, false, false);

    // sheet = PIXI.loader.resources["Assets/Images/Aladdin.json"].spritesheet;
    // var aladdin3 = new Role("Aladdin", sheet, app.screen.width - 150, app.screen.height / 2);
    // aladdin3.CreateAnimation("Skill", 0.05, true, true);

    // let aladdinAttack = new PIXI.extras.AnimatedSprite(aladdinSheets.animations["Civ_SSR_Aladdin_00_Skill"]);
    // aladdinAttack.x = app.screen.width / 2;
    // aladdinAttack.y = app.screen.height / 2;
    // aladdinAttack.anchor.set(0.5);
    // aladdinAttack.animationSpeed = 0.1;
    // aladdinAttack.loop = false;
    // aladdinAttack.onComplete = function(){ aladdinAttack.visible = false; aladdinIdle.visible = true; aladdinIdle.play();};
    // aladdinAttack.play();
    // app.stage.addChild(aladdinAttack);
}