let windowWidth = window.innerWidth, windowHeight = window.innerHeight;

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
    .load(_OnAssetsLoaded);

// 背景图加载完成
function _OnAssetsLoaded()
{
    let backgroundSprite = new PIXI.Sprite(PIXI.loader.resources["Assets/Images/Background.png"].texture);
    app.stage.addChild(backgroundSprite);
    backgroundSprite.height = (windowWidth / backgroundSprite.width) * backgroundSprite.height;
    backgroundSprite.width = windowWidth;

    let aladdinSheets = PIXI.loader.resources["Assets/Images/Aladdin.json"].spritesheet;
    let aladdinIdle = new PIXI.extras.AnimatedSprite(aladdinSheets.animations["Aladdin_Idle"]);
    aladdinIdle.x = app.screen.width / 2;
    aladdinIdle.y = app.screen.height / 2;
    aladdinIdle.anchor.set(0.5);
    aladdinIdle.animationSpeed = 0.05;
    aladdinIdle.loop = true;
//    aladdinIdle.onComplete = function(){ aladdinIdle.visible = false; };
//    aladdinIdle.play();
    aladdinIdle.visible = false;
    app.stage.addChild(aladdinIdle);

    let aladdinHit = new PIXI.extras.AnimatedSprite(aladdinSheets.animations["Aladdin_Hit"]);
    aladdinHit.x = 150;
    aladdinHit.y = app.screen.height / 2;
    aladdinHit.anchor.set(0.5);
    aladdinHit.animationSpeed = 0.05;
    aladdinHit.loop = true;
//    animHit.onComplete = function(){ animHit.visible = false; };
    aladdinHit.play();
    app.stage.addChild(aladdinHit);

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