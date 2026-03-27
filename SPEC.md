# Space Shooter — Game Specification

**Engine:** Phaser.js (v3)
**Style:** Vertical-scrolling top-down shooter (Galaga / 1942 style)
**Platform:** Browser (HTML5)

---

## Overview

A retro pixel-art space shooter. The player pilots a spaceship upward through waves of enemies, collects power-ups, avoids asteroids, and faces a boss at the end of each milestone. All three milestones are independently playable and build on each other.

---

## Core Requirements

### Gameplay
- Vertical auto-scroll with parallax star/planet background
- Player moves freely in all 4 directions within screen bounds
- Player fires upward with auto-fire (hold Space / left mouse button)
- 3 lives; losing all lives shows Game Over screen
- Score increases on enemy kills; displayed on HUD
- Each milestone ends with a boss fight

### Controls
| Input | Action |
|---|---|
| Arrow keys / WASD | Move ship |
| Space / Left Click | Shoot |
| P | Pause |

### Enemy Behavior
- **Small** — fast, straight down, fires occasionally
- **Medium** — slower, sine-wave movement, fires more often
- **Large** — slow, tanky, fires spread shot
- **Boss** — unique per milestone, multi-phase health bar

### Power-ups (drop randomly on enemy death)
- Shield — temporary invincibility bubble
- Double shot — fires 2 parallel lasers
- Speed boost — increases ship speed for 5s
- Bomb — clears all on-screen enemies

---

## Milestone 1 — Core Loop

> **Goal:** Fly, shoot, dodge. The game is fun and responsive.

### Features
- Player ship with idle + thrust animation
- Parallax background (3 layers: far stars, near stars, planet)
- Single enemy type (small) spawning in waves from top
- Player bullet (basic laser)
- Collision detection: bullet→enemy, enemy→player
- Explosion animation on death
- HUD: score + lives
- Boss: top-down-boss (side-to-side sweep pattern, fires bolt projectiles)
- Win condition: defeat boss → "Stage Clear" screen
- Lose condition: 0 lives → Game Over screen

### Assets Used

#### Player Ship
| Asset | Path |
|---|---|
| Ship sprite (5 frames, red) | `Legacy Collection/Assets/Characters/top-down-shooter-ship/spritesheets/red/ship-01.png` |
| Thrust animation | `Legacy Collection/Assets/Characters/top-down-shooter-ship/spritesheets/thrust/ship-01.png` |

#### Background (Parallax Layers)
| Asset | Path |
|---|---|
| Deep space (back layer) | `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/background/layered/bg-back.png` |
| Stars (mid layer) | `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/background/layered/bg-stars.png` |
| Planet (front layer) | `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/background/layered/bg-planet.png` |

#### Enemy (Small)
| Asset | Path |
|---|---|
| Enemy sprite (5 frames) | `Legacy Collection/Assets/Characters/top-down-shooter-enemies/spritesheets/enemy-01.png` |
| Enemy death (7 frames) | `Legacy Collection/Assets/Characters/top-down-shooter-enemies/spritesheets/enemy-explosion.png` |

#### Player Bullet
| Asset | Path |
|---|---|
| Laser shot | `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/shoot/shoot1.png` |
| Muzzle flash | `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/flash/flash.png` |

#### Explosions
| Asset | Path |
|---|---|
| Small explosion (9 frames) | `Legacy Collection/Assets/Misc/Explosion/spritesheet/explosion-animation.png` |
| Frame data (JSON) | `Legacy Collection/Assets/Misc/Explosion/spritesheet/explosion-animation.json` |

#### Hit Effect
| Asset | Path |
|---|---|
| Hit flash (4 frames) | `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/Hit/sprites/hit1.png` → `hit4.png` |

#### Boss
| Asset | Path |
|---|---|
| Boss body (5 frames) | `Legacy Collection/Assets/Misc/top-down-boss/PNG/spritesheets/boss.png` |
| Boss thrust (2 frames) | `Legacy Collection/Assets/Misc/top-down-boss/PNG/spritesheets/boss-thrust.png` |
| Boss bolt projectile | `Legacy Collection/Assets/Misc/top-down-boss/PNG/spritesheets/bolt.png` |
| Boss ray attack | `Legacy Collection/Assets/Misc/top-down-boss/PNG/spritesheets/rays.png` |

#### Sound FX
| Asset | Path |
|---|---|
| Player shot | `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/Sound FX/shot 1.wav` |
| Explosion | `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/Sound FX/explosion.wav` |
| Hit | `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/Sound FX/hit.wav` |

---

## Milestone 2 — Enemy Variety + Power-ups

> **Goal:** Multiple enemy types, enemy fire, power-ups, asteroids as hazards.

Builds on Milestone 1. All Milestone 1 features remain.

### New Features
- 3 enemy types with distinct movement patterns (small, medium, large)
- Enemies fire back at the player
- 4 power-up types drop on enemy death
- Asteroid hazards scroll down and damage the player on contact
- Wave system: pre-scripted formations per wave
- Boss: top-down-boss (Milestone 1 boss, but with added cannon attacks)

