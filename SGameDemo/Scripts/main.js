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

let background  = null;
let endImage = null;
let prompt = null;
let promptText = null;  // 提示框文字
let aladdin = null;
let sinbad = null;
let anubis = null;
let serpentQueen = null;
let shedu = null;
let skillUI = null;
let victory = null;
let activateCircle = null;
let targetCircle = null;
let selectArrow = null;
let aniSpeed = 0.06;
let prepareEffect = null;
let skillUIEffect = null;
let sinbadEffects = [null, null, null];

let canClick = true;
let activateRole = null;
let targetRole = null;
let currentTurn = 0;

promptText = new PIXI.Text("", {fontFamily: "Arial", fontSize: 22, fill: "yellow"});
promptText.anchor.set(0.5);
promptText.x = windowWidth * 0.5;
promptText.y = windowHeight * 0.5;
app.stage.addChild(promptText);

// 加载静态图
PIXI.loader
    .add("Assets/Images/Background.png")
    .add("Assets/Images/end.png")
    .add("Assets/Images/Our.json")
    .add("Assets/Images/Enemy.json")
    .add("Assets/Images/Common.json")
    .on("progress", function(){
        // do something when loading
        promptText.text = "Loading:" + PIXI.loader.progress + "%";
//        console.log("Loading:" + PIXI.loader.progress + "%");
    })
    .load(onAssetsLoaded);

// Setup the animation loop.
function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}
requestAnimationFrame(animate);

// 背景图加载完成
function onAssetsLoaded()
{
    app.stage.removeChild(promptText);

    // 背景图
    background = new PIXI.Sprite(PIXI.loader.resources["Assets/Images/Background.png"].texture);
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
    if (background.height < windowHeight) {
        background.y += (windowHeight - background.height) * 0.5;
    } else {
        background.y -= (background.height - windowHeight);     // 图片底部和窗口持平
    }

    background.interactive = true;
    background.click = SelectSkill;
    background.touchend = SelectSkill;

    // end图
    endImage = new PIXI.Sprite(PIXI.loader.resources["Assets/Images/end.png"].texture);
    endImage.x = background.x;
    endImage.y = background.y;
    endImage.width = background.width;
    endImage.height = background.height;
    endImage.visible = false;
    endImage.interactive = true;
    // endImage.click = SelectSkill;
    // endImage.touchend = SelectSkill;

    // 激活目标
    var sheet = PIXI.loader.resources["Assets/Images/Common.json"].spritesheet;
    activateCircle = new PIXI.extras.AnimatedSprite(sheet.animations["Activation"]);
    activateCircle.anchor.set(0.5);
    activateCircle.loop = true;
    activateCircle.animationSpeed = aniSpeed * 4;
    background.addChild(activateCircle);
    targetCircle = new PIXI.extras.AnimatedSprite(sheet.animations["Target"]);
    targetCircle.anchor.set(0.5);
    targetCircle.loop = true;
    targetCircle.animationSpeed = aniSpeed * 4;
    background.addChild(targetCircle);

    // aladdin
    sheet = PIXI.loader.resources["Assets/Images/Our.json"].spritesheet;
    aladdin = new Role("Aladdin", background, sheet, true, BGWidth * 0.15, BGHeight * 0.55, 33000);
    aladdin.CreateAnimation("Idle", aniSpeed);
    aladdin.CreateAnimation("Hit", aniSpeed);
    aladdin.CreateAnimation("Dead", aniSpeed * 1.5);
    aladdin.CreateAnimation("Skill", aniSpeed * 2);
    aladdin.CreateAnimation("Effect", aniSpeed);
    aladdin.CreateSkillUI();
    aladdin.CreateBloodBar();

    // sinbad
    sinbad = new Role("Sinbad", background, sheet, true, BGWidth * 0.15, BGHeight * 0.75, 33000);
    sinbad.CreateAnimation("Idle", aniSpeed);
    sinbad.CreateAnimation("Hit", aniSpeed);
    sinbad.CreateAnimation("Skill", aniSpeed * 2);
    // sinbad.CreateAnimation("Effect", aniSpeed);
    sinbad.CreateSkillUI();
    sinbad.CreateBloodBar();

    // serpentQueen
    sheet = PIXI.loader.resources["Assets/Images/Enemy.json"].spritesheet;
    serpentQueen = new Role("SerpentQueen", background, sheet, false, BGWidth * 0.85, BGHeight * 0.5, 1024);
    serpentQueen.CreateAnimation("Idle", aniSpeed);
    serpentQueen.CreateAnimation("Hit", aniSpeed);
    serpentQueen.CreateAnimation("Dead", aniSpeed * 2);
    serpentQueen.CreateBloodBar();
    
    // anubis
    anubis = new Role("Anubis", background, sheet, false, BGWidth * 0.85, BGHeight * 0.63, 65535);
    anubis.CreateAnimation("Idle", aniSpeed);
    anubis.CreateAnimation("Hit", aniSpeed);
    anubis.CreateAnimation("Dead", aniSpeed * 2);
    anubis.CreateAnimation("Skill", aniSpeed * 2);
    anubis.CreateAnimation("Effect", aniSpeed * 3);
    anubis.CreateBloodBar();

    // shedu
    shedu = new Role("Shedu", background, sheet, false, BGWidth * 0.85, BGHeight * 0.775, 1024);
    shedu.CreateAnimation("Idle", aniSpeed);
    shedu.CreateAnimation("Hit", aniSpeed);
    shedu.CreateAnimation("Dead", aniSpeed * 2);
    shedu.CreateBloodBar();

    // PrepareEffect
    sheet = PIXI.loader.resources["Assets/Images/Common.json"].spritesheet;
    prepareEffect = new PIXI.extras.AnimatedSprite(sheet.animations["Prepare_Effect"]);
    prepareEffect.anchor.set(0.5);
    prepareEffect.animationSpeed = aniSpeed * 5;
    prepareEffect.visible = false;
    prepareEffect.loop = false;
    background.addChild(prepareEffect);

    // skillUIEffect
    skillUIEffect  = new PIXI.extras.AnimatedSprite(sheet.animations["Skill_Selected"]);
    skillUIEffect.anchor.set(0.5);
    skillUIEffect.animationSpeed = aniSpeed * 2;
    skillUIEffect.loop = true;

    // 技能UI
    skillUI = new PIXI.Sprite(sheet.textures["SkillUI.png"]);
    skillUI.x = BGWidth - skillUI.width;
    skillUI.y = BGHeight - skillUI.height;
    // skillUI.interactive = true;
    // skillUI.click = SelectSkill;
    // skillUI.touchend = SelectSkill;
    background.addChild(skillUI);
    selectArrow = new PIXI.Sprite(sheet.textures["SelectArrow.png"]);
    selectArrow.anchor.set(0.5);

    // 提示框
    prompt = new PIXI.Sprite(sheet.textures["Prompt.png"]);
    prompt.anchor.set(0.5);
    prompt.x = windowWidth * 0.5;
    prompt.y = windowHeight * 0.5;
    prompt.scale.x = gScale;
    prompt.scale.y = gScale;
    prompt.visible = true;
    app.stage.addChild(prompt);
    promptText.x = 0;
    promptText.y = 0;
    prompt.addChild(promptText);

    // 胜利
    victory = new PIXI.Sprite(sheet.textures["Victory.png"]);
    victory.anchor.set(0.5);
    victory.x = windowWidth * 0.5;
    victory.y = windowHeight * 0.5;
    victory.scale.x = gScale;
    victory.scale.y = gScale;
    victory.visible = false;
    app.stage.addChild(victory);

    UpdateTurn();
    SelectAnubis();
}

