// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
  heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
  monsterReady = true;
};
monsterImage.src = "images/monster.png";

var bossReady = false;
var bossImage = new Image();
bossImage.onload = function() {
  bossReady = true;
}
bossImage.src = "images/boss.png";

var swordReady = false;
var swordImage = new Image();
swordImage.onload = function() {
  swordReady = true;
}
swordImage.src = "images/sword.png";

var potionReady = false;
var potionImage = new Image();
potionImage.onload = function() {
  potionReady = true;
}
potionImage.src = "images/potion.png";

// Game objects
var hero = {
  id: "hero",
  hp: 100,
  dmg: 0,
  weapon: "none",
  speed: 256 // movement in pixels per second
};
var monster = {
  id: "monster",
  hp: 25,
  dmg: 5
};
var boss = {
  id: "boss",
  hp: 300,
  dmg: 15
}
var sword = {
  id: "sword",
  dmg: 50
}
var potion = {
  id: "potion",
  hp: 25
}

var envThings = [monster, boss, sword, potion]
var livingThings = [hero, monster, boss]

var monstersCaught = 0;
var bossesDefeated = 0;
var potionsDrank = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);


// Reset the game when the player catches a monster
var reset = function () {
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;
  hero.weapon = "none";
  hero.hp = 100
  hero.dmg = 5
  hero.ready = true


  // Throw the monster somewhere on the screen randomly
  monster.x = 32 + (Math.random() * (canvas.width - 64));
  monster.y = 32 + (Math.random() * (canvas.height - 64));
  monster.hp = 25
  monsterReady = true

  // Throw the monster somewhere on the screen randomly
  boss.x = 64 + (Math.random() * (canvas.width - 128));
  boss.y = 64 + (Math.random() * (canvas.height - 128));
  boss.hp = 300
  bossReady = true

  
  // Throw the monster somewhere on the screen randomly
  sword.x = 32 + (Math.random() * (canvas.width - 64));
  sword.y = 32 + (Math.random() * (canvas.height - 64));
  swordReady = true

  // Throw the monster somewhere on the screen randomly
  potion.x = 32 + (Math.random() * (canvas.width - 64));
  potion.y = 32 + (Math.random() * (canvas.height - 64));
  potion.hp = 25
  potionReady = true

  //reset the time
  combatThen = Date.now()
};

// Update game objects
var update = function (modifier) {
  if (38 in keysDown) { // Player holding up
    hero.y -= hero.speed * modifier;
  }
  if (40 in keysDown) { // Player holding down
    hero.y += hero.speed * modifier;
  }
  if (37 in keysDown) { // Player holding left
    hero.x -= hero.speed * modifier;
  }
  if (39 in keysDown) { // Player holding right
    hero.x += hero.speed * modifier;
  }


  if (
    boss.hp <= 0 
  ) {
    bossesDefeated += 1
    reset();
  }

  if (
    hero.hp <= 0 
  ) {
    reset();
  }

  if (
    monster.hp <= 0
  ) {
    monstersCaught += 1
    respawnThing(monster);
  }

  checkContact(envThings);

};


var checkContact = function(things) {
  for(
    var i=0, j=things.length; 
    i < j;
    i++
  ) {
    var thing = things[i]
    if (
      hero.x <= (thing.x + 32)
      && thing.x <= (hero.x + 32)
      && hero.y <= (thing.y + 32)
      && thing.y <= (hero.y + 32)
    ) {
      resolveContact(thing);
    }
  }
}


var resolveContact = function(thing) {
  if(thing.id === "boss" || thing.id === "monster") {
    console.log("touching enemy")
    resolveCombat(thing, combatThen);
  } else if (thing.id === "potion") {
    console.log("picked up potion")
    pickupPotion();
  } else if (thing.id === "sword") {
    console.log("POWER UP!!")
    pickupSword();
  }
}

var pickupPotion = function() {
  while(
    hero.hp < 100
    && potion.hp > 0
  ) {
    hero.hp += 1
    potion.hp -= 1
  }
  respawnThing(potion)
}

var respawnThing = function(thing){
  thing.x = 32 + (Math.random() * (canvas.width - 64));
  thing.y = 32 + (Math.random() * (canvas.height - 64));
  thing.hp = 50
}

var pickupSword = function() {
  hero.weapon = "sword"
  swordReady = false
}


var resolveCombat = function(enemy, prevCombatThen) {
  var cooldown = Date.now() - prevCombatThen
  if(cooldown > 3000){
    var heroAtk = 0
    heroAtk += hero.dmg
    combatThen = Date.now();
    if (
      hero.weapon === "sword"
    ) {
      heroAtk += sword.dmg
    }
    if (
      heroAtk >= enemy.hp
    ) {
      enemy.hp -= heroAtk
      console.log("hero killing blow: " + heroAtk.toString())
    } else {
      console.log("hero attack: " + heroAtk.toString())
      enemy.hp -= heroAtk
      hero.hp -= enemy.dmg
    }
  }
}

// Draw everything
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }

  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }

  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y);
  }

  if (bossReady) {
    ctx.drawImage(bossImage, boss.x, boss.y);
  }

  if (swordReady) {
    ctx.drawImage(swordImage, sword.x, sword.y);
  }

  if (potionReady) {
    ctx.drawImage(potionImage, potion.x, potion.y);
  }
  // Score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "12px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Goblins slain: " + monstersCaught, 32, 32);
  ctx.fillText("HP: " + hero.hp, 32, 50);
  ctx.fillText("Goblin HP: " + monster.hp, 32, 68);
  ctx.fillText("BOSS HP: " + boss.hp, 32, 86);
  ctx.fillText("weapon: " + hero.weapon, 32, 104);
};


// The main game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then, combatThen = Date.now();
reset();
main();