### Assets Used

#### Enemy (Medium)
| Asset | Path |
|---|---|
| Enemy-02 sprite (4 frames) | `Legacy Collection/Assets/Characters/top-down-shooter-enemies/spritesheets/enemy-02.png` |

#### Enemy (Large)
| Asset | Path |
|---|---|
| Enemy-03 sprite (4 frames) | `Legacy Collection/Assets/Characters/top-down-shooter-enemies/spritesheets/enemy-03.png` |
| Alien flying enemy (spritesheet) | `Legacy Collection/Assets/Characters/alien-flying-enemy/spritesheet.png` |

#### Enemy Projectile
| Asset | Path |
|---|---|
| Enemy bolt (2 frames) | `Legacy Collection/Assets/Misc/EnemyProjectile/spritesheet.png` |
| Enemy laser bolts (4 styles) | `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/Laser Bolts/laser-bolts1.png` → `laser-bolts4.png` |

#### Player Weapon Upgrade (Double Shot)
| Asset | Path |
|---|---|
| Upgraded laser | `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/shoot/shoot2.png` |
| Warped bolt shot (4 frames) | `Legacy Collection/Assets/Misc/Warped shooting fx/Bolt/spritesheet.png` |
| Charged shot (6 frames) | `Legacy Collection/Assets/Misc/Warped shooting fx/charged/spritesheet.png` |

#### Power-ups
| Asset | Path |
|---|---|
| Power-up 1 (Shield) | `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/PowerUps/power-up1.png` |
| Power-up 2 (Double shot) | `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/PowerUps/power-up2.png` |
| Power-up 3 (Speed) | `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/PowerUps/power-up3.png` |
| Power-up 4 (Bomb) | `Legacy Collection/Assets/Packs/SpaceShipShooter/Sprites/PowerUps/power-up4.png` |
| Kenney power-up icons | `assets/space-shooter-redux/PNG/Power-ups/` |

#### Asteroids
| Asset | Path |
|---|---|
| Large asteroid | `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/asteroids/asteroid.png` |
| Small asteroid | `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/asteroids/asteroid-small.png` |
| Asteroid variants (5 types) | `Legacy Collection/Assets/Environments/top-down-space-environment/PNG/layers/cut-out-sprites/asteroid-01.png` → `asteroid-05.png` |
| Kenney meteors | `assets/space-shooter-redux/PNG/Meteors/` |

#### Boss Upgrade (new cannon attacks)
| Asset | Path |
|---|---|
| Left cannon | `Legacy Collection/Assets/Misc/top-down-boss/PNG/spritesheets/cannon-left.png` |
| Right cannon | `Legacy Collection/Assets/Misc/top-down-boss/PNG/spritesheets/cannon-right.png` |
| Helmet (phase 2 reveal) | `Legacy Collection/Assets/Misc/top-down-boss/PNG/spritesheets/helmet.png` |

#### Background (upgrade: richer parallax)
| Asset | Path |
|---|---|
| Blue deep space | `Legacy Collection/Assets/Environments/space_background_pack/Blue Version/layered/blue-back.png` |
| Blue starfield | `Legacy Collection/Assets/Environments/space_background_pack/Blue Version/layered/blue-stars.png` |
| Large planet | `Legacy Collection/Assets/Environments/space_background_pack/Blue Version/layered/prop-planet-big.png` |
| Small planet | `Legacy Collection/Assets/Environments/space_background_pack/Blue Version/layered/prop-planet-small.png` |

#### Sound FX
| Asset | Path |
|---|---|
| Alt shot sound | `Legacy Collection/Assets/Packs/SpaceShooter/Space Shooter files/Sound FX/shot 2.wav` |

---

## Milestone 3 — Polish + Complete Game

> **Goal:** A complete, shareable game with multiple stages, high score, and full visual polish.

Builds on Milestone 2. All previous features remain.

### New Features
- 3 distinct stages, each with unique background and enemy formations
- New player ship option (Warped Fast Ship — 5 directional frames)
- Explosion variety: 7 explosion styles (a–g) mapped to enemy size
- Screen shake on boss hits and player death
- High score saved to localStorage
- Main menu screen with title + start button
- Stage transition screen between milestones
- Game Over screen with final score + restart
- Damage states on player ship (Kenney damage overlays)

### Assets Used

#### Alternative Player Ship
| Asset | Path |
|---|---|
| Warped Fast Ship (5 frames) | `Legacy Collection/Assets/Misc/Warped Fast Ship Files/Sprites/ship-sprites/ship-01.png` → `ship-05.png` |
| Warped thrust (2 frames) | `Legacy Collection/Assets/Misc/Warped Fast Ship Files/Sprites/thrust-sprites/thrust-preview1.png` → `thrust-preview2.png` |
| Animated spaceship-unit (4 frames) | `Legacy Collection/Assets/Misc/spaceship-unit/Spritesheets/separated sprites/spaceship-unit.png` |
| Spaceship thrust (2 frames) | `Legacy Collection/Assets/Misc/spaceship-unit/Spritesheets/separated sprites/thrust.png` |