function UpdateTurn()
{
    skillUI.removeChildren();
    if (1 == currentTurn)
    {
        activateRole = aladdin;
    }
    else {
        activateRole = sinbad;
    }
    
    let height = skillUI.height * 0.1;
    if (null != activateRole._SkillUI0) {
        skillUI.addChild(activateRole._SkillUI0);
        activateRole._SkillUI0.x = skillUI.width * 0.08;
        activateRole._SkillUI0.y = height;
    }
    if (null != activateRole._SkillUI1) {
        skillUI.addChild(activateRole._SkillUI1);
        activateRole._SkillUI1.x = skillUI.width * 0.39;
        activateRole._SkillUI1.y = height;
    }
    if (null != activateRole._SkillUI2) {
        skillUI.addChild(activateRole._SkillUI2);
        activateRole._SkillUI2.x = skillUI.width * 0.697;
        activateRole._SkillUI2.y = height;
    }

    if (0 < currentTurn) {
        skillUI.addChild(skillUIEffect);
        skillUIEffect.x = skillUI.width * 0.5;
        skillUIEffect.y = skillUI.height * 0.48;
        selectArrow.x = skillUI.width * 0.5;
        selectArrow.y = skillUI.height * 0.1;
    } else {
        skillUI.addChild(skillUIEffect);
        skillUIEffect.x = skillUI.width * 0.18;
        skillUIEffect.y = skillUI.height * 0.48;
        selectArrow.x = skillUI.width * 0.186;
        selectArrow.y = skillUI.height * 0.1;
    }
    skillUIEffect.gotoAndPlay(0);
    skillUI.addChild(selectArrow);

    activateCircle.x = activateRole._X;
    activateCircle.y = activateRole._Y + activateRole._Idle.height * 0.23;
    activateCircle.gotoAndPlay(0);

    // 箭头上下抖动
    var coords = { x: 0, y: selectArrow.y };
    var tween = new TWEEN.Tween(coords)
        .to({ x: Math.PI, y: selectArrow.y}, 600)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function() {
            selectArrow.y = coords.y - selectArrow.height * 0.15 * Math.sin(coords.x);
            selectArrow.visible = true;
        })
        .repeat(Infinity)
        .start();
    
    if (currentTurn == 0) {
        promptText.text = "      لا تدع أبطالك يخسرون \nقم بالضغط على المهارة لبدأ القتال";
        prompt.visible = true;
    } else if (currentTurn == 1) {
        promptText.text = "         ! لقد تلقيت ضربة  \n! م بعلاج صديق بتلك المهارة الفتاكة";
        prompt.visible = true;
    }
    
}

