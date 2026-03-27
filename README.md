# 🚀 Space Shooter

A retro-style vertical-scrolling space shooter built with **Phaser.js**, featuring 4 stages, 4 unique bosses, power-ups, a homing rocket, and a top-10 leaderboard.

---

## 🎮 Play

```bash
node server.js
```
Then open **http://localhost:3000** in your browser.

---

## 📸 Stages

| Stage | Theme | Boss |
|---|---|---|
| 1 | Deep Space | Top-Down Boss — sweep + bolt spread + ray beam |
| 2 | Blue Nebula | Spaceship Unit — agile diver + warp shots |
| 3 | Ancient Galaxy | Capital Ship — alien minions + 3-phase assault |
| 4 | **Extreme** | **Dreadnought** — predictive aim + spiral volleys + dives |

---

## 🕹️ Controls

| Input | Action |
|---|---|
| `Arrow Keys` / `WASD` | Move ship |
| `Space` / `Left Click` | Shoot (auto-fire) |
| `P` | Pause |
| `L` | Leaderboard |

---

## ⚡ Power-Ups

| Icon | Name | Effect | Duration |
|---|---|---|---|
| 🔵 | **Shield** | Invincibility bubble | 8s |
| 🟡 | **Double Shot** | 2 parallel lasers | 12s |
| 🩵 | **Triple Shot** | 3-bullet fan spread | 14s |
| 🟢 | **Speed Boost** | +90 px/s movement | 7s |
| 🔴 | **Rocket** | Auto-fires homing missile every 2.5s, area explosion | 12s |
| 💣 | **Bomb** | Clears all on-screen enemies instantly | — |

Triple shot and Rocket unlock from Stage 3 onwards, with higher drop rates in Stage 4.

---

## 👾 Enemies

| Type | HP | Behavior |
|---|---|---|
| **Small** | 1 | Fast, straight down, wobbles |
| **Medium** | 2 | Sine-wave movement, fires aimed bolts |
| **Large** | 3 | Slow, tanky, fires spread shots |
| **Alien** | 2 | Boss 3/4 minion — homes toward player |

Enemy HP scales **+1 per stage**.

---

## 🏆 Leaderboard

- Top 10 scores saved to `localStorage`
- Name entry screen appears automatically when you crack the top 10
- View anytime from the main menu with `L`

---

## 🛠️ Tech Stack

- **[Phaser 3.60](https://phaser.io/)** — game engine (loaded from CDN)
- **Vanilla JavaScript** — no build step, no bundler
- **Node.js** — lightweight static file server (`server.js`)
- **localStorage** — leaderboard persistence

---

## 📁 Project Structure

```
Space Shooter/
├── index.html               # HTML shell
├── game.js                  # All game logic (~1800 lines)
├── server.js                # Static file server
├── SPEC.md                  # Full game specification
├── assets/                  # Kenney asset packs
│   ├── space-shooter-redux/
│   ├── space-shooter-extension/
│   └── simple-space/
└── Legacy Collection/       # Ansimuz pixel art assets
    └── Assets/
        ├── Characters/      # Ships, enemies
        ├── Environments/    # Backgrounds
        ├── Misc/            # Bosses, explosions, weapons
        └── Packs/           # SpaceShooter, SpaceShipShooter
```

---

## 🎨 Asset Credits

- **[Ansimuz](https://ansimuz.com/)** — Legacy Collection (ships, enemies, bosses, explosions, backgrounds, weapons)
- **[Kenney](https://kenney.nl/)** — Space Shooter Redux, Space Shooter Extension, Simple Space (power-ups, missiles, UI)

---

## 📜 License

Game code: **MIT**
Assets: see each artist's individual license (Ansimuz / Kenney).
