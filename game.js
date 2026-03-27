// ─────────────────────────────────────────────────────────────────────────────
//  Space Shooter — Milestone 3
//  3 Stages · 3 Bosses · Main Menu · High Score · Damage States
// ─────────────────────────────────────────────────────────────────────────────

const W  = 480;
const H  = 640;
const LC = 'Legacy Collection/Assets';
const KN = 'assets';

// ── Wave configs per stage ────────────────────────────────────────────────────
const WAVE_CONFIGS = [
  // Stage 1
  [
    [{ type:'small', count:8 }],
    [{ type:'small', count:5 }, { type:'medium', count:3 }],
    [{ type:'small', count:3 }, { type:'medium', count:3 }, { type:'large', count:2 }],
    [{ type:'medium', count:4 }, { type:'large', count:3 }],
    [{ type:'medium', count:2 }, { type:'large', count:4 }],
  ],
  // Stage 2 – faster, denser
  [
    [{ type:'small', count:6 }, { type:'medium', count:2 }],
    [{ type:'small', count:4 }, { type:'medium', count:4 }],
    [{ type:'medium', count:4 }, { type:'large', count:3 }],
    [{ type:'medium', count:3 }, { type:'large', count:4 }],
    [{ type:'large', count:6 }],
  ],
  // Stage 3 – hardest
  [
    [{ type:'medium', count:5 }, { type:'large', count:3 }],
    [{ type:'medium', count:4 }, { type:'large', count:4 }],
    [{ type:'large', count:6 }],
    [{ type:'medium', count:6 }, { type:'large', count:3 }],
    [{ type:'large', count:8 }],
  ],
  // Stage 4 – extreme
  [
    [{ type:'medium', count:6 }, { type:'large', count:5 }],
    [{ type:'large', count:9 }],
    [{ type:'medium', count:5 }, { type:'large', count:7 }],
    [{ type:'large', count:11 }],
    [{ type:'medium', count:4 }, { type:'large', count:9 }],
  ],
];

// ── Stage backgrounds [back, stars, planet] ───────────────────────────────────
const STAGE_BG = [
  ['bg-back',       'bg-stars',       'bg-planet'],
  ['bg-blue-back',  'bg-blue-stars',  null],
  ['bg-old-back',   'bg-old-stars',   'bg-old-far'],
  ['bg-back',       'bg-old-bigpl',   'bg-old-ring'],   // stage 4: dark with ominous planets
];

// ── Enemy definitions ─────────────────────────────────────────────────────────
const ENEMY_DEF = {
  small: {
    sprite:'enemy-small', frames:5, hp:1, speed:90, scale:2, wobble:true,
    fireMin:4.0, fireMax:7.5, shots:1, spread:0,
    bullet:'enemy-proj', bulletSpd:145, bulletScale:2, animated:true,
    score:100, deathAnim:'exp-a-anim', deathSprite:'exp-a', deathScale:1.4,
  },
  medium: {
    sprite:'enemy-medium', frames:4, hp:2, speed:60, scale:2, wobble:false,
    fireMin:2.5, fireMax:5.0, shots:1, spread:0,
    bullet:'lb2', bulletSpd:165, bulletScale:2.5, animated:false,
    score:200, deathAnim:'exp-c-anim', deathSprite:'exp-c', deathScale:1.2,
  },
  large: {
    sprite:'enemy-large', frames:4, hp:3, speed:42, scale:2.2, wobble:false,
    fireMin:3.0, fireMax:5.5, shots:2, spread:0.28,
    bullet:'lb3', bulletSpd:130, bulletScale:3, animated:false,
    score:350, deathAnim:'exp-d-anim', deathSprite:'exp-d', deathScale:1.0,
  },
};

// ── Power-up config ───────────────────────────────────────────────────────────
const PU_SPRITES  = { shield:'pu1', double:'pu2', speed:'pu3', bomb:'pu4', triple:'pu-triple', rocket:'pu-rocket' };
const PU_COLORS   = { shield:0x00aaff, double:0xffff00, speed:0x00ff88, bomb:0xff4400, triple:0x00ffff, rocket:0xff6600 };
const PU_DURATION = { shield:8, double:12, speed:7, triple:14, rocket:12 };

// ── Leaderboard helpers ───────────────────────────────────────────────────────
function getLeaderboard() {
  try { return JSON.parse(localStorage.getItem('spaceShooterLB') || '[]'); }
  catch(e) { return []; }
}
function saveToLeaderboard(name, score) {
  const lb = getLeaderboard();
  lb.push({ name: (name || 'PILOT').trim().slice(0, 12), score });
  lb.sort((a, b) => b.score - a.score);
  if (lb.length > 10) lb.length = 10;
  localStorage.setItem('spaceShooterLB', JSON.stringify(lb));
  const hs = parseInt(localStorage.getItem('spaceShooterHS') || '0');
  if (score > hs) localStorage.setItem('spaceShooterHS', String(score));
}
function isTopTen(score) {
  const lb = getLeaderboard();
  return score > 0 && (lb.length < 10 || score > lb[lb.length - 1].score);
}

// ═════════════════════════════════════════════════════════════════════════════
//  PRELOAD SCENE
// ═════════════════════════════════════════════════════════════════════════════
class PreloadScene extends Phaser.Scene {
  constructor() { super({ key:'Preload' }); }

  preload() {
    this.add.rectangle(W/2, H/2, W-80, 20, 0x222222).setOrigin(0.5);
    const bar = this.add.rectangle(40, H/2, 0, 20, 0x00ff88).setOrigin(0, 0.5);
    this.add.text(W/2, H/2+32, 'LOADING…', { font:'14px monospace', fill:'#aaaaaa' }).setOrigin(0.5);
    this.load.on('progress', v => bar.setSize((W-80)*v, 20));

    // ── Stage 1 backgrounds ───────────────────────────────────────────────────
    this.load.image('bg-back',   `${LC}/Packs/SpaceShooter/Space Shooter files/background/layered/bg-back.png`);
    this.load.image('bg-stars',  `${LC}/Packs/SpaceShooter/Space Shooter files/background/layered/bg-stars.png`);
    this.load.image('bg-planet', `${LC}/Packs/SpaceShooter/Space Shooter files/background/layered/bg-planet.png`);

    // ── Stage 2 backgrounds (blue) ────────────────────────────────────────────
    this.load.image('bg-blue-back',  `${LC}/Environments/space_background_pack/Blue Version/layered/blue-back.png`);
    this.load.image('bg-blue-stars', `${LC}/Environments/space_background_pack/Blue Version/layered/blue-with-stars.png`);

    // ── Stage 3 backgrounds (old parallax) ───────────────────────────────────
    this.load.image('bg-old-back',  `${LC}/Environments/space_background_pack/Old Version/layers/parallax-space-backgound.png`);
    this.load.image('bg-old-stars', `${LC}/Environments/space_background_pack/Old Version/layers/parallax-space-stars.png`);
    this.load.image('bg-old-far',   `${LC}/Environments/space_background_pack/Old Version/layers/parallax-space-far-planets.png`);
    this.load.image('bg-old-ring',  `${LC}/Environments/space_background_pack/Old Version/layers/parallax-space-ring-planet.png`);
    this.load.image('bg-old-bigpl', `${LC}/Environments/space_background_pack/Old Version/layers/parallax-space-big-planet.png`);
    this.load.image('space-stage',  `${LC}/Environments/top-down-space-environment/PNG/layers/stage-back.png`);

    // ── Player ship  (240×48 → 5f of 48×48) ──────────────────────────────────
    this.load.spritesheet('ship',
      `${LC}/Characters/top-down-shooter-ship/spritesheets/red/ship-01.png`,
      { frameWidth:48, frameHeight:48 });
    this.load.spritesheet('ship-thrust',
      `${LC}/Characters/top-down-shooter-ship/spritesheets/thrust/ship-01.png`,
      { frameWidth:16, frameHeight:10 });

    // ── Player damage overlays (Kenney, 99-112×76 each) ───────────────────────
    this.load.image('dmg1', `${KN}/space-shooter-redux/PNG/Damage/playerShip1_damage1.png`);
    this.load.image('dmg2', `${KN}/space-shooter-redux/PNG/Damage/playerShip1_damage2.png`);
    this.load.image('dmg3', `${KN}/space-shooter-redux/PNG/Damage/playerShip1_damage3.png`);

    // ── Enemies ───────────────────────────────────────────────────────────────
    this.load.spritesheet('enemy-small',
      `${LC}/Characters/top-down-shooter-enemies/spritesheets/enemy-01.png`,
      { frameWidth:48, frameHeight:48 });
    this.load.spritesheet('enemy-medium',
      `${LC}/Characters/top-down-shooter-enemies/spritesheets/enemy-02.png`,
      { frameWidth:48, frameHeight:48 });
    this.load.spritesheet('enemy-large',
      `${LC}/Characters/top-down-shooter-enemies/spritesheets/enemy-03.png`,
      { frameWidth:48, frameHeight:48 });
    this.load.spritesheet('enemy-death',
      `${LC}/Characters/top-down-shooter-enemies/spritesheets/enemy-explosion.png`,
      { frameWidth:80, frameHeight:80 });

    // ── Alien flying enemy  (664×64 → 8f of 83×64) ───────────────────────────
    this.load.spritesheet('alien-enemy',
      `${LC}/Characters/alien-flying-enemy/spritesheet.png`,
      { frameWidth:83, frameHeight:64 });

    // ── Explosions ────────────────────────────────────────────────────────────
    this.load.spritesheet('exp-a',
      `${LC}/Misc/Explosions pack/explosion-1-a/spritesheet.png`,
      { frameWidth:32, frameHeight:32 });       // 8f – small enemies
    this.load.spritesheet('exp-b',
      `${LC}/Misc/Explosions pack/explosion-1-b/spritesheet.png`,
      { frameWidth:64, frameHeight:64 });       // 8f – boss pieces
    this.load.spritesheet('exp-c',
      `${LC}/Misc/Explosions pack/explosion-1-c/spritesheet.png`,
      { frameWidth:128, frameHeight:80 });      // 10f – medium enemies
    this.load.spritesheet('exp-d',
      `${LC}/Misc/Explosions pack/explosion-1-d/spritsheet.png`,
      { frameWidth:128, frameHeight:128 });     // 12f – large enemies / boss
    this.load.spritesheet('exp-f',
      `${LC}/Misc/Explosions pack/explosion-1-f/Sprites.png`,
      { frameWidth:48, frameHeight:48 });       // 8f – asteroids
    this.load.spritesheet('exp-g',
      `${LC}/Misc/Explosions pack/explosion-1-g/spritesheet.png`,
      { frameWidth:48, frameHeight:48 });       // 7f – asteroids alt
    this.load.spritesheet('explosion',
      `${LC}/Misc/Explosion/spritesheet/explosion-animation.png`,
      { frameWidth:112, frameHeight:128 });     // 9f – general

    // ── Player bullets ────────────────────────────────────────────────────────
    this.load.image('bullet',  `${LC}/Packs/SpaceShooter/Space Shooter files/shoot/shoot1.png`);
    this.load.image('bullet2', `${LC}/Packs/SpaceShooter/Space Shooter files/shoot/shoot2.png`);
    this.load.image('flash',   `${LC}/Packs/SpaceShooter/Space Shooter files/flash/flash.png`);
    ['hit1','hit2','hit3','hit4'].forEach(k =>
      this.load.image(k, `${LC}/Packs/SpaceShooter/Space Shooter files/Hit/sprites/${k}.png`));

    // ── Warped shooting fx ────────────────────────────────────────────────────
    // warp-bolt  192×32 → 4f of 48×32
    this.load.spritesheet('warp-bolt',
      `${LC}/Misc/Warped shooting fx/Bolt/spritesheet.png`,
      { frameWidth:48, frameHeight:32 });
    // warp-charged  378×48 → 6f of 63×48
    this.load.spritesheet('warp-charged',
      `${LC}/Misc/Warped shooting fx/charged/spritesheet.png`,
      { frameWidth:63, frameHeight:48 });
    // warp-crossed  192×32 → 6f of 32×32
    this.load.spritesheet('warp-crossed',
      `${LC}/Misc/Warped shooting fx/crossed/spritesheet.png`,
      { frameWidth:32, frameHeight:32 });

    // ── Enemy projectiles ─────────────────────────────────────────────────────
    this.load.spritesheet('enemy-proj',
      `${LC}/Misc/EnemyProjectile/spritesheet.png`,
      { frameWidth:16, frameHeight:16 });
    this.load.image('lb2', `${LC}/Packs/SpaceShipShooter/Sprites/Laser Bolts/laser-bolts2.png`);
    this.load.image('lb3', `${LC}/Packs/SpaceShipShooter/Sprites/Laser Bolts/laser-bolts3.png`);
    this.load.image('lb4', `${LC}/Packs/SpaceShipShooter/Sprites/Laser Bolts/laser-bolts4.png`);

    // ── Power-ups (16×16 each) ────────────────────────────────────────────────
    this.load.image('pu1', `${LC}/Packs/SpaceShipShooter/Sprites/PowerUps/power-up1.png`);
    this.load.image('pu2', `${LC}/Packs/SpaceShipShooter/Sprites/PowerUps/power-up2.png`);
    this.load.image('pu3', `${LC}/Packs/SpaceShipShooter/Sprites/PowerUps/power-up3.png`);
    this.load.image('pu4', `${LC}/Packs/SpaceShipShooter/Sprites/PowerUps/power-up4.png`);

    // ── Asteroids ─────────────────────────────────────────────────────────────
    this.load.image('ast-a', `${LC}/Packs/SpaceShooter/Space Shooter files/asteroids/asteroid.png`);
    this.load.image('ast-b', `${LC}/Packs/SpaceShooter/Space Shooter files/asteroids/asteroid-small.png`);
    ['01','02','03','04','05'].forEach(n =>
      this.load.image(`ast-${n}`,
        `${LC}/Environments/top-down-space-environment/PNG/layers/cut-out-sprites/asteroid-${n}.png`));

    // ── Boss 1 – top-down-boss ────────────────────────────────────────────────
    this.load.spritesheet('boss1',
      `${LC}/Misc/top-down-boss/PNG/spritesheets/boss.png`,
      { frameWidth:192, frameHeight:144 });
    this.load.spritesheet('boss1-thrust',
      `${LC}/Misc/top-down-boss/PNG/spritesheets/boss-thrust.png`,
      { frameWidth:128, frameHeight:48 });
    this.load.spritesheet('boss1-bolt',
      `${LC}/Misc/top-down-boss/PNG/spritesheets/bolt.png`,
      { frameWidth:8, frameHeight:8 });
    this.load.spritesheet('boss1-rays',
      `${LC}/Misc/top-down-boss/PNG/spritesheets/rays.png`,
      { frameWidth:64, frameHeight:224 });
    this.load.image('cannon-left',  `${LC}/Misc/top-down-boss/PNG/spritesheets/cannon-left.png`);
    this.load.image('cannon-right', `${LC}/Misc/top-down-boss/PNG/spritesheets/cannon-right.png`);
    this.load.image('boss1-helmet', `${LC}/Misc/top-down-boss/PNG/spritesheets/helmet.png`);

    // ── Boss 2 – spaceship-unit  (424×77 → 4f of 106×77) ─────────────────────
    this.load.spritesheet('boss2',
      `${LC}/Misc/spaceship-unit/Spritesheets/separated sprites/spaceship-unit.png`,
      { frameWidth:106, frameHeight:77 });
    // thrust  48×24 → 2f of 24×24
    this.load.spritesheet('boss2-thrust',
      `${LC}/Misc/spaceship-unit/Spritesheets/separated sprites/thrust.png`,
      { frameWidth:24, frameHeight:24 });

    // ── Boss 3 – vehicle 3  (987×160 → 3f of 329×160) ────────────────────────
    this.load.spritesheet('boss3',
      `${LC}/Misc/Warped Vehicles Files/vehicle 3/spritesheet.png`,
      { frameWidth:329, frameHeight:160 });

    // ── Boss 4 – vehicle 1  (528×96 → 4f of 132×96) ──────────────────────────
    this.load.spritesheet('boss4',
      `${LC}/Misc/Warped Vehicles Files/vehicle 1/spritesheet.png`,
      { frameWidth:132, frameHeight:96 });
    this.load.image('boss4-thrust', `${LC}/Misc/Warped Vehicles Files/vehicle 1/thrust/thrust1.png`);

    // ── Stage 4 power-ups ─────────────────────────────────────────────────────
    this.load.image('pu-triple', `${KN}/space-shooter-redux/PNG/Power-ups/powerupBlue_bolt.png`);
    this.load.image('pu-rocket', `${KN}/space-shooter-redux/PNG/Power-ups/powerupRed_bolt.png`);

    // ── Rocket projectile ─────────────────────────────────────────────────────
    this.load.image('rocket-proj', `${KN}/space-shooter-extension/PNG/Sprites/Missiles/spaceMissiles_001.png`);

    // ── Sound FX ─────────────────────────────────────────────────────────────
    this.load.audio('snd-shoot',   `${LC}/Packs/SpaceShooter/Space Shooter files/Sound FX/shot 1.wav`);
    this.load.audio('snd-shoot2',  `${LC}/Packs/SpaceShooter/Space Shooter files/Sound FX/shot 2.wav`);
    this.load.audio('snd-explode', `${LC}/Packs/SpaceShooter/Space Shooter files/Sound FX/explosion.wav`);
    this.load.audio('snd-hit',     `${LC}/Packs/SpaceShooter/Space Shooter files/Sound FX/hit.wav`);
  }