function SelectAnubis()
{
    if (!canClick) {
        return;
    }
    targetRole = anubis;
    targetCircle.x = targetRole._X;
    targetCircle.y = targetRole._Y + targetRole._Idle.height * 0.24;
    targetCircle.gotoAndPlay(0);
}

function SelectSkill()
{
    if (!canClick) {
        return;
    }

    if (victory.visible) {
        endImage.visible = true;
        app.stage.addChild(endImage);
        return;
    }
    prompt.visible = false;
    canClick = false;
    activateRole.Skill();
    prepareEffect.visible = true;
    prepareEffect.gotoAndPlay(0);
    prepareEffect.x = activateRole._X;
    prepareEffect.y = activateRole._Y;
    prepareEffect.onComplete = function(){ prepareEffect.visible = false; };
    activateRole._Skill.onComplete = function(){ 
        activateRole._Skill.visible = false; 
        activateRole._Idle.visible = true;
        activateRole._Idle.gotoAndPlay(0);
        if (currentTurn == 0) {
            PlaySinbadEffect0(shedu, -65535);
            PlaySinbadEffect0(anubis, -17384);
            PlaySinbadEffect0(serpentQueen, -65535);
        }
        else if (currentTurn == 1) {
            PlayAladdinEffect(sinbad, 33000)
        }
        else if (currentTurn == 2) {
            PlaySinbadEffect1(0, anubis, -17384);
            PlaySinbadEffect1(1, anubis, -17384);
            PlaySinbadEffect1(2, anubis, -17384);
        }
    };
}

function PlaySinbadEffect0(target, damege)
{
    var effect = sinbad.CreateAnimation("Effect", aniSpeed);
    var coords = { x: sinbad._X, y: sinbad._Y }; // Start at (0, 0)
    var tween0 = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to({ x: target._X, y: target._Y }, 500) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
        .onUpdate(function() { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
        //    box.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)');
            effect.x = coords.x;
            effect.y = coords.y;
            effect.visible = true;
        })
        .onComplete(function() {
            TargetHit(target, damege);
            background.removeChild(effect);
        })
        .start(); // Start the tween immediately.
}

function PlayAladdinEffect(target, damege)
{
    aladdin._Effect.x = target._X;
    aladdin._Effect.y = target._Y;
    aladdin._Effect.scale.x = 2;
    aladdin._Effect.scale.y = 2;
    aladdin._Effect.visible = true;
    aladdin._Effect.gotoAndPlay(0);
    aladdin._Effect.onComplete = function() {
        aladdin._Effect.visible = false;

        // 阿拉丁自己扣血
        // ShowDamege(-aladdin._MAXHP * 0.5, aladdin);
        // aladdin._HP *= 0.5;
        // if (aladdin._HP <= 0) {
        //     aladdin._InterBar.scale.x = 0;
        // } else {
        //     aladdin._InterBar.scale.x = aladdin._HP / aladdin._MAXHP;
        // }

        ShowDamege(damege, target);
        target._HP += damege;
        if (target._HP > target._MAXHP)
        {
            target._HP = target._MAXHP
        }
        if (target._HP <= 0) {
            target._InterBar.scale.x = 0;
        } else {
            target._InterBar.scale.x = target._HP / target._MAXHP;
        }

        AttackBack(-19862);
    }
}

