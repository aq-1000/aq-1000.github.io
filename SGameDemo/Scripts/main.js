let windowWidth = window.innerWidth, windowHeight = window.innerHeight;

// Create aPixi Application
let app = new PIXI.Application({width: 720, height: 1280});

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

    let idleFrames = [];
    idleFrames.push(PIXI.Texture.fromFrame("Aladdin_Idle0.png"));
    idleFrames.push(PIXI.Texture.fromFrame("Aladdin_Idle1.png"));
    idleFrames.push(PIXI.Texture.fromFrame("Aladdin_Idle2.png"));
    var animIdle = new PIXI.extras.AnimatedSprite(idleFrames);
    animIdle.x = app.screen.width / 2;
    animIdle.y = app.screen.height / 2;
    animIdle.anchor.set(0.5);
    animIdle.animationSpeed = 0.05;
    animIdle.play();
    app.stage.addChild(animIdle);
}