#### Explosion Pack (size-matched)
| Asset | Path | Used for |
|---|---|---|
| Explosion A (8 frames) | `Legacy Collection/Assets/Misc/Explosions pack/explosion-1-a/spritesheet.png` | Small enemies |
| Explosion B (8 frames) | `Legacy Collection/Assets/Misc/Explosions pack/explosion-1-b/spritesheet.png` | Small enemies alt |
| Explosion C (10 frames) | `Legacy Collection/Assets/Misc/Explosions pack/explosion-1-c/spritesheet.png` | Medium enemies |
| Explosion D (12 frames) | `Legacy Collection/Assets/Misc/Explosions pack/explosion-1-d/spritsheet.png` | Medium enemies alt |
| Explosion E (22 frames) | `Legacy Collection/Assets/Misc/Explosions pack/explosion-1-e/` | Large enemies |
| Explosion F (8 frames) | `Legacy Collection/Assets/Misc/Explosions pack/explosion-1-f/Sprites.png` | Asteroids |
| Explosion G (7 frames) | `Legacy Collection/Assets/Misc/Explosions pack/explosion-1-g/spritesheet.png` | Boss |

#### Player Ship Damage States
| Asset | Path |
|---|---|
| Ship damage overlays | `assets/space-shooter-redux/PNG/Damage/` |
| Kenney player ships (multi-color) | `assets/space-shooter-redux/PNG/` |

#### Stage 3 Background (Parallax)
| Asset | Path |
|---|---|
| Classic parallax — background | `Legacy Collection/Assets/Environments/space_background_pack/Old Version/layers/parallax-space-backgound.png` |
| Classic parallax — big planet | `Legacy Collection/Assets/Environments/space_background_pack/Old Version/layers/parallax-space-big-planet.png` |
| Classic parallax — far planets | `Legacy Collection/Assets/Environments/space_background_pack/Old Version/layers/parallax-space-far-planets.png` |
| Classic parallax — ring planet | `Legacy Collection/Assets/Environments/space_background_pack/Old Version/layers/parallax-space-ring-planet.png` |
| Classic parallax — stars | `Legacy Collection/Assets/Environments/space_background_pack/Old Version/layers/parallax-space-stars.png` |
| Top-down space stage | `Legacy Collection/Assets/Environments/top-down-space-environment/PNG/layers/stage-back.png` |
| Planet / eclipse props | `Legacy Collection/Assets/Environments/top-down-space-environment/PNG/layers/cut-out-sprites/planet.png` |

#### Kenney Supplementary Assets
| Asset | Path |
|---|---|
| Extended enemy ships | `assets/space-shooter-extension/PNG/Sprites/Ships/` |
| Rockets / missiles | `assets/space-shooter-extension/PNG/Sprites/Missiles/` |
| Space station parts (background detail) | `assets/space-shooter-extension/PNG/Sprites/Station/` |
| Simple space sprites (UI icons) | `assets/simple-space/PNG/Default/` |
| Spritesheet (all Kenney sprites) | `assets/space-shooter-redux/Spritesheet/` |

#### Crossed-shot (power-up weapon tier 3)
| Asset | Path |
|---|---|
| Crossed shot (6 frames) | `Legacy Collection/Assets/Misc/Warped shooting fx/crossed/spritesheet.png` |

---

## Asset Summary by Category

| Category | Primary Source | Fallback |
|---|---|---|
| Player ship | `top-down-shooter-ship` (Legacy) | `spaceship-unit` (Legacy) |
| Enemies small | `top-down-shooter-enemies/enemy-01` (Legacy) | `SpaceShipShooter/EnemySmall` (Legacy) |
| Enemies medium | `top-down-shooter-enemies/enemy-02` (Legacy) | `SpaceShipShooter/Enemy Medium` (Legacy) |
| Enemies large | `top-down-shooter-enemies/enemy-03` (Legacy) | `alien-flying-enemy` (Legacy) |
| Boss | `top-down-boss` (Legacy) | — |
| Backgrounds | `space_background_pack` (Legacy) | `SpaceShooter/background` (Legacy) |
| Asteroids | `top-down-space-environment` (Legacy) | `SpaceShooter/asteroids` (Legacy) |
| Player bullets | `SpaceShooter/shoot` (Legacy) | `Warped shooting fx` (Legacy) |
| Enemy bullets | `EnemyProjectile` (Legacy) | `SpaceShipShooter/Laser Bolts` (Legacy) |
| Explosions | `Explosions pack a–g` (Legacy) | `space-shooter-redux/Effects` (Kenney) |
| Power-ups | `SpaceShipShooter/PowerUps` (Legacy) | `space-shooter-redux/Power-ups` (Kenney) |
| Sound FX | `SpaceShooter/Sound FX` (Legacy) | — |