  create() {
    // ── Player ────────────────────────────────────────────────────────────────
    this.anims.create({ key:'ship-idle',
      frames: this.anims.generateFrameNumbers('ship', { start:0, end:4 }),
      frameRate:8, repeat:-1 });
    this.anims.create({ key:'ship-thrust-anim',
      frames: this.anims.generateFrameNumbers('ship-thrust', { start:0, end:1 }),
      frameRate:12, repeat:-1 });

    // ── Enemies ───────────────────────────────────────────────────────────────
    this.anims.create({ key:'enemy-idle',
      frames: this.anims.generateFrameNumbers('enemy-small', { start:0, end:4 }),
      frameRate:8, repeat:-1 });
    this.anims.create({ key:'enemy-medium-idle',
      frames: this.anims.generateFrameNumbers('enemy-medium', { start:0, end:3 }),
      frameRate:8, repeat:-1 });
    this.anims.create({ key:'enemy-large-idle',
      frames: this.anims.generateFrameNumbers('enemy-large', { start:0, end:3 }),
      frameRate:6, repeat:-1 });
    this.anims.create({ key:'alien-idle',
      frames: this.anims.generateFrameNumbers('alien-enemy', { start:0, end:7 }),
      frameRate:10, repeat:-1 });
    this.anims.create({ key:'enemy-die',
      frames: this.anims.generateFrameNumbers('enemy-death', { start:0, end:6 }),
      frameRate:14, repeat:0 });

    // ── Explosions ────────────────────────────────────────────────────────────
    this.anims.create({ key:'exp-a-anim',
      frames: this.anims.generateFrameNumbers('exp-a', { start:0, end:7 }),
      frameRate:16, repeat:0 });
    this.anims.create({ key:'exp-b-anim',
      frames: this.anims.generateFrameNumbers('exp-b', { start:0, end:7 }),
      frameRate:16, repeat:0 });
    this.anims.create({ key:'exp-c-anim',
      frames: this.anims.generateFrameNumbers('exp-c', { start:0, end:9 }),
      frameRate:16, repeat:0 });
    this.anims.create({ key:'exp-d-anim',
      frames: this.anims.generateFrameNumbers('exp-d', { start:0, end:11 }),
      frameRate:16, repeat:0 });
    this.anims.create({ key:'exp-f-anim',
      frames: this.anims.generateFrameNumbers('exp-f', { start:0, end:7 }),
      frameRate:16, repeat:0 });
    this.anims.create({ key:'exp-g-anim',
      frames: this.anims.generateFrameNumbers('exp-g', { start:0, end:6 }),
      frameRate:16, repeat:0 });
    this.anims.create({ key:'explode',
      frames: this.anims.generateFrameNumbers('explosion', { start:0, end:8 }),
      frameRate:15, repeat:0 });

    // ── Warped weapons ────────────────────────────────────────────────────────
    this.anims.create({ key:'warp-bolt-anim',
      frames: this.anims.generateFrameNumbers('warp-bolt', { start:0, end:3 }),
      frameRate:14, repeat:-1 });
    this.anims.create({ key:'warp-charged-anim',
      frames: this.anims.generateFrameNumbers('warp-charged', { start:0, end:5 }),
      frameRate:14, repeat:-1 });
    this.anims.create({ key:'warp-crossed-anim',
      frames: this.anims.generateFrameNumbers('warp-crossed', { start:0, end:5 }),
      frameRate:14, repeat:-1 });

    // ── Enemy projectile ──────────────────────────────────────────────────────
    this.anims.create({ key:'enemy-proj-anim',
      frames: this.anims.generateFrameNumbers('enemy-proj', { start:0, end:1 }),
      frameRate:10, repeat:-1 });

    // ── Boss 1 ────────────────────────────────────────────────────────────────
    this.anims.create({ key:'boss1-idle',
      frames: this.anims.generateFrameNumbers('boss1', { start:0, end:4 }),
      frameRate:6, repeat:-1 });
    this.anims.create({ key:'boss1-thrust',
      frames: this.anims.generateFrameNumbers('boss1-thrust', { start:0, end:1 }),
      frameRate:8, repeat:-1 });
    this.anims.create({ key:'boss1-bolt',
      frames: this.anims.generateFrameNumbers('boss1-bolt', { start:0, end:1 }),
      frameRate:10, repeat:-1 });
    this.anims.create({ key:'boss1-rays',
      frames: this.anims.generateFrameNumbers('boss1-rays', { start:0, end:10 }),
      frameRate:16, repeat:0 });

    // ── Boss 2 ────────────────────────────────────────────────────────────────
    this.anims.create({ key:'boss2-idle',
      frames: this.anims.generateFrameNumbers('boss2', { start:0, end:3 }),
      frameRate:8, repeat:-1 });
    this.anims.create({ key:'boss2-thrust',
      frames: this.anims.generateFrameNumbers('boss2-thrust', { start:0, end:1 }),
      frameRate:10, repeat:-1 });

    // ── Boss 3 ────────────────────────────────────────────────────────────────
    this.anims.create({ key:'boss3-idle',
      frames: this.anims.generateFrameNumbers('boss3', { start:0, end:2 }),
      frameRate:5, repeat:-1 });

    // ── Boss 4 ────────────────────────────────────────────────────────────────
    this.anims.create({ key:'boss4-idle',
      frames: this.anims.generateFrameNumbers('boss4', { start:0, end:3 }),
      frameRate:8, repeat:-1 });

    this.scene.start('Menu');
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  MENU SCENE
// ═════════════════════════════════════════════════════════════════════════════
class MenuScene extends Phaser.Scene {
  constructor() { super({ key:'Menu' }); }

  create() {
    // Scrolling star background
    this.bg = this.add.tileSprite(0, 0, W, H, 'bg-back').setOrigin(0).setDepth(0);
    this.st = this.add.tileSprite(0, 0, W, H, 'bg-stars').setOrigin(0).setDepth(1).setAlpha(0.6);

    // Animated player ship on menu
    const ship = this.add.sprite(W/2, H/2 - 60, 'ship').setScale(2.5).setDepth(3).play('ship-idle');
    this.tweens.add({ targets:ship, y: H/2 - 70, duration:1200, yoyo:true, repeat:-1, ease:'Sine.easeInOut' });

    // Title
    this.add.text(W/2, 90, 'SPACE', {
      font:'bold 54px monospace', fill:'#ffffff',
      stroke:'#0044ff', strokeThickness:6
    }).setOrigin(0.5).setDepth(4);
    this.add.text(W/2, 148, 'SHOOTER', {
      font:'bold 54px monospace', fill:'#00ff88',
      stroke:'#004400', strokeThickness:6
    }).setOrigin(0.5).setDepth(4);

    // High score
    const hs = parseInt(localStorage.getItem('spaceShooterHS') || '0');
    this.add.text(W/2, 230, `HIGH SCORE: ${hs}`, {
      font:'16px monospace', fill:'#ffdd00'
    }).setOrigin(0.5).setDepth(4);

    // Stage prompt
    const prompt = this.add.text(W/2, H - 110, 'PRESS SPACE TO START', {
      font:'18px monospace', fill:'#ffffff', stroke:'#000', strokeThickness:3
    }).setOrigin(0.5).setDepth(4);
    this.tweens.add({ targets:prompt, alpha:{ from:1, to:0.2 }, duration:600, yoyo:true, repeat:-1 });

    this.add.text(W/2, H - 60, 'ARROWS / WASD = MOVE  |  SPACE = SHOOT', {
      font:'10px monospace', fill:'#888888'
    }).setOrigin(0.5).setDepth(4);

    const lbBtn = this.add.text(W/2, H - 82, '[ L ]  LEADERBOARD', {
      font:'12px monospace', fill:'#558855'
    }).setOrigin(0.5).setDepth(4).setInteractive({ useHandCursor:true });
    lbBtn.on('pointerover', () => lbBtn.setFill('#00ff88'));
    lbBtn.on('pointerout',  () => lbBtn.setFill('#558855'));
    lbBtn.on('pointerdown', () => this.scene.start('Leaderboard', {}));

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Game', { stage:1, score:0 }));
    this.input.keyboard.once('keydown-L', () => this.scene.start('Leaderboard', {}));
    this.input.once('pointerdown', (ptr) => {
      // only start game on non-leaderboard clicks
      if (!lbBtn.getBounds().contains(ptr.x, ptr.y))
        this.scene.start('Game', { stage:1, score:0 });
    });
  }

  update(_, delta) {
    const dt = delta / 1000;
    this.bg.tilePositionY += 15 * dt;
    this.st.tilePositionY += 35 * dt;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  GAME SCENE
// ═════════════════════════════════════════════════════════════════════════════
class GameScene extends Phaser.Scene {
  constructor() { super({ key:'Game' }); }

  // ── CREATE ────────────────────────────────────────────────────────────────
  create(data = {}) {
    this.stageNum   = data.stage  || 1;
    this.score      = data.score  || 0;

    // Core state
    this.lives        = 3;
    this.waveIndex    = 0;
    this.phase        = 'waves';
    this.invincible   = false;
    this.fireTimer    = 0;
    this.waveSpawning = true;

    // Power-ups
    this.puTimers     = { shield:0, double:0, speed:0, triple:0, rocket:0 };
    this.powerUpItems = [];
    this.shieldRing   = null;
    this.rockets      = [];
    this.rocketFireTimer = 0;

    // Asteroids
    this.asteroids        = [];
    this.asteroidTimer    = 6.0;
    this.asteroidsEnabled = false;

    // Projectiles & entities
    this.playerBullets = [];
    this.enemies       = [];
    this.enemyBullets  = [];
    this.bossBullets   = [];
    this.alienMinions  = [];   // boss 3 only

    // Boss state (filled by _startBossN)
    this.boss         = null;
    this.bossHP       = 0;
    this.bossMaxHP    = [40, 55, 70, 100][this.stageNum - 1];
    this.bossDir      = 1;
    this.bossPhase2   = false;
    this.bossPhase3   = false;  // boss 3 only
    this.bossFireTimer = 3.0;
    this.boss2Diving  = false;
    this.boss3MinionTimer = 0;
    this.boss4MinionTimer = 0;
    this.boss4DiveTimer   = 0;

    // Backgrounds
    const [b0, b1, b2] = STAGE_BG[this.stageNum - 1];
    this.bgBack   = this.add.tileSprite(0, 0, W, H, b0).setOrigin(0).setDepth(0);
    this.bgStars  = this.add.tileSprite(0, 0, W, H, b1).setOrigin(0).setDepth(1);
    this.bgPlanet = b2 ? this.add.tileSprite(0, 0, W, H, b2).setOrigin(0).setDepth(2) : null;

    // Player
    this.player = this.add.sprite(W/2, H-90, 'ship')
      .setScale(2).setDepth(5).play('ship-idle');
    this.thrustFx = this.add.sprite(W/2, H-46, 'ship-thrust')
      .setScale(2).setDepth(4).play('ship-thrust-anim').setAlpha(0);

    // Damage overlay (shown at 1-2 lives)
    this.damageOverlay = this.add.image(W/2, H-90, 'dmg1')
      .setScale(1).setDepth(6).setAlpha(0);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd    = this.input.keyboard.addKeys({ up:'W', down:'S', left:'A', right:'D' });
    this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // HUD
    this.scoreText = this.add.text(10, 10, `SCORE: ${this.score}`,
      { font:'14px monospace', fill:'#ffffff' }).setDepth(20);
    this.livesText = this.add.text(10, 28, this._heartsStr(),
      { font:'14px monospace', fill:'#ff5555' }).setDepth(20);
    this.stageText = this.add.text(W-10, 10, `STAGE ${this.stageNum}`,
      { font:'14px monospace', fill:'#aaffff' }).setOrigin(1, 0).setDepth(20);
    this.waveText  = this.add.text(W/2, 10, '',
      { font:'bold 16px monospace', fill:'#ffff00', stroke:'#000', strokeThickness:3 })
      .setOrigin(0.5, 0).setDepth(20);
    this.puHUD    = this.add.graphics().setDepth(21);
    this.bossHPBg  = this.add.graphics().setDepth(19);
    this.bossHPBar = this.add.graphics().setDepth(20);
    this.bossLabel = this.add.text(W/2, H-40, '',
      { font:'bold 11px monospace', fill:'#ff8800' }).setOrigin(0.5).setDepth(21);

    // Start
    this.time.delayedCall(800, () => this.spawnWave());
    this.showBanner(`STAGE ${this.stageNum}  WAVE 1`, '#ffff00');
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  update(_, delta) {
    const dt = delta / 1000;

    // Parallax scroll
    this.bgBack.tilePositionY   += 16 * dt;
    this.bgStars.tilePositionY  += 38 * dt;
    if (this.bgPlanet) this.bgPlanet.tilePositionY += 10 * dt;

    if (this.phase === 'cleared' || this.phase === 'dead') return;

    // Player movement
    const spd = 190 + (this.puTimers.speed > 0 ? 90 : 0);
    let dx = 0, dy = 0;
    if (this.cursors.left.isDown  || this.wasd.left.isDown)  dx = -1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) dx =  1;
    if (this.cursors.up.isDown    || this.wasd.up.isDown)    dy = -1;
    if (this.cursors.down.isDown  || this.wasd.down.isDown)  dy =  1;
    if (dx && dy) { dx *= 0.707; dy *= 0.707; }
    this.player.x = Phaser.Math.Clamp(this.player.x + dx*spd*dt, 24, W-24);
    this.player.y = Phaser.Math.Clamp(this.player.y + dy*spd*dt, 60, H-40);
    this.thrustFx.x = this.player.x;
    this.thrustFx.y = this.player.y + 44;
    this.thrustFx.setAlpha(dy < 0 ? 1 : (dx ? 0.7 : (dy > 0 ? 0 : 0.5)));

    // Sync damage overlay
    this.damageOverlay.x = this.player.x;
    this.damageOverlay.y = this.player.y;
    if (this.shieldRing) { this.shieldRing.x = this.player.x; this.shieldRing.y = this.player.y; }

    // Power-up timers
    for (const k of ['shield','double','speed']) {
      if (this.puTimers[k] > 0) {
        this.puTimers[k] -= dt;
        if (this.puTimers[k] <= 0) {
          this.puTimers[k] = 0;
          if (k === 'shield') { this.invincible = false; this._removeShieldRing(); }
        }
      }
    }
    this._drawPuHUD();

    // Auto-fire
    this.fireTimer -= dt;
    if ((this.fireKey.isDown || this.input.activePointer.isDown) && this.fireTimer <= 0) {
      this.fireBullet(); this.fireTimer = 0.22;
    }

    // Asteroid spawning (stage 1 wave≥2, always stage 2+)
    if (this.asteroidsEnabled && this.phase === 'waves') {
      this.asteroidTimer -= dt;
      if (this.asteroidTimer <= 0) { this._spawnAsteroid(); this.asteroidTimer = Phaser.Math.FloatBetween(3.5, 6.0); }
    }

    // Move asteroids
    for (let i = this.asteroids.length-1; i >= 0; i--) {
      const a = this.asteroids[i];
      a.y += a.speed*dt; a.rotation += a.rotSpeed*dt;
      if (a.y > H+80) { a.destroy(); this.asteroids.splice(i,1); }
    }

    // Move player bullets
    for (let i = this.playerBullets.length-1; i >= 0; i--) {
      const b = this.playerBullets[i];
      if (b.velX !== undefined) { b.x += b.velX*dt; b.y += b.velY*dt; }
      else b.y -= 430*dt;
      if (b.y < -20 || b.x < -10 || b.x > W+10) { b.destroy(); this.playerBullets.splice(i,1); }
    }

    // Move + home rockets
    if (this.puTimers.rocket > 0) {
      this.rocketFireTimer -= dt;
      if (this.rocketFireTimer <= 0) { this._fireRocket(); this.rocketFireTimer = 2.5; }
    }
    for (let i = this.rockets.length-1; i >= 0; i--) {
      const r = this.rockets[i];
      // Find nearest target (enemies > boss)
      let tgt = null, minD = Infinity;
      [...this.enemies, ...this.alienMinions].forEach(e => {
        if (e.y < r.y + 120) {
          const d = Phaser.Math.Distance.Between(r.x,r.y,e.x,e.y);
          if (d < minD) { minD=d; tgt=e; }
        }
      });
      if (!tgt && this.boss && this.phase==='boss_fight') { tgt=this.boss; }
      if (tgt) {
        const ta = Phaser.Math.Angle.Between(r.x,r.y,tgt.x,tgt.y);
        const diff = Phaser.Math.Angle.Wrap(ta - r.rAngle);
        r.rAngle += Phaser.Math.Clamp(diff, -3.5*dt, 3.5*dt);
      }
      r.x += Math.cos(r.rAngle)*300*dt;
      r.y += Math.sin(r.rAngle)*300*dt;
      r.rotation = r.rAngle + Math.PI/2;
      if (r.y < -50 || r.x < -50 || r.x > W+50) { r.destroy(); this.rockets.splice(i,1); continue; }
      // Hit enemies
      let hit=false;
      for (let ei=this.enemies.length-1; ei>=0; ei--) {
        if (Phaser.Math.Distance.Between(r.x,r.y,this.enemies[ei].x,this.enemies[ei].y) < 45) {
          this._rocketExplode(r.x,r.y); r.destroy(); this.rockets.splice(i,1); hit=true; break;
        }
      }
      if (hit) continue;
      for (let ai=this.alienMinions.length-1; ai>=0; ai--) {
        if (Phaser.Math.Distance.Between(r.x,r.y,this.alienMinions[ai].x,this.alienMinions[ai].y) < 45) {
          this._rocketExplode(r.x,r.y); r.destroy(); this.rockets.splice(i,1); hit=true; break;
        }
      }
      if (hit) continue;
      if (this.boss && this.phase==='boss_fight' &&
          Phaser.Math.Distance.Between(r.x,r.y,this.boss.x,this.boss.y) < 90) {
        this._rocketExplode(r.x,r.y); r.destroy(); this.rockets.splice(i,1);
      }
    }

    // Move enemy bullets
    for (let i = this.enemyBullets.length-1; i >= 0; i--) {
      const b = this.enemyBullets[i];
      b.x += b.velX*dt; b.y += b.velY*dt;
      if (b.y > H+20 || b.x < -20 || b.x > W+20) { b.destroy(); this.enemyBullets.splice(i,1); }
    }

    // Move boss bolts
    for (let i = this.bossBullets.length-1; i >= 0; i--) {
      const b = this.bossBullets[i];
      b.x += b.velX*dt; b.y += b.velY*dt;
      if (b.y > H+20 || b.x < -20 || b.x > W+20) { b.destroy(); this.bossBullets.splice(i,1); }
    }

    // Move enemies + fire
    for (let i = this.enemies.length-1; i >= 0; i--) {
      const e = this.enemies[i];
      e.y += e.speed*dt;
      if (e.enemyType === 'medium') {
        e.x = Phaser.Math.Clamp(e.x + Math.sin((e.y+e.sineOffset)*0.028)*1.2, 24, W-24);
      } else if (e.wobble) {
        e.x = Phaser.Math.Clamp(e.x + Math.sin(e.y*0.04)*0.8, 24, W-24);
      }
      if (e.y > H+70) { e.destroy(); this.enemies.splice(i,1); continue; }
      if (e.y > 20) {
        e.fireTimer -= dt;
        if (e.fireTimer <= 0) {
          this._fireEnemyBullet(e);
          const def = ENEMY_DEF[e.enemyType];
          e.fireTimer = Phaser.Math.FloatBetween(def.fireMin, def.fireMax);
        }
      }
    }

    // Move alien minions
    for (let i = this.alienMinions.length-1; i >= 0; i--) {
      const a = this.alienMinions[i];
      a.x += a.velX*dt; a.y += a.velY*dt;
      // Re-aim every 2s
      a.aimTimer -= dt;
      if (a.aimTimer <= 0) {
        const ang = Phaser.Math.Angle.Between(a.x, a.y, this.player.x, this.player.y);
        const spd2 = 80;
        a.velX = Math.cos(ang)*spd2; a.velY = Math.sin(ang)*spd2;
        a.aimTimer = 2.0;
      }
      a.fireTimer -= dt;
      if (a.fireTimer <= 0 && a.y > 0) {
        this._fireFrom(a, 'enemy-proj', true, 1, 0, 145, 2);
        a.fireTimer = Phaser.Math.FloatBetween(2.0, 4.0);
      }
      if (a.y > H+60 || a.x < -80 || a.x > W+80) { a.destroy(); this.alienMinions.splice(i,1); }
    }

    // Player bullet → enemy
    for (let bi = this.playerBullets.length-1; bi >= 0; bi--) {
      const b = this.playerBullets[bi]; let used = false;
      for (let ei = this.enemies.length-1; ei >= 0; ei--) {
        const e = this.enemies[ei]; const r = e.scale*20;
        if (Math.abs(b.x-e.x) < r && Math.abs(b.y-e.y) < r) {
          e.hp--;
          if (e.hp <= 0) { this.killEnemy(e,ei); }
          else { e.setTintFill(0xffffff); this.time.delayedCall(60, () => { if (e.active) e.clearTint(); }); this.sound.play('snd-hit', { volume:0.25 }); }
          b.destroy(); this.playerBullets.splice(bi,1); used = true; break;
        }
      }
      if (used) continue;

      // → alien minion
      for (let ai = this.alienMinions.length-1; ai >= 0; ai--) {
        const a = this.alienMinions[ai];
        if (Math.abs(b.x-a.x) < 50 && Math.abs(b.y-a.y) < 40) {
          a.hp--;
          if (a.hp <= 0) {
            const fx = this.add.sprite(a.x, a.y, 'exp-b').setScale(1.5).setDepth(8);
            fx.play('exp-b-anim'); fx.once('animationcomplete', () => fx.destroy());
            this.sound.play('snd-explode', { volume:0.3, detune:200 });
            a.destroy(); this.alienMinions.splice(ai,1);
            this.score += 150; this.scoreText.setText(`SCORE: ${this.score}`);
          } else { a.setTintFill(0xffffff); this.time.delayedCall(60, () => { if(a.active) a.clearTint(); }); }
          b.destroy(); this.playerBullets.splice(bi,1); used = true; break;
        }
      }
      if (used) continue;

      // → asteroid
      for (let ai = this.asteroids.length-1; ai >= 0; ai--) {
        const a = this.asteroids[ai];
        if (Math.abs(b.x-a.x) < a.hitR && Math.abs(b.y-a.y) < a.hitR) {
          this._explodeSmall(a.x, a.y);
          a.destroy(); this.asteroids.splice(ai,1);
          b.destroy(); this.playerBullets.splice(bi,1);
          this.score += 50; this.scoreText.setText(`SCORE: ${this.score}`);
          used = true; break;
        }
      }
      if (used) continue;

      // → boss
      if (this.boss && this.phase === 'boss_fight') {
        const hw = (this.stageNum === 3 ? 180 : 80);
        if (Math.abs(b.x-this.boss.x) < hw && Math.abs(b.y-this.boss.y) < 60) {
          this.hitBoss(b, bi);
        }
      }
    }

    // Hazards → player
    if (!this.invincible) {
      for (let i = this.enemies.length-1; i >= 0; i--) {
        const e = this.enemies[i];
        if (Phaser.Math.Distance.Between(e.x,e.y,this.player.x,this.player.y) < 26) {
          e.destroy(); this.enemies.splice(i,1); this.hitPlayer(); break;
        }
      }
      for (const arr of [this.enemyBullets, this.bossBullets]) {
        for (let i = arr.length-1; i >= 0; i--) {
          const b = arr[i];
          if (Phaser.Math.Distance.Between(b.x,b.y,this.player.x,this.player.y) < 18) {
            b.destroy(); arr.splice(i,1); this.hitPlayer(); break;
          }
        }
      }
      for (let i = this.alienMinions.length-1; i >= 0; i--) {
        const a = this.alienMinions[i];
        if (Phaser.Math.Distance.Between(a.x,a.y,this.player.x,this.player.y) < 40) {
          a.destroy(); this.alienMinions.splice(i,1); this.hitPlayer(); break;
        }
      }
      for (let i = this.asteroids.length-1; i >= 0; i--) {
        const a = this.asteroids[i];
        if (Phaser.Math.Distance.Between(a.x,a.y,this.player.x,this.player.y) < a.hitR+18) {
          this._explodeSmall(a.x,a.y); a.destroy(); this.asteroids.splice(i,1); this.hitPlayer(); break;
        }
      }
    }

    // Power-up collection
    for (let i = this.powerUpItems.length-1; i >= 0; i--) {
      const pu = this.powerUpItems[i];
      pu.y += 60*dt; pu.rotation += 1.5*dt;
      if (pu.y > H+20) { pu.destroy(); this.powerUpItems.splice(i,1); continue; }
      if (Phaser.Math.Distance.Between(pu.x,pu.y,this.player.x,this.player.y) < 28) {
        this._collectPowerUp(pu); this.powerUpItems.splice(i,1);
      }
    }

    // Boss AI
    if (this.boss && this.phase === 'boss_fight') {
      if (this.stageNum === 1) this._updateBoss1(dt);
      else if (this.stageNum === 2) this._updateBoss2(dt);
      else if (this.stageNum === 3) this._updateBoss3(dt);
      else this._updateBoss4(dt);
    }

    // Wave clear
    if (this.phase === 'waves' && !this.waveSpawning && this.enemies.length === 0) {
      this.waveIndex++;
      const waves = WAVE_CONFIGS[this.stageNum-1];
      if (this.waveIndex >= waves.length) {
        this.phase = 'boss_intro';
        this.showBanner('⚠ BOSS INCOMING ⚠', '#ff4400');
        this.time.delayedCall(2000, () => this.startBoss());
      } else {
        this.waveSpawning = true;
        this.asteroidsEnabled = (this.stageNum >= 2 || this.waveIndex >= 2);
        this.showBanner(`WAVE ${this.waveIndex+1}`, '#ffff00');
        this.time.delayedCall(1800, () => this.spawnWave());
      }
    }
  }

  // ── FIRE PLAYER BULLET ────────────────────────────────────────────────────
  fireBullet() {
    const triple = this.puTimers.triple > 0;
    const double = !triple && this.puTimers.double > 0;

    if (triple) {
      // Fan of 3: centre + two angled outward
      const cfg = [
        { ox:-16, velX:-75, tint:0x88ffff },
        { ox:  0, velX:  0, tint:null },
        { ox: 16, velX: 75, tint:0x88ffff },
      ];
      cfg.forEach(c => {
        const b = this.add.image(this.player.x+c.ox, this.player.y-32, 'bullet')
          .setScale(2,3).setAngle(-90).setDepth(6);
        if (c.tint) b.setTint(c.tint);
        b.velX = c.velX;  b.velY = -430;
        this.playerBullets.push(b);
      });
    } else {
      const offsets = double ? [-14, 14] : [0];
      offsets.forEach((ox, idx) => {
        const b = this.add.image(this.player.x+ox, this.player.y-32, idx===1?'bullet2':'bullet')
          .setScale(2,3).setAngle(-90).setDepth(6);
        if (idx===1) b.setTint(0x88ffff);
        this.playerBullets.push(b);
      });
    }

    const f = this.add.image(this.player.x, this.player.y-44, 'flash').setScale(2).setDepth(7);
    this.time.delayedCall(55, () => { if (f.active) f.destroy(); });
    this.sound.play('snd-shoot', { volume:0.22 });
  }

  // ── SPAWN WAVE ────────────────────────────────────────────────────────────
  spawnWave() {
    this.waveSpawning = true;
    const waveDef = WAVE_CONFIGS[this.stageNum-1][this.waveIndex];
    const order = ['large','medium','small'];
    const allSlots = [];
    order.forEach(type => {
      const e = waveDef.find(e => e.type === type);
      if (e) for (let n=0; n<e.count; n++) allSlots.push(type);
    });
    const cols=4, spacingX=88, startX=(W-(cols-1)*spacingX)/2;
    let delay=0;
    allSlots.forEach((type,i) => {
      const col=i%cols, row=Math.floor(i/cols);
      this.time.delayedCall(delay, () => this._spawnEnemy(type, startX+col*spacingX, -55-row*75));
      delay += 120;
    });
    this.time.delayedCall(delay+300, () => { this.waveSpawning = false; });
    this.waveText.setText(`WAVE ${this.waveIndex+1}`);
    this.time.delayedCall(2200, () => { if(this.waveText) this.waveText.setText(''); });
  }

  _spawnEnemy(type, x, y) {
    const def = ENEMY_DEF[type];
    const anim = type==='small'?'enemy-idle':type==='medium'?'enemy-medium-idle':'enemy-large-idle';
    const e = this.add.sprite(x, y, def.sprite).setScale(def.scale).setDepth(4).play(anim);
    e.enemyType  = type;
    e.hp         = def.hp + (this.stageNum-1);  // +1 HP per stage
    e.speed      = def.speed + (this.stageNum-1)*12 + this.waveIndex*5;
    e.wobble     = def.wobble;
    e.sineOffset = Phaser.Math.Between(0,300);
    e.fireTimer  = Phaser.Math.FloatBetween(def.fireMin, def.fireMax);
    this.enemies.push(e);
  }

  // ── KILL ENEMY ────────────────────────────────────────────────────────────
  killEnemy(enemy, idx) {
    const {x, y, enemyType} = enemy;
    const def = ENEMY_DEF[enemyType];
    enemy.destroy(); this.enemies.splice(idx,1);

    const fx = this.add.sprite(x, y, def.deathSprite).setScale(def.deathScale).setDepth(7);
    fx.play(def.deathAnim); fx.once('animationcomplete', () => fx.destroy());

    if (enemyType === 'large') {
      const fx2 = this.add.sprite(x, y, 'explosion').setScale(1.2).setDepth(8).setAlpha(0.85);
      fx2.play('explode'); fx2.once('animationcomplete', () => fx2.destroy());
    }
    this.sound.play('snd-explode', { volume: enemyType==='large'?0.5:0.32, detune:Phaser.Math.Between(-400,200) });
    this.score += def.score; this.scoreText.setText(`SCORE: ${this.score}`);

    // Power-up drop — stage 3+ can drop triple/rocket
    const chance = enemyType==='large'?0.45:enemyType==='medium'?0.25:0.10;
    if (Math.random() < chance) {
      let pool = ['shield','double','speed','bomb'];
      if (this.stageNum >= 3) pool.push('triple');
      if (this.stageNum >= 3) pool.push('rocket');
      if (this.stageNum >= 4) { pool.push('triple'); pool.push('rocket'); } // more common in s4
      this._spawnPowerUp(x, y, pool[Phaser.Math.Between(0, pool.length-1)]);
    }
  }

  // ── FIRE ENEMY BULLET ────────────────────────────────────────────────────
  _fireEnemyBullet(enemy) {
    this._fireFrom(enemy, ENEMY_DEF[enemy.enemyType].bullet,
      ENEMY_DEF[enemy.enemyType].animated,
      ENEMY_DEF[enemy.enemyType].shots,
      ENEMY_DEF[enemy.enemyType].spread,
      ENEMY_DEF[enemy.enemyType].bulletSpd,
      ENEMY_DEF[enemy.enemyType].bulletScale);
    this.sound.play('snd-shoot', {
      volume: enemy.enemyType==='large'?0.18:0.10,
      detune: enemy.enemyType==='large'?-300:600
    });
  }

  _fireFrom(src, bulletKey, animated, shots, spread, spd, bScale) {
    for (let i=0; i<shots; i++) {
      const base = Phaser.Math.Angle.Between(src.x, src.y, this.player.x, this.player.y);
      const angle = base + (i-(shots-1)/2)*spread + Phaser.Math.FloatBetween(-0.12,0.12);
      const b = animated
        ? this.add.sprite(src.x, src.y+16, bulletKey).setScale(bScale).setDepth(6).play('enemy-proj-anim')
        : this.add.image(src.x, src.y+16, bulletKey).setScale(bScale).setDepth(6);
      b.velX = Math.cos(angle)*spd; b.velY = Math.sin(angle)*spd;
      this.enemyBullets.push(b);
    }
  }

  // ── ASTEROIDS ─────────────────────────────────────────────────────────────
  _spawnAsteroid() {
    const pool = ['ast-01','ast-02','ast-03','ast-04','ast-05','ast-a'];
    const key = pool[Phaser.Math.Between(0, pool.length-1)];
    const a = this.add.image(Phaser.Math.Between(30,W-30), -60, key)
      .setScale(Phaser.Math.FloatBetween(1.2,2.2)).setDepth(3);
    a.speed    = Phaser.Math.Between(55,110);
    a.rotSpeed = Phaser.Math.FloatBetween(-1.5,1.5);
    a.hitR     = (a.displayWidth+a.displayHeight)/4;
    this.asteroids.push(a);
  }

  _explodeSmall(x, y) {
    const k = Math.random() > 0.5 ? 'exp-f' : 'exp-g';
    const anim = k==='exp-f'?'exp-f-anim':'exp-g-anim';
    const fx = this.add.sprite(x, y, k).setScale(1.0).setDepth(8).setAlpha(0.8);
    fx.play(anim); fx.once('animationcomplete', () => fx.destroy());
    this.sound.play('snd-explode', { volume:0.22, detune:500 });
  }

  // ── POWER-UPS ─────────────────────────────────────────────────────────────
  _spawnPowerUp(x, y, type) {
    const pu = this.add.image(x, y, PU_SPRITES[type])
      .setScale(2.5).setDepth(8).setTint(PU_COLORS[type]);
    pu.puType = type;
    this.tweens.add({ targets:pu, scaleX:3.2, scaleY:3.2, duration:400, yoyo:true, repeat:-1 });
    this.time.delayedCall(9000, () => {
      if (pu.active) pu.destroy();
      const idx = this.powerUpItems.indexOf(pu);
      if (idx !== -1) this.powerUpItems.splice(idx,1);
    });
    this.powerUpItems.push(pu);
  }

  _collectPowerUp(pu) {
    const type = pu.puType; pu.destroy();
    this.player.setTint(PU_COLORS[type]);
    this.time.delayedCall(300, () => { if(this.player.active) this.player.clearTint(); });
    if (type === 'bomb') {
      [...this.enemies].forEach((e,i) => this.killEnemy(e,i));
      this.enemies = [];
      [...this.alienMinions].forEach(a => a.destroy()); this.alienMinions = [];
      [...this.enemyBullets].forEach(b => b.destroy()); this.enemyBullets = [];
      this.cameras.main.shake(300, 0.010);
      this.showBanner('BOMB!', '#ff4400');
    } else {
      this.puTimers[type] = PU_DURATION[type];
      if (type==='shield') { this.invincible=true; this._createShieldRing(); this.showBanner('SHIELD ON','#00aaff'); }
      else if (type==='double') { this.puTimers.triple=0; this.showBanner('DOUBLE SHOT','#ffff00'); }
      else if (type==='triple') { this.puTimers.double=0; this.showBanner('TRIPLE SHOT','#00ffff'); }
      else if (type==='speed')  this.showBanner('SPEED BOOST','#00ff88');
      else if (type==='rocket') { this.rocketFireTimer=0; this.showBanner('ROCKETS!','#ff6600'); }
    }
    this.sound.play('snd-shoot2', { volume:0.5 });
  }

  _createShieldRing() {
    this._removeShieldRing();
    this.shieldRing = this.add.graphics().setDepth(9);
    this.shieldRing.lineStyle(2, 0x00aaff, 0.85);
    this.shieldRing.strokeCircle(0, 0, 36);
    this.shieldRing.x = this.player.x; this.shieldRing.y = this.player.y;
    this.tweens.add({ targets:this.shieldRing, alpha:{ from:0.5, to:1 }, duration:400, yoyo:true, repeat:-1 });
  }

  _removeShieldRing() {
    if (this.shieldRing) { this.tweens.killTweensOf(this.shieldRing); this.shieldRing.destroy(); this.shieldRing=null; }
  }

  _drawPuHUD() {
    this.puHUD.clear();
    const icons = [
      { key:'shield', color:PU_COLORS.shield },
      { key:'double', color:PU_COLORS.double },
      { key:'triple', color:PU_COLORS.triple },
      { key:'speed',  color:PU_COLORS.speed },
      { key:'rocket', color:PU_COLORS.rocket },
    ];
    let xOff = W-10;
    icons.forEach(({ key, color }) => {
      const t = this.puTimers[key]; if (t <= 0) return;
      const pct = t/PU_DURATION[key]; xOff -= 36;
      this.puHUD.fillStyle(0x222222, 0.7).fillRect(xOff, 10, 32, 16);
      this.puHUD.fillStyle(color, 0.9).fillRect(xOff, 10, 32*pct, 16);
      this.puHUD.lineStyle(1, color).strokeRect(xOff, 10, 32, 16);
      xOff -= 4;
    });
  }

  // ── HIT PLAYER ───────────────────────────────────────────────────────────
  hitPlayer() {
    if (this.invincible) return;
    this.invincible = true;
    this.lives--;
    this.sound.play('snd-hit', { volume:0.55 });
    this.livesText.setText(this._heartsStr());

    // Damage overlay: dmg1 at 2 lives, dmg2 at 1 life, dmg3 at 0 (death flash)
    if (this.lives === 2) { this.damageOverlay.setTexture('dmg1').setAlpha(0.55); }
    else if (this.lives === 1) { this.damageOverlay.setTexture('dmg2').setAlpha(0.70); }
    else if (this.lives <= 0) { this.damageOverlay.setTexture('dmg3').setAlpha(0.85); }

    ['hit1','hit2','hit3','hit4'].forEach((frame, i) => {
      this.time.delayedCall(i*55, () => {
        if (!this.player.active) return;
        const h = this.add.image(this.player.x, this.player.y, frame).setScale(3).setDepth(10);
        this.time.delayedCall(50, () => { if(h.active) h.destroy(); });
      });
    });
    this.tweens.add({
      targets:this.player, alpha:{ from:0.15, to:1 },
      duration:100, yoyo:true, repeat:12,
      onComplete: () => { if(this.player.active) this.player.setAlpha(1); }
    });
    this.cameras.main.shake(180, 0.008);

    if (this.lives <= 0) {
      this.phase = 'dead';
      [...this.enemyBullets, ...this.bossBullets].forEach(b => b.destroy());
      this.enemyBullets=[]; this.bossBullets=[];
      this.time.delayedCall(600, () => {
        const exp = this.add.sprite(this.player.x, this.player.y, 'explosion').setScale(2).setDepth(12);
        exp.play('explode');
        exp.once('animationcomplete', () => {
          exp.destroy();
          this._saveHighScore();
          this.scene.start('GameOver', { score:this.score, stage:this.stageNum });
        });
        this.sound.play('snd-explode', { volume:0.8 });
        this.player.setVisible(false); this.thrustFx.setVisible(false);
        this._removeShieldRing(); this.damageOverlay.setVisible(false);
      });
    } else {
      this.time.delayedCall(2000, () => { this.invincible=false; });
    }
  }

  // ── START BOSS ────────────────────────────────────────────────────────────
  startBoss() {
    this.phase='boss_fight'; this.bossDir=1; this.bossPhase2=false;
    this.bossPhase3=false; this.bossFireTimer=3.0;
    this.bossHP = this.bossMaxHP;
    if (this.stageNum===1) this._startBoss1();
    else if (this.stageNum===2) this._startBoss2();
    else if (this.stageNum===3) this._startBoss3();
    else this._startBoss4();
    this._drawBossHP(); this.bossLabel.setText(`STAGE ${this.stageNum} BOSS`);
  }

  // ── BOSS 1: top-down-boss ─────────────────────────────────────────────────
  _startBoss1() {
    this.boss = this.add.sprite(W/2,-120,'boss1').setScale(1.5).setDepth(5).play('boss1-idle');
    this.b1Thrust = this.add.sprite(W/2,-20,'boss1-thrust').setScale(1.5).setDepth(4).play('boss1-thrust');
    this.b1CanL   = this.add.image(W/2-112,-120,'cannon-left').setScale(1.5).setDepth(6);
    this.b1CanR   = this.add.image(W/2+112,-120,'cannon-right').setScale(1.5).setDepth(6);
    this.b1Rays   = this.add.sprite(W/2,-120,'boss1-rays').setScale(1.5).setOrigin(0.5,0).setDepth(3).setAlpha(0);
    const parts=[this.boss,this.b1Thrust,this.b1CanL,this.b1CanR,this.b1Rays];
    const destY=[148,248,148,148,148];
    parts.forEach((p,i) => this.tweens.add({ targets:p, y:destY[i], duration:2200, ease:'Power2' }));
  }

  _updateBoss1(dt) {
    const spd = this.bossPhase2?135:85;
    this.boss.x += this.bossDir*spd*dt;
    [this.b1Thrust,this.b1Rays].forEach(s=>s.x=this.boss.x);
    this.b1CanL.x=this.boss.x-112; this.b1CanR.x=this.boss.x+112;
    if (this.boss.x > W-90) { this.boss.x=W-90; this.bossDir=-1; }
    if (this.boss.x < 90)   { this.boss.x=90;   this.bossDir= 1; }
    this.bossFireTimer -= dt;
    if (this.bossFireTimer <= 0) {
      this._boss1Fire(); this.bossFireTimer = this.bossPhase2?1.5:2.6;
    }
  }

  _boss1Fire() {
    const shots=this.bossPhase2?5:3, spread=0.38, spd=170;
    for (let i=0; i<shots; i++) {
      const angle = (Math.PI/2) + (i-(shots-1)/2)*spread;
      const b = this.add.sprite(this.boss.x, this.boss.y+50, 'boss1-bolt')
        .setScale(3).setDepth(6).play('boss1-bolt');
      b.velX=Math.cos(angle)*spd; b.velY=Math.sin(angle)*spd;
      this.bossBullets.push(b);
    }
    if (this.bossPhase2 && !this.b1Rays.anims.isPlaying) {
      this.b1Rays.setAlpha(0.9); this.b1Rays.play('boss1-rays');
      this.b1Rays.once('animationcomplete', () => { if(this.b1Rays) this.b1Rays.setAlpha(0); });
    }
  }

  // ── BOSS 2: spaceship-unit (agile, dives) ─────────────────────────────────
  _startBoss2() {
    this.boss = this.add.sprite(W/2,-100,'boss2').setScale(2.5).setDepth(5).play('boss2-idle');
    this.b2Thrust = this.add.sprite(W/2,-100+80,'boss2-thrust').setScale(2.5).setDepth(4).play('boss2-thrust');
    this.tweens.add({ targets:this.boss, y:130, duration:2000, ease:'Power2' });
    this.tweens.add({ targets:this.b2Thrust, y:210, duration:2000, ease:'Power2' });
  }

  _updateBoss2(dt) {
    const spd = this.bossPhase2?150:110;
    if (!this.boss2Diving) {
      this.boss.x += this.bossDir*spd*dt;
      if (this.boss.x > W-70) { this.boss.x=W-70; this.bossDir=-1; }
      if (this.boss.x < 70)   { this.boss.x=70;   this.bossDir= 1; }
    }
    this.b2Thrust.x = this.boss.x;
    this.b2Thrust.y = this.boss.y + 80;
    this.bossFireTimer -= dt;
    if (this.bossFireTimer <= 0) {
      this._boss2Fire(); this.bossFireTimer = this.bossPhase2?1.4:2.2;
    }
  }

  _boss2Fire() {
    const spd=200, shots=this.bossPhase2?3:1;
    for (let i=0; i<shots; i++) {
      const ang = Phaser.Math.Angle.Between(this.boss.x,this.boss.y,this.player.x,this.player.y)
        + (i-(shots-1)/2)*0.25;
      const key  = this.bossPhase2?'warp-charged':'warp-bolt';
      const anim = this.bossPhase2?'warp-charged-anim':'warp-bolt-anim';
      const b = this.add.sprite(this.boss.x, this.boss.y+40, key).setScale(2).setDepth(6).play(anim);
      b.velX=Math.cos(ang)*spd; b.velY=Math.sin(ang)*spd;
      this.bossBullets.push(b);
    }
    // Dive attack in phase 2
    if (this.bossPhase2 && !this.boss2Diving && Math.random() < 0.35) {
      this.boss2Diving = true;
      const targetY = Math.min(this.player.y-60, H-200);
      this.tweens.add({
        targets: this.boss, y: targetY, duration:500, ease:'Power2',
        onComplete: () => {
          this.tweens.add({ targets:this.boss, y:130, duration:700, ease:'Power2',
            onComplete: () => { this.boss2Diving=false; }
          });
        }
      });
    }
  }

  // ── BOSS 3: vehicle 3 (capital ship, spawns alien minions) ────────────────
  _startBoss3() {
    // Vehicle 3 is wide (329x160 at scale 1.3 = 428x208) — position near top
    this.boss = this.add.sprite(W/2,-120,'boss3').setScale(1.3).setDepth(5).play('boss3-idle');
    this.tweens.add({ targets:this.boss, y:130, duration:2500, ease:'Power2' });
    this.boss3MinionTimer = 5.0;
  }

  _updateBoss3(dt) {
    const spd = this.bossPhase2?65:42;
    this.boss.x += this.bossDir*spd*dt;
    if (this.boss.x > W-80) { this.boss.x=W-80; this.bossDir=-1; }
    if (this.boss.x < 80)   { this.boss.x=80;   this.bossDir= 1; }

    this.bossFireTimer -= dt;
    if (this.bossFireTimer <= 0) {
      this._boss3Fire();
      this.bossFireTimer = this.bossPhase2?1.2:2.0;
    }

    // Spawn alien minions from phase 2
    if (this.bossPhase2) {
      this.boss3MinionTimer -= dt;
      if (this.boss3MinionTimer <= 0) {
        this._spawnAlienMinion(-60, 80);
        this._spawnAlienMinion(W+60, 80);
        this.boss3MinionTimer = 5.0;
      }
    }
  }

  _boss3Fire() {
    const shots = this.bossPhase3?7:this.bossPhase2?5:3;
    const spread = 0.32;
    for (let i=0; i<shots; i++) {
      const angle = (Math.PI/2) + (i-(shots-1)/2)*spread;
      const key  = this.bossPhase3?'warp-crossed':'warp-charged';
      const anim = this.bossPhase3?'warp-crossed-anim':'warp-charged-anim';
      const b = this.add.sprite(this.boss.x, this.boss.y+70, key).setScale(2).setDepth(6).play(anim);
      b.velX=Math.cos(angle)*150; b.velY=Math.sin(angle)*150;
      this.bossBullets.push(b);
    }
  }

  _spawnAlienMinion(x, y) {
    const a = this.add.sprite(x, y, 'alien-enemy').setScale(1.5).setDepth(4).play('alien-idle');
    a.hp = 2;
    const ang = Phaser.Math.Angle.Between(x, y, this.player.x, this.player.y);
    a.velX = Math.cos(ang)*80; a.velY = Math.sin(ang)*80;
    a.aimTimer  = 2.0;
    a.fireTimer = Phaser.Math.FloatBetween(2,4);
    this.alienMinions.push(a);
  }

  // ── ROCKET helpers ────────────────────────────────────────────────────────
  _fireRocket() {
    const r = this.add.image(this.player.x, this.player.y - 30, 'rocket-proj')
      .setScale(2.5).setDepth(7).setTint(0xff6600);
    r.rAngle = -Math.PI / 2;   // start heading up
    this.rockets.push(r);
    this.sound.play('snd-shoot', { volume:0.35, detune:-700 });
  }

  _rocketExplode(x, y) {
    const fx = this.add.sprite(x, y, 'exp-d').setScale(2.2).setDepth(10);
    fx.play('exp-d-anim'); fx.once('animationcomplete', () => fx.destroy());
    this.cameras.main.shake(130, 0.006);
    this.sound.play('snd-explode', { volume:0.65 });
    // Area damage
    const rad = 90;
    for (let ei = this.enemies.length-1; ei >= 0; ei--) {
      const e = this.enemies[ei];
      if (Phaser.Math.Distance.Between(x,y,e.x,e.y) < rad) {
        e.hp -= 2;
        if (e.hp <= 0) this.killEnemy(e, ei); else {
          e.setTintFill(0xffffff); this.time.delayedCall(80, () => { if(e.active) e.clearTint(); });
        }
      }
    }
    for (let ai = this.alienMinions.length-1; ai >= 0; ai--) {
      const a = this.alienMinions[ai];
      if (Phaser.Math.Distance.Between(x,y,a.x,a.y) < rad) {
        const fx2 = this.add.sprite(a.x,a.y,'exp-b').setScale(1.5).setDepth(8);
        fx2.play('exp-b-anim'); fx2.once('animationcomplete',()=>fx2.destroy());
        a.destroy(); this.alienMinions.splice(ai,1);
        this.score += 150; this.scoreText.setText(`SCORE: ${this.score}`);
      }
    }
    if (this.boss && this.phase==='boss_fight' &&
        Phaser.Math.Distance.Between(x,y,this.boss.x,this.boss.y) < rad + 40) {
      this.bossHP -= 4; this._drawBossHP();
      this.boss.setTintFill(0xffffff);
      this.time.delayedCall(80,()=>{ if(this.boss&&this.boss.active) this.boss.clearTint(); });
      if (this.bossHP <= 0) this._killBoss();
    }
  }

  // ── BOSS 4: Dreadnought — vehicle 1 (132×96, 4 frames) ───────────────────
  // Phase 1: fast sweep + 5-shot spread + 1 aimed
  // Phase 2 (60%): spiral pattern + 2 aimed, faster
  // Phase 3 (30%): dense aimed burst + alien minions every 8s + even faster
  _startBoss4() {
    this.boss = this.add.sprite(W/2,-110,'boss4').setScale(2.5).setDepth(5).play('boss4-idle');
    this.b4Thrust = this.add.image(W/2, 10, 'boss4-thrust').setScale(2.5).setDepth(4).setTint(0x8888ff);
    this.tweens.add({ targets:this.boss,     y:120, duration:2200, ease:'Power2' });
    this.tweens.add({ targets:this.b4Thrust, y:230, duration:2200, ease:'Power2' });
    this.boss4MinionTimer = 8.0;
    this.boss4DiveTimer   = 6.0;
  }

  _updateBoss4(dt) {
    const spd = this.bossPhase3 ? 185 : this.bossPhase2 ? 150 : 110;
    this.boss.x += this.bossDir * spd * dt;
    this.b4Thrust.x = this.boss.x;
    this.b4Thrust.y = this.boss.y + 110;
    if (this.boss.x > W-80) { this.boss.x=W-80; this.bossDir=-1; }
    if (this.boss.x < 80)   { this.boss.x=80;   this.bossDir= 1; }

    // Fire timer
    const fireInterval = this.bossPhase3 ? 1.0 : this.bossPhase2 ? 1.5 : 2.2;
    this.bossFireTimer -= dt;
    if (this.bossFireTimer <= 0) {
      this._boss4Fire(); this.bossFireTimer = fireInterval;
    }

    // Dive toward player in phase 2+
    if (this.bossPhase2) {
      this.boss4DiveTimer -= dt;
      if (this.boss4DiveTimer <= 0) {
        this.boss4DiveTimer = this.bossPhase3 ? 4.0 : 6.5;
        const diveY = Phaser.Math.Clamp(this.player.y - 80, 100, H - 300);
        this.tweens.add({ targets:[this.boss, this.b4Thrust],
          y:{ from:this.boss.y, to:diveY }, duration:380, ease:'Power3',
          onComplete:()=>{
            this.tweens.add({ targets:[this.boss, this.b4Thrust],
              y:{ from:diveY, to:120 }, duration:500, ease:'Power2' });
            this.b4Thrust.y = diveY + 110;
          }
        });
      }
    }

    // Alien minions in phase 3
    if (this.bossPhase3) {
      this.boss4MinionTimer -= dt;
      if (this.boss4MinionTimer <= 0) {
        this._spawnAlienMinion(-60,  80);
        this._spawnAlienMinion(W+60, 80);
        this.boss4MinionTimer = 7.0;
      }
    }
  }

  _boss4Fire() {
    const spd = this.bossPhase3 ? 240 : this.bossPhase2 ? 210 : 180;
    const bx = this.boss.x, by = this.boss.y;

    // Spread shots (downward fan)
    const fanShots = this.bossPhase3 ? 9 : this.bossPhase2 ? 7 : 5;
    for (let i = 0; i < fanShots; i++) {
      const angle = (Math.PI/2) + (i - (fanShots-1)/2) * 0.28;
      const b = this.add.sprite(bx, by+50, 'boss1-bolt').setScale(3).setDepth(6).play('boss1-bolt');
      b.velX = Math.cos(angle)*spd; b.velY = Math.sin(angle)*spd;
      this.bossBullets.push(b);
    }

    // Predictive aimed shots (lead the player slightly)
    const aimCount = this.bossPhase3 ? 3 : this.bossPhase2 ? 2 : 1;
    for (let i = 0; i < aimCount; i++) {
      this.time.delayedCall(i * 140, () => {
        if (this.phase !== 'boss_fight' || !this.boss) return;
        // Lead prediction: aim slightly ahead of player
        const leadX = this.player.x + (Math.random()-0.5)*30;
        const leadY = this.player.y;
        const ang = Phaser.Math.Angle.Between(bx, by, leadX, leadY);
        const key  = this.bossPhase3 ? 'warp-crossed' : 'warp-charged';
        const anim = this.bossPhase3 ? 'warp-crossed-anim' : 'warp-charged-anim';
        const b = this.add.sprite(bx, by+50, key).setScale(2.2).setDepth(6).play(anim);
        b.velX = Math.cos(ang)*spd * 1.15;   // aimed shots are faster
        b.velY = Math.sin(ang)*spd * 1.15;
        this.bossBullets.push(b);
      });
    }

    // Phase 3: extra spiral volley
    if (this.bossPhase3) {
      const spiralShots = 6;
      for (let i = 0; i < spiralShots; i++) {
        const base = (Date.now() * 0.003) % (Math.PI*2);
        const ang = base + (i / spiralShots) * Math.PI * 2;
        const b = this.add.sprite(bx, by+50, 'boss1-bolt').setScale(2.5).setDepth(6).play('boss1-bolt').setTint(0xff2200);
        b.velX = Math.cos(ang)*160; b.velY = Math.sin(ang)*160;
        this.bossBullets.push(b);
      }
    }
  }

  // ── HIT BOSS ──────────────────────────────────────────────────────────────
  hitBoss(bullet, bulletIdx) {
    bullet.destroy(); this.playerBullets.splice(bulletIdx,1);
    this.bossHP--; this.sound.play('snd-hit', { volume:0.35 });
    this.boss.setTintFill(0xffffff);
    this.time.delayedCall(70, () => { if(this.boss&&this.boss.active) this.boss.clearTint(); });
    this._drawBossHP();

    const third = Math.floor(this.bossMaxHP/3);
    const half  = Math.floor(this.bossMaxHP/2);

    if (!this.bossPhase2 && this.bossHP <= half) {
      this.bossPhase2 = true;
      this.boss.setTint(0xff5500);
      this.cameras.main.shake(500,0.012);
      this.showBanner('⚠ PHASE 2 ⚠','#ff3300');
    }
    if (this.stageNum>=3 && !this.bossPhase3 && this.bossHP <= third) {
      this.bossPhase3 = true;
      this.boss.setTint(0xff0000);
      this.cameras.main.shake(700,0.018);
      this.showBanner('⚠ FINAL PHASE ⚠','#ff0000');
    }
    if (this.bossHP <= 0) this._killBoss();
  }

  _killBoss() {
    this.phase='cleared';
    // Clear all projectiles immediately so nothing can hit the player after boss dies
    [...this.bossBullets].forEach(b => b.destroy()); this.bossBullets = [];
    [...this.enemyBullets].forEach(b => b.destroy()); this.enemyBullets = [];
    // Hide all boss parts
    [this.boss, this.b1Thrust, this.b1CanL, this.b1CanR, this.b1Rays,
     this.b2Thrust, this.b4Thrust].forEach(s => { if(s) s.setVisible(false); });
    [...this.alienMinions].forEach(a => a.destroy()); this.alienMinions=[];
    this.bossLabel.setText(''); this.bossHPBg.clear(); this.bossHPBar.clear();

    // Staggered explosions — more for boss 3/4
    const count = this.stageNum>=3?12:7;
    for (let i=0; i<count; i++) {
      this.time.delayedCall(i*180, () => {
        const ox=Phaser.Math.Between(-120,120), oy=Phaser.Math.Between(-65,65);
        const key = i%2===0?'exp-d':'exp-b';
        const anim = i%2===0?'exp-d-anim':'exp-b-anim';
        const fx = this.add.sprite(this.boss.x+ox, this.boss.y+oy, key)
          .setScale(i%2===0?1.2:1.5).setDepth(12);
        fx.play(anim); fx.once('animationcomplete', () => fx.destroy());
        this.sound.play('snd-explode', { volume:0.5, detune:Phaser.Math.Between(-300,300) });
      });
    }
    this.cameras.main.shake(700,0.018);
    const bonus = this.stageNum*2000;
    this.score += bonus;
    this.scoreText.setText(`SCORE: ${this.score}`);
    this._saveHighScore();

    this.time.delayedCall(3200, () => {
      if (this.stageNum < 4) {
        this.scene.start('StageClear', { stage:this.stageNum, score:this.score });
      } else {
        this.scene.start('Victory', { score:this.score });
      }
    });
  }

  // ── HELPERS ──────────────────────────────────────────────────────────────
  _drawBossHP() {
    const bw=W-40, bh=12, bx=20, by=H-28;
    const pct=Math.max(0,this.bossHP/this.bossMaxHP);
    const col=pct>0.5?0x22ee55:pct>0.25?0xffaa00:0xff2200;
    this.bossHPBg.clear().fillStyle(0x111111).fillRect(bx-1,by-1,bw+2,bh+2).fillStyle(0x333333).fillRect(bx,by,bw,bh);
    this.bossHPBar.clear().fillStyle(col).fillRect(bx,by,bw*pct,bh);
  }

  _heartsStr() {
    return `LIVES: ${'♥'.repeat(Math.max(0,this.lives)) || '✗'}`;
  }

  _saveHighScore() {
    const hs = parseInt(localStorage.getItem('spaceShooterHS')||'0');
    if (this.score > hs) localStorage.setItem('spaceShooterHS', this.score);
  }

  showBanner(text, color='#ffffff') {
    const t = this.add.text(W/2, H/2-20, text, {
      font:'bold 30px monospace', fill:color, stroke:'#000', strokeThickness:5
    }).setOrigin(0.5).setDepth(25).setAlpha(0);
    this.tweens.add({ targets:t, alpha:1, duration:250 });
    this.tweens.add({ targets:t, alpha:0, duration:600, delay:1200,
      onComplete: () => { if(t.active) t.destroy(); }
    });
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  STAGE CLEAR SCENE  (between stages)
// ═════════════════════════════════════════════════════════════════════════════
class StageClearScene extends Phaser.Scene {
  constructor() { super({ key:'StageClear' }); }

  create(data) {
    this.add.rectangle(W/2,H/2,W,H,0x000000,0.88);

    this.add.text(W/2, H/2-110, `STAGE ${data.stage} CLEAR!`, {
      font:'bold 34px monospace', fill:'#00ff88', stroke:'#000', strokeThickness:5
    }).setOrigin(0.5);

    this.add.text(W/2, H/2-40, 'SCORE', { font:'16px monospace', fill:'#aaaaaa' }).setOrigin(0.5);
    this.add.text(W/2, H/2+5,  `${data.score}`, { font:'bold 32px monospace', fill:'#ffffff' }).setOrigin(0.5);

    const hs = parseInt(localStorage.getItem('spaceShooterHS')||'0');
    this.add.text(W/2, H/2+55, `BEST: ${hs}`, { font:'14px monospace', fill:'#ffdd00' }).setOrigin(0.5);

    const cont = this.add.text(W/2, H/2+120, `PRESS SPACE FOR STAGE ${data.stage+1}`, {
      font:'15px monospace', fill:'#aaaaaa'
    }).setOrigin(0.5);
    this.tweens.add({ targets:cont, alpha:{ from:1, to:0.2 }, duration:600, yoyo:true, repeat:-1 });

    this.input.keyboard.once('keydown-SPACE', () =>
      this.scene.start('Game', { stage:data.stage+1, score:data.score }));
    this.input.once('pointerdown', () =>
      this.scene.start('Game', { stage:data.stage+1, score:data.score }));
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  GAME OVER SCENE
// ═════════════════════════════════════════════════════════════════════════════
class GameOverScene extends Phaser.Scene {
  constructor() { super({ key:'GameOver' }); }

  create(data) {
    this.add.rectangle(W/2,H/2,W,H,0x000000,0.88);
    this.add.text(W/2, H/2-90, 'GAME OVER', {
      font:'bold 40px monospace', fill:'#ff2200', stroke:'#000', strokeThickness:5
    }).setOrigin(0.5);
    this.add.text(W/2, H/2-30, `STAGE ${data.stage}`, { font:'16px monospace', fill:'#aaaaaa' }).setOrigin(0.5);
    this.add.text(W/2, H/2+10, `SCORE: ${data.score}`, { font:'22px monospace', fill:'#ffffff' }).setOrigin(0.5);
    const hs = parseInt(localStorage.getItem('spaceShooterHS')||'0');
    this.add.text(W/2, H/2+50, `BEST:  ${hs}`, { font:'16px monospace', fill:'#ffdd00' }).setOrigin(0.5);

    if (isTopTen(data.score)) {
      const topTxt = this.add.text(W/2, H/2+95, '★  NEW TOP 10!  ★', {
        font:'bold 16px monospace', fill:'#00ff88'
      }).setOrigin(0.5);
      this.tweens.add({ targets:topTxt, alpha:{ from:1, to:0.3 }, duration:500, yoyo:true, repeat:-1 });
      this.add.text(W/2, H/2+125, 'Entering name in 2s…', {
        font:'12px monospace', fill:'#667766'
      }).setOrigin(0.5);
      this.time.delayedCall(2000, () =>
        this.scene.start('NameEntry', { score:data.score, fromScene:'GameOver', stage:data.stage }));
    } else {
      const retry = this.add.text(W/2, H/2+120, 'PRESS SPACE FOR MENU', {
        font:'16px monospace', fill:'#aaaaaa'
      }).setOrigin(0.5);
      this.tweens.add({ targets:retry, alpha:{ from:1, to:0.2 }, duration:600, yoyo:true, repeat:-1 });
      this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Menu'));
      this.input.once('pointerdown', () => this.scene.start('Menu'));
    }
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  VICTORY SCENE  (after stage 3 boss)
// ═════════════════════════════════════════════════════════════════════════════
class VictoryScene extends Phaser.Scene {
  constructor() { super({ key:'Victory' }); }

  create(data) {
    this.bg = this.add.tileSprite(0,0,W,H,'bg-back').setOrigin(0);
    this.st = this.add.tileSprite(0,0,W,H,'bg-stars').setOrigin(0).setAlpha(0.5);

    this.add.text(W/2, 100, '✦ YOU WIN ✦', {
      font:'bold 44px monospace', fill:'#ffdd00', stroke:'#aa6600', strokeThickness:6
    }).setOrigin(0.5);
    this.add.text(W/2, 175, 'ALL 3 STAGES CLEARED', {
      font:'18px monospace', fill:'#00ff88'
    }).setOrigin(0.5);
    this.add.text(W/2, H/2-20, `FINAL SCORE`, { font:'16px monospace', fill:'#aaaaaa' }).setOrigin(0.5);
    this.add.text(W/2, H/2+25, `${data.score}`, { font:'bold 38px monospace', fill:'#ffffff' }).setOrigin(0.5);
    const hs = parseInt(localStorage.getItem('spaceShooterHS')||'0');
    this.add.text(W/2, H/2+80, `HIGH SCORE: ${hs}`, { font:'16px monospace', fill:'#ffdd00' }).setOrigin(0.5);

    if (isTopTen(data.score)) {
      const topTxt = this.add.text(W/2, H-110, '★  NEW TOP 10!  ★', {
        font:'bold 16px monospace', fill:'#00ff88'
      }).setOrigin(0.5);
      this.tweens.add({ targets:topTxt, alpha:{ from:1, to:0.3 }, duration:500, yoyo:true, repeat:-1 });
      this.add.text(W/2, H-82, 'Entering name in 2s…', {
        font:'12px monospace', fill:'#667766'
      }).setOrigin(0.5);
      this.time.delayedCall(2000, () =>
        this.scene.start('NameEntry', { score:data.score, fromScene:'Victory' }));
    } else {
      const cont = this.add.text(W/2, H-80, 'PRESS SPACE TO RETURN TO MENU', {
        font:'14px monospace', fill:'#aaaaaa'
      }).setOrigin(0.5);
      this.tweens.add({ targets:cont, alpha:{ from:1, to:0.2 }, duration:600, yoyo:true, repeat:-1 });
      this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Menu'));
      this.input.once('pointerdown', () => this.scene.start('Menu'));
    }
  }

  update(_, delta) {
    const dt = delta/1000;
    this.bg.tilePositionY += 15*dt;
    this.st.tilePositionY += 35*dt;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  NAME ENTRY SCENE  (shown when player makes top 10)
// ═════════════════════════════════════════════════════════════════════════════
class NameEntryScene extends Phaser.Scene {
  constructor() { super({ key:'NameEntry' }); }

  create(data = {}) {
    this.entryScore  = data.score     || 0;
    this.fromScene   = data.fromScene || 'GameOver';
    this.playerName  = '';
    this.maxLen      = 12;
    this.blinkTimer  = 0;
    this.showCursor  = true;
    this.submitted   = false;

    // Scrolling bg
    this.bgBack  = this.add.tileSprite(0,0,W,H,'bg-back').setOrigin(0).setDepth(0);
    this.bgStars = this.add.tileSprite(0,0,W,H,'bg-stars').setOrigin(0).setDepth(1).setAlpha(0.4);
    this.add.rectangle(W/2,H/2,W,H,0x000000,0.78).setDepth(2);

    const isWin = this.fromScene === 'Victory';
    this.add.text(W/2, 38, isWin ? '-- YOU WIN --' : 'GAME OVER', {
      font:'bold 28px monospace',
      fill: isWin ? '#ffdd00' : '#ff3300',
      stroke:'#000', strokeThickness:4
    }).setOrigin(0.5).setDepth(3);

    this.add.text(W/2, 80, `SCORE: ${this.entryScore}`, {
      font:'bold 20px monospace', fill:'#ffffff'
    }).setOrigin(0.5).setDepth(3);

    this.add.text(W/2, 114, 'TOP 10!  ENTER YOUR NAME:', {
      font:'13px monospace', fill:'#00ff88'
    }).setOrigin(0.5).setDepth(3);

    // Name input box
    const g = this.add.graphics().setDepth(3);
    g.lineStyle(2, 0x0066ff); g.strokeRect(W/2-130, 136, 260, 36);
    g.fillStyle(0x000033, 0.85); g.fillRect(W/2-129, 137, 258, 34);
    this.nameText = this.add.text(W/2, 154, '_', {
      font:'bold 22px monospace', fill:'#ffff88'
    }).setOrigin(0.5).setDepth(4);

    this.add.text(W/2, 182, 'A-Z  0-9  BACKSPACE  ENTER to confirm', {
      font:'9px monospace', fill:'#445544'
    }).setOrigin(0.5).setDepth(3);

    // Current leaderboard preview
    this._drawLeaderboardPreview(206);

    // Keyboard
    this.keyHandler = (e) => this._onKey(e);
    this.input.keyboard.on('keydown', this.keyHandler);
  }

  _drawLeaderboardPreview(startY) {
    const lb = getLeaderboard();
    this.add.text(W/2, startY, '-- CURRENT TOP 10 --', {
      font:'11px monospace', fill:'#334433'
    }).setOrigin(0.5).setDepth(3);
    const cols = ['#ffd700','#c0c0c0','#cd7f32'];
    lb.forEach((entry, i) => {
      const y = startY + 16 + i * 19;
      const col = cols[i] || '#778877';
      this.add.text(18, y, `${i+1}.`, { font:'11px monospace', fill:col }).setDepth(3);
      this.add.text(46, y, (entry.name||'PILOT').padEnd(12), { font:'11px monospace', fill:'#889988' }).setDepth(3);
      this.add.text(W-14, y, `${entry.score}`, { font:'11px monospace', fill:col }).setOrigin(1,0).setDepth(3);
    });
    if (!lb.length) {
      this.add.text(W/2, startY+20, '(empty)', { font:'11px monospace', fill:'#333333' }).setOrigin(0.5).setDepth(3);
    }
  }

  _onKey(e) {
    if (this.submitted) return;
    const k = e.keyCode;
    if ((k >= 65 && k <= 90) || (k >= 48 && k <= 57)) {
      if (this.playerName.length < this.maxLen) this.playerName += e.key.toUpperCase();
    } else if (k === 8) {
      this.playerName = this.playerName.slice(0, -1);
    } else if (k === 13) {
      this._submit();
    }
  }

  _submit() {
    if (this.submitted) return;
    this.submitted = true;
    this.input.keyboard.off('keydown', this.keyHandler);
    const finalName = this.playerName.trim() || 'PILOT';
    saveToLeaderboard(finalName, this.entryScore);
    this.time.delayedCall(200, () =>
      this.scene.start('Leaderboard', { highlight:this.entryScore, newName:finalName }));
  }

  update(_, delta) {
    const dt = delta / 1000;
    this.bgBack.tilePositionY  += 15 * dt;
    this.bgStars.tilePositionY += 35 * dt;
    this.blinkTimer += delta;
    if (this.blinkTimer > 530) { this.blinkTimer = 0; this.showCursor = !this.showCursor; }
    this.nameText.setText(this.playerName + (this.showCursor ? '\u2588' : ' '));
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  LEADERBOARD SCENE
// ═════════════════════════════════════════════════════════════════════════════
class LeaderboardScene extends Phaser.Scene {
  constructor() { super({ key:'Leaderboard' }); }

  create(data = {}) {
    const highlight = data.highlight ?? null;
    const newName   = data.newName   ?? null;

    this.bgBack  = this.add.tileSprite(0,0,W,H,'bg-back').setOrigin(0);
    this.bgStars = this.add.tileSprite(0,0,W,H,'bg-stars').setOrigin(0).setAlpha(0.5);
    this.add.rectangle(W/2,H/2,W,H,0x000000,0.80);

    // Title
    this.add.text(W/2, 36, 'LEADERBOARD', {
      font:'bold 28px monospace', fill:'#ffd700',
      stroke:'#000', strokeThickness:4
    }).setOrigin(0.5);

    // Dividers / header
    const g = this.add.graphics();
    g.lineStyle(1, 0x334433);
    g.lineBetween(16, 60, W-16, 60);
    this.add.text(20,  66, 'RANK', { font:'10px monospace', fill:'#446644' });
    this.add.text(82,  66, 'NAME',  { font:'10px monospace', fill:'#446644' });
    this.add.text(W-20,66, 'SCORE', { font:'10px monospace', fill:'#446644' }).setOrigin(1,0);
    g.lineBetween(16, 78, W-16, 78);

    const lb = getLeaderboard();
    const medalCol = ['#ffd700','#c0c0c0','#cd7f32'];

    if (!lb.length) {
      this.add.text(W/2, H/2, 'No scores yet.\nPlay to get on the board!', {
        font:'16px monospace', fill:'#555555', align:'center'
      }).setOrigin(0.5);
    } else {
      lb.forEach((entry, i) => {
        const rowH  = 44;
        const y     = 84 + i * rowH;
        const isNew = highlight !== null && entry.score === highlight && entry.name === newName;
        const col   = medalCol[i] || '#778877';

        if (isNew) {
          this.add.rectangle(W/2, y + rowH/2 - 2, W-16, rowH-4, 0x003300, 1).setOrigin(0.5);
          g.lineStyle(1, 0x00aa44); g.strokeRect(8, y-1, W-16, rowH-2);
        }

        // Rank badge
        const rankStr = i < 3 ? ['#1','#2','#3'][i] : `#${i+1}`;
        this.add.text(20, y+10, rankStr, { font:'bold 16px monospace', fill:col });

        // Name
        this.add.text(76, y+10, (entry.name||'PILOT'), {
          font:'bold 16px monospace', fill: isNew ? '#00ff88' : '#dddddd'
        });

        // Score
        this.add.text(W-20, y+10, `${entry.score}`, {
          font:'bold 16px monospace', fill: isNew ? '#00ff88' : col
        }).setOrigin(1, 0);

        // NEW tag
        if (isNew) {
          this.add.text(W-20, y+26, 'NEW!', {
            font:'9px monospace', fill:'#00cc66'
          }).setOrigin(1, 0);
        }
      });
    }

    g.lineStyle(1, 0x334433); g.lineBetween(16, H-65, W-16, H-65);
    const back = this.add.text(W/2, H-40, 'SPACE = MENU', {
      font:'14px monospace', fill:'#888888'
    }).setOrigin(0.5);
    this.tweens.add({ targets:back, alpha:{ from:1, to:0.2 }, duration:600, yoyo:true, repeat:-1 });
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Menu'));
    this.input.once('pointerdown', () => this.scene.start('Menu'));
  }

  update(_, delta) {
    const dt = delta/1000;
    this.bgBack.tilePositionY  += 15*dt;
    this.bgStars.tilePositionY += 35*dt;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  PHASER CONFIG
// ═════════════════════════════════════════════════════════════════════════════
new Phaser.Game({
  type:            Phaser.AUTO,
  width:           W,
  height:          H,
  backgroundColor: '#000010',
  antialias:       true,
  roundPixels:     false,
  scene:           [PreloadScene, MenuScene, GameScene, StageClearScene, GameOverScene, VictoryScene, NameEntryScene, LeaderboardScene],
  scale: {
    mode:       Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
});