function PlaySinbadEffect1(index, target, damege)
{
    var effect = sinbad.CreateAnimation("Effect", aniSpeed);
    var coords = { x: sinbad._X, y: sinbad._Y }; // Start at (0, 0)
    var tween0 = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to({ x: target._X, y: target._Y }, 800 - index * 150) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
        .onUpdate(function() { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
        //    box.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)');
            effect.x = coords.x;
            effect.y = coords.y;
            effect.visible = true;
        })
        .onComplete(function() {
            TargetHit(target, damege);
            background.removeChild(effect);
        })
        .start(); // Start the tween immediately.
}

function TargetHit(target, damege)
{
    target.Hit();
    ShowDamege(damege, target);
    target._HP += damege;
    if (target._HP <= 0) {
        target._InterBar.scale.x = 0;
    } else {
        target._InterBar.scale.x = target._HP / target._MAXHP;
    }
    target._Hit.onComplete = function(){ 
        target._Hit.visible = false;
        if (target._HP <= 0) {
            target._BloodBar.visible = false;
            if (target._Dead != null)
            {
                target._Dead.visible = true;
                target._Dead.gotoAndPlay(0);
            }
        } else {
            target._Idle.visible = true;
            target._Idle.gotoAndPlay(0);   
        }
        
        if (target == anubis && anubis._Idle.visible) {
            AttackBack(-19862);
        } else {
            if (serpentQueen._HP > 0 || shedu._HP > 0 || anubis._HP > 0) {
                // canClick = true;
                // currentTurn += 1;
                // UpdateTurn();
            }
            else {
                canClick = true;
                targetCircle.visible = false;
                victory.visible = true;
                setTimeout(function() {
                    if (!endImage.visible) {
                        endImage.visible = true;
                        app.stage.addChild(endImage);
                    }
                }, 1000);
            }
        }
    };
}

// anubis反击
function AttackBack(damege) {
    prepareEffect.visible = true;
    prepareEffect.gotoAndPlay(0);
    prepareEffect.x = anubis._X;
    prepareEffect.y = anubis._Y;
    prepareEffect.onComplete = function () {
        prepareEffect.visible = false;
        anubis.Skill();
        var coords = { x: anubis._X, y: anubis._Y };
        var tween = new TWEEN.Tween(coords)
            .to({ x: activateRole._X + activateRole._Idle.width * 0.5, y: activateRole._Y }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function () {
                anubis._Skill.x = coords.x;
                anubis._Skill.y = coords.y;
            })
            .onComplete(function () {
                activateRole.Hit();

                // anubis特效
                anubis._Effect.visible = true;
                anubis._Effect.gotoAndPlay(0);
                anubis._Effect.x = activateRole._X;
                anubis._Effect.y = activateRole._Y;

                ShowDamege(damege, activateRole);
                activateRole._HP += damege;
                if (activateRole._HP <= 0) {
                    activateRole._InterBar.scale.x = 0;
                }
                else {
                    activateRole._InterBar.scale.x = activateRole._HP / activateRole._MAXHP;
                }
                // 我方死亡判断
                activateRole._Hit.onComplete = function () {
                    activateRole._Hit.visible = false;
                    if (activateRole._HP <= 0) {
                        activateRole._BloodBar.visible = false;
                        if (activateRole._Dead != null) {
                            activateRole._Dead.visible = true;
                            activateRole._Dead.gotoAndPlay(0);
                        }
                    }
                    else {
                        activateRole._Idle.visible = true;
                        activateRole._Idle.gotoAndPlay(0);
                    }
                    canClick = true;
                    currentTurn += 1;
                    UpdateTurn();
                };
            })
            .start();
        anubis._Skill.onComplete = function () {
            anubis._Skill.x = anubis._X;
            anubis._Skill.y = anubis._Y;
            anubis._Skill.visible = false;
            anubis._Idle.visible = true;
        };
    };
}

function ShowDamege(text, role)
{
    var damageText = null;
    if (text < 0) {
        damageText = new PIXI.Text(text, {fontFamily: "Arial", fontSize: 22, fill: "red"});
    } else {
        damageText = new PIXI.Text("+" + text, {fontFamily: "Arial", fontSize: 22, fill: "green"});
    }
        
    damageText.anchor.set(0.5);
    background.addChild(damageText);
    damageText.position.set(role._X, role._Y);

    var coords = { x: role._X, y: role._Y };
    var tween = new TWEEN.Tween(coords)
        .to({ x: role._X + role._Hit.width * 0.1, y: role._Y - role._Hit.height * 0.25}, 400)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(function() {
            damageText.x = coords.x;
            damageText.y = coords.y;
        })
        .onComplete(function() {
            damageText.visible = false;
            background.removeChild(damageText);
        })
        .start();
}