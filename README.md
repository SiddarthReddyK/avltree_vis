# AVL Tree Visualizer

A fully interactive, browser-based visualization of an **AVL (Adelson-Velsky and Landis) Self-Balancing Binary Search Tree**, built with pure HTML, CSS, and Vanilla JavaScript — no frameworks required.

---

## 📖 Project Overview

This project lets you insert numbers one at a time and watch the AVL tree rebalance itself in real time. Each node is rendered as an animated circle, edges are drawn with SVG, and a banner + scrollable log tells you exactly which rotation occurred (LL, RR, LR, or RL) and why.

**Key features:**
- Live animated tree with smooth CSS transitions
- Color-coded rotation highlighting
- Balance factor badge on every node
- Timestamped rotation log
- One-click demo sequences (LL, RR, LR, RL, Balanced)
- Fully responsive layout

---

## ⏱ Time Complexity of BST Operations

| Operation | Average Case | Worst Case (unbalanced) |
|-----------|:------------:|:-----------------------:|
| Search    | O(log n)     | O(n)                    |
| Insert    | O(log n)     | O(n)                    |
| Delete    | O(log n)     | O(n)                    |
| Traversal | O(n)         | O(n)                    |

> A standard (unbalanced) BST degenerates to a **linked list** in the worst case (sorted insertion), giving O(n) for search and insert.

---

## ⚖️ Why a Balanced BST is Needed

A plain Binary Search Tree offers O(log n) operations only when the tree is reasonably balanced. If you insert keys in sorted order:

```
Insert: 10 → 20 → 30 → 40 → 50
BST result:
  10
    \
    20
      \
      30
        \
        40
          \
          50
```

Every operation now traverses the entire height — O(n). For large datasets, this is unacceptable.

**Balanced BSTs guarantee O(log n) for all operations** by automatically restructuring themselves after each insertion.

---

## 🌲 Introduction to AVL Trees

An **AVL Tree** (named after Adelson-Velsky and Landis, 1962) is a self-balancing BST where the **height difference between the left and right subtrees of any node is at most 1**.

Properties:
- BST ordering is maintained at all times.
- After every insertion, the tree checks balance and applies at most one rotation (or two for double rotations).
- Height is always O(log n), guaranteeing O(log n) operations.

---

## 📐 Detecting Imbalance: Balance Factor

The **Balance Factor (BF)** of a node is defined as:

```
BF(node) = height(left subtree) − height(right subtree)
```

| BF Value | Meaning               |
|:--------:|-----------------------|
| -1, 0, 1 | Node is balanced ✅    |
| +2       | Left-heavy — rotate! ⚠️|
| -2       | Right-heavy — rotate! ⚠️|

After every insert, the tree walks back up the path to the root, updating heights and checking for `|BF| > 1`.

---

## 🔄 The Four Rotation Cases

### LL Rotation (Left-Left Case)

**When:** The inserted node is in the **left subtree of the left child** (BF = +2, left child BF = +1).  
**Fix:** Single **right rotation** on the unbalanced node.

```
    z (+2)              y
   / \                 / \
  y   T4   →        x    z
 / \                    / \
x   T3                T3  T4
```

### RR Rotation (Right-Right Case)

**When:** The inserted node is in the **right subtree of the right child** (BF = −2, right child BF = −1).  
**Fix:** Single **left rotation** on the unbalanced node.

```
  z (-2)                y
 / \                   / \
T1   y       →        z   x
    / \              / \
   T2   x           T1 T2
```

### LR Rotation (Left-Right Case)

**When:** The inserted node is in the **right subtree of the left child** (BF = +2, left child BF = −1).  
**Fix:** **Left rotation** on the left child, then **right rotation** on the unbalanced node.

```
  z (+2)          z (+2)         x
 / \             / \            / \
y  T4   →       x  T4   →    y    z
 \             /             / \  / \
  x           y            T1 T2 T3 T4
```

### RL Rotation (Right-Left Case)

**When:** The inserted node is in the **left subtree of the right child** (BF = −2, right child BF = +1).  
**Fix:** **Right rotation** on the right child, then **left rotation** on the unbalanced node.

```
z (-2)           z (-2)            x
 \                \               / \
  y      →         x      →     z    y
 /                  \           /     \
x                    y         T1     T2
```

---

## ⚔️ AVL Trees vs Red-Black Trees

| Feature                    | AVL Tree                  | Red-Black Tree             |
|----------------------------|---------------------------|----------------------------|
| **Balance Guarantee**      | Strictly balanced (|BF|≤1)| Approximately balanced     |
| **Height**                 | ≤ 1.44 × log₂(n+2)       | ≤ 2 × log₂(n+1)           |
| **Search Performance**     | Faster (shorter height)   | Slightly slower            |
| **Insert/Delete**          | More rotations needed     | Fewer rotations (≤3)       |
| **Memory**                 | Stores height             | Stores 1 color bit         |
| **Best Use Case**          | Read-heavy workloads      | Write-heavy workloads      |
| **Used In**                | Databases, compilers      | Linux kernel, `std::map`   |

**Rule of thumb:**
- Prefer **AVL** when lookups dominate (e.g., in-memory databases).
- Prefer **Red-Black** when insertions/deletions dominate (e.g., OS schedulers).

---

## 🛠 Technologies Used

| Technology | Role |
|------------|------|
| **HTML5**  | Semantic structure, accessible markup |
| **CSS3**   | Dark-mode design system, glassmorphism, CSS custom properties, smooth transitions, SVG edge styling |
| **Vanilla JavaScript (ES2020)** | AVL Tree data structure, DOM manipulation, ResizeObserver, SVG rendering |
| **Google Fonts** | Inter (UI) + JetBrains Mono (node values) |
| **Inline SVG** | Tree edge lines, header icon |

---

## 🚀 How to Run Locally

No build tools, no dependencies, no server needed.

1. **Clone or download** this repository.
2. Open the project folder — it should contain:
   ```
   avl_tree/
   ├── index.html
   ├── style.css
   ├── avl.js
   ├── avltree.java   (reference implementation — not used at runtime)
   └── README.md
   ```
3. **Double-click `index.html`** — it opens directly in any modern browser.

> ✅ Works in Chrome, Firefox, Edge, Safari — no server required.

---

## ☁️ Deploying to Netlify

### Option A — Drag & Drop (Instant)

1. Go to [app.netlify.com](https://app.netlify.com) and sign in.
2. Drag your **project folder** (`avl_tree/`) onto the Netlify dashboard drop zone.
3. Your site is live in seconds at a `*.netlify.app` URL.

### Option B — Git-based CI/CD

1. Push your project to a GitHub repository.
2. In Netlify → **New site from Git** → select your repo.
3. Settings:
   - **Build command:** *(leave blank — no build step)*
   - **Publish directory:** `.` (the root)
4. Click **Deploy site**.

Every `git push` will trigger a new deploy automatically.

---

## ☁️ Deploying to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
cd avl_tree
vercel
```
Follow the prompts. Vercel detects the static site automatically.

### Option B — Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New Project** → Import your GitHub repo.
3. Settings:
   - **Framework Preset:** Other
   - **Root Directory:** `.`
   - **Build command:** *(leave blank)*
   - **Output directory:** `.`
4. Click **Deploy**.

---

## 📁 Project Structure

```
avl_tree/
├── index.html      — Main HTML page (input, tree canvas, log, legend)
├── style.css       — Full dark-mode design system
├── avl.js          — AVL Tree logic + DOM visualization engine
├── avltree.java    — Reference Java implementation (not used at runtime)
└── README.md       — This document
```

---

## 📝 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
