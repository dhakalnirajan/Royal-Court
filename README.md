# Royal-Court

**Classic “Raja / Rani / Chor / Police” Social Deduction Game — Web Version (React + TypeScript + Vite)**

Royal-Court is a browser-based implementation of the traditional “Raja–Mantri / Raja–Rani–Chor–Police” style of social/party game. Players are assigned secret roles and must use deduction and strategy to earn points. This modern web version automates role assignment and scoring while preserving the fun of the classic game.

---

## 🎯 Game Description

**Royal-Court** is a strategic social deduction game where players take on hidden roles in a kingdom. Each role has unique objectives and point values. The main goal is to earn the highest points by successfully executing your role or identifying others’ roles.

The game is inspired by traditional games like *Raja–Mantri–Chor–Sipahi* (India/Nepal) and *Raja-Rani-Chor-Police*, modernized for a browser-based, single-device experience.

---

## 🧩 Game Objective

- Players are secretly assigned roles: **Raja (King), Police, Chor (Thief), and other subjects**.  
- The **Police** must identify the **Chor** to earn points.  
- The **Raja** maintains order and earns points automatically.  
- Other players try to survive or retain their points.

The winner is the player with the highest total points at the end of one or more rounds.

---

## ⚔️ Game Phases

1. **Distribution**  
   - Roles are assigned secretly to all players.  
   - Each player sees only their own role.

2. **The Reveal**  
   - The **Raja** reveals themselves first.  
   - The **Police** is then revealed for strategic context.

3. **Investigation**  
   - The **Police** must deduce who among the remaining players is the **Chor**.

4. **Judgment**  
   - Police selects a suspect:  
     - **Correct guess:** Justice is served; points awarded to Police.  
     - **Wrong guess:** Chor escapes; points awarded to Chor.

---

## 👑 Roles & Strategy

Each role has a priority, points, and an objective:

| Role    | Points | Objective |
|---------|--------|-----------|
| **Raja** | 2000   | Reveal yourself at the start and maintain order. |
| **Police** | 800 (if correct) | Identify the Chor correctly during investigation. |
| **Chor** | 800 (if Police guesses wrong) | Avoid detection to gain points. |
| **Other Players** | Varies | Survive the round and retain points. |

Players can strategize by bluffing, analyzing behavior, or making calculated guesses.

---

## 💰 Scoring System

### Justice Served (Police guesses correctly)
- **Police:** +800 points  
- **Chor:** 0 points  
- **Others:** Retain points  

### Thief Escapes (Police guesses wrong)
- **Police:** 0 points  
- **Chor:** +800 points  
- **Others:** Retain points  

### Raja
- Always scores **2000 points**, provided they reveal themselves correctly at the start.

---

## ✅ Features

- Hidden identities and deduction-based gameplay  
- Role-specific objectives with distinct points  
- Multi-phase structure: Distribution → Reveal → Investigation → Judgment  
- Strategy and bluffing encouraged  
- Browser-based single-device experience; works for small groups  
- Modern front-end using **React + TypeScript + Vite**  
- Automatic score tracking and role assignment  
- GitHub Actions workflow for easy continuous deployment

---

## 🚀 Getting Started — Local Setup

1. **Clone the repo**  
   ```bash
   git clone https://github.com/dhakalnirajan/Royal-Court.git
   cd Royal-Court
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Deploy (optional)**

   * Publish to GitHub Pages (or other static hosting).
   * GitHub Pages is already configured with a `deployment` branch and GitHub Actions workflow.

---

## 📄 Project Structure

* `vite.config.ts` — Vite configuration including GitHub Pages base path
* `src/` — React + TypeScript source code, including components, types, and utilities
* `public/index.html` — Main HTML entry point
* `package.json` — Dependencies, scripts, build & deploy scripts
* `dist/` (after build) — Production-ready static output

---

## 🧠 About the Original Game

Inspired by traditional “Raja–Mantri–Chor–Sipahi” games popular in South Asia. The game is a classic social/party game using chits or cards for random role assignment. This web version automates role assignment, scoring, and gameplay while preserving the social deduction and strategic elements of the original game.
