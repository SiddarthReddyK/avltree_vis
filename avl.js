/* =============================================================
   avl.js  –  AVL Tree Visualizer
   Full implementation: Node, insert, rotations, visualization
   ============================================================= */

'use strict';

/* ---------------------------------------------------------------
   1.  AVL Tree Data Structure
   --------------------------------------------------------------- */

class AVLNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
        this.lastRotation = 'NONE';  // 'LL' | 'RR' | 'LR' | 'RL' | 'NONE'
        this.rotatedNodes = new Set(); // values involved in the latest rotation
    }

    /* ---- Height & Balance Factor ---- */

    height(node) {
        return node ? node.height : 0;
    }

    updateHeight(node) {
        if (!node) return;
        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    }

    getBalanceFactor(node) {
        if (!node) return 0;
        return this.height(node.left) - this.height(node.right);
    }

    /* ---- Rotations ---- */

    /**
     * Left Rotation  (RR case)
     *
     *    z                y
     *   / \              / \
     *  T1   y    =>    z    x
     *      / \        / \
     *    T2   x      T1 T2
     */
    leftRotate(z) {
        const y = z.right;
        const T2 = y.left;

        y.left = z;
        z.right = T2;

        this.updateHeight(z);
        this.updateHeight(y);

        return y;
    }

    /**
     * Right Rotation  (LL case)
     *
     *      z              y
     *     / \            / \
     *    y   T4   =>   x    z
     *   / \                / \
     *  x   T3            T3  T4
     */
    rightRotate(z) {
        const y = z.left;
        const T3 = y.right;

        y.right = z;
        z.left = T3;

        this.updateHeight(z);
        this.updateHeight(y);

        return y;
    }

    /* ---- Insert ---- */

    /**
     * Public insert – resets rotation tracking then calls recursive helper
     */
    insert(value) {
        this.lastRotation = 'NONE';
        this.rotatedNodes = new Set();
        this.root = this._insert(this.root, value);
    }

    _insert(node, value) {
        /* 1. Standard BST insert */
        if (!node) return new AVLNode(value);

        if (value < node.value) {
            node.left = this._insert(node.left, value);
        } else if (value > node.value) {
            node.right = this._insert(node.right, value);
        } else {
            // Duplicate – ignore
            return node;
        }

        /* 2. Update height */
        this.updateHeight(node);

        /* 3. Check balance */
        const bf = this.getBalanceFactor(node);

        /* ---- LL Case: left-left heavy ---- */
        if (bf > 1 && value < node.left.value) {
            this.lastRotation = 'LL';
            this.rotatedNodes = new Set([node.value, node.left.value]);
            return this.rightRotate(node);
        }

        /* ---- RR Case: right-right heavy ---- */
        if (bf < -1 && value > node.right.value) {
            this.lastRotation = 'RR';
            this.rotatedNodes = new Set([node.value, node.right.value]);
            return this.leftRotate(node);
        }

        /* ---- LR Case: left-right heavy ---- */
        if (bf > 1 && value > node.left.value) {
            this.lastRotation = 'LR';
            this.rotatedNodes = new Set([node.value, node.left.value, value]);
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        /* ---- RL Case: right-left heavy ---- */
        if (bf < -1 && value < node.right.value) {
            this.lastRotation = 'RL';
            this.rotatedNodes = new Set([node.value, node.right.value, value]);
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    /* ---- Utilities ---- */

    nodeCount() {
        return this._countNodes(this.root);
    }

    _countNodes(node) {
        if (!node) return 0;
        return 1 + this._countNodes(node.left) + this._countNodes(node.right);
    }

    treeHeight() {
        return this.height(this.root);
    }

    rootBF() {
        return this.getBalanceFactor(this.root);
    }
}

/* ---------------------------------------------------------------
   2.  Visualizer
   --------------------------------------------------------------- */

const tree = new AVLTree();

/* DOM refs */
const nodeInput = document.getElementById('node-input');
const insertBtn = document.getElementById('insert-btn');
const resetBtn = document.getElementById('reset-btn');
const rotationBanner = document.getElementById('rotation-banner');
const rotationText = document.getElementById('rotation-text');
const rotationIcon = document.getElementById('rotation-icon');
const treeContainer = document.getElementById('tree-container');
const edgeSvg = document.getElementById('edge-svg');
const nodeLayer = document.getElementById('node-layer');
const emptyState = document.getElementById('empty-state');
const rotationLog = document.getElementById('rotation-log');
const clearLogBtn = document.getElementById('clear-log-btn');
const metaNodes = document.getElementById('meta-nodes');
const metaHeight = document.getElementById('meta-height');
const metaBF = document.getElementById('meta-bf');

/* Rotation display config */
const ROTATION_CONFIG = {
    LL: { cls: 'banner-ll', tag: 'tag-ll', icon: '↙️', label: 'LL Rotation — Right rotation applied' },
    RR: { cls: 'banner-rr', tag: 'tag-rr', icon: '↘️', label: 'RR Rotation — Left rotation applied' },
    LR: { cls: 'banner-lr', tag: 'tag-lr', icon: '↖️↘', label: 'LR Rotation — Left then Right rotation applied' },
    RL: { cls: 'banner-rl', tag: 'tag-rl', icon: '↗️↙', label: 'RL Rotation — Right then Left rotation applied' },
    NONE: { cls: 'banner-none', tag: 'tag-none', icon: '✔️', label: 'Inserted — No rotation needed' },
};

/* Layout constants */
const LEVEL_HEIGHT = 80;   // vertical gap between levels (px)
const TOP_PADDING = 60;   // distance from top of container to root center
const SIDE_PADDING = 20;   // min horizontal margin from container edge

/* ---------------------------------------------------------------
   2a. Coordinate assignment
   --------------------------------------------------------------- */

/**
 * Walk the tree and assign (x, y) to every node.
 * Uses in-order indexing so nodes never overlap and are
 * evenly spaced regardless of tree shape.
 */
function assignCoordinates(root, containerWidth) {
    const positions = new Map();   // value -> {x, y}
    const treeH = tree.treeHeight();

    if (!root) return positions;

    /* Collect nodes in in-order sequence */
    const inorder = [];
    (function collect(node) {
        if (!node) return;
        collect(node.left);
        inorder.push(node);
        collect(node.right);
    })(root);

    const n = inorder.length;
    const usableW = containerWidth - 2 * SIDE_PADDING;
    const spacing = usableW / (n + 1);

    /* Give each node its in-order x position */
    const xByValue = new Map();
    inorder.forEach((node, idx) => {
        xByValue.set(node.value, SIDE_PADDING + spacing * (idx + 1));
    });

    /* Assign y by depth */
    (function setY(node, depth) {
        if (!node) return;
        positions.set(node.value, {
            x: xByValue.get(node.value),
            y: TOP_PADDING + depth * LEVEL_HEIGHT,
        });
        setY(node.left, depth + 1);
        setY(node.right, depth + 1);
    })(root, 0);

    return positions;
}

/* ---------------------------------------------------------------
   2b. DOM node pool (reuse existing elements)
   --------------------------------------------------------------- */

const domNodes = new Map();   // value -> HTMLElement

function getOrCreateDOMNode(value) {
    if (domNodes.has(value)) return domNodes.get(value);

    const el = document.createElement('div');
    el.className = 'tree-node entering';
    el.id = `node-${value}`;

    const label = document.createElement('span');
    label.textContent = value;
    el.appendChild(label);

    const badge = document.createElement('div');
    badge.className = 'bf-badge';
    badge.setAttribute('title', 'Balance Factor');
    el.appendChild(badge);

    nodeLayer.appendChild(el);
    domNodes.set(value, el);

    /* Remove 'entering' class after animation */
    el.addEventListener('animationend', () => el.classList.remove('entering'), { once: true });

    return el;
}

function removeOrphanedDOMNodes(activeValues) {
    for (const [value, el] of domNodes.entries()) {
        if (!activeValues.has(value)) {
            el.remove();
            domNodes.delete(value);
        }
    }
}

/* ---------------------------------------------------------------
   2c. Render
   --------------------------------------------------------------- */

function render() {
    if (!tree.root) {
        emptyState.classList.remove('hidden');
        edgeSvg.innerHTML = '';
        nodeLayer.innerHTML = '';
        domNodes.clear();
        updateMeta();
        return;
    }

    emptyState.classList.add('hidden');

    const containerWidth = treeContainer.clientWidth || 800;

    /* Dynamically size container height */
    const treeH = tree.treeHeight();
    const neededHeight = TOP_PADDING + treeH * LEVEL_HEIGHT + 60;
    const containerMinH = Math.max(420, neededHeight);
    treeContainer.style.minHeight = containerMinH + 'px';

    /* Assign coords */
    const positions = assignCoordinates(tree.root, containerWidth);

    /* Collect all current node values */
    const activeValues = new Set(positions.keys());
    removeOrphanedDOMNodes(activeValues);

    /* Draw / update DOM nodes */
    const rotCls = tree.lastRotation !== 'NONE'
        ? `node-${tree.lastRotation.toLowerCase()}`
        : '';

    for (const [value, pos] of positions.entries()) {
        const el = getOrCreateDOMNode(value);
        el.style.left = pos.x + 'px';
        el.style.top = pos.y + 'px';

        /* Update BF badge */
        const nodeObj = findNode(tree.root, value);
        const bf = tree.getBalanceFactor(nodeObj);
        el.querySelector('.bf-badge').textContent = bf;

        /* Highlight rotated nodes */
        el.classList.remove('node-ll', 'node-rr', 'node-lr', 'node-rl');
        if (rotCls && tree.rotatedNodes.has(value)) {
            el.classList.add(rotCls);
        }
    }

    /* Draw SVG edges */
    drawEdges(tree.root, positions);

    /* Update meta pills */
    updateMeta();
}

function findNode(root, value) {
    if (!root) return null;
    if (root.value === value) return root;
    return value < root.value ? findNode(root.left, value) : findNode(root.right, value);
}

/* ---------------------------------------------------------------
   2d. SVG edge drawing
   --------------------------------------------------------------- */

function drawEdges(root, positions) {
    /* Clear previous */
    edgeSvg.innerHTML = '';

    const lines = [];
    (function collect(node) {
        if (!node) return;
        const p = positions.get(node.value);
        if (node.left) {
            const c = positions.get(node.left.value);
            if (p && c) lines.push([p, c]);
            collect(node.left);
        }
        if (node.right) {
            const c = positions.get(node.right.value);
            if (p && c) lines.push([p, c]);
            collect(node.right);
        }
    })(root);

    const nodeR = 26; // half of --node-size

    lines.forEach(([p, c]) => {
        /* Offset line endpoints to circle edges */
        const dx = c.x - p.x;
        const dy = c.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const ux = dx / dist;
        const uy = dy / dist;

        const x1 = p.x + ux * nodeR;
        const y1 = p.y + uy * nodeR;
        const x2 = c.x - ux * nodeR;
        const y2 = c.y - uy * nodeR;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', 'edge-line');
        edgeSvg.appendChild(line);
    });
}

/* ---------------------------------------------------------------
   2e. Rotation banner & log
   --------------------------------------------------------------- */

let bannerTimer = null;

function showRotationBanner(type, insertedValue) {
    const cfg = ROTATION_CONFIG[type] || ROTATION_CONFIG.NONE;

    /* Banner */
    rotationBanner.className = `rotation-banner ${cfg.cls}`;
    rotationIcon.textContent = cfg.icon;
    rotationText.textContent = cfg.label;
    rotationBanner.classList.remove('hidden');

    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => rotationBanner.classList.add('hidden'), 3500);

    /* Log entry */
    const entry = document.createElement('div');
    entry.className = 'log-entry';

    const tag = document.createElement('span');
    tag.className = `log-tag ${cfg.tag}`;
    tag.textContent = type;

    const msg = document.createElement('span');
    msg.className = 'log-msg';
    msg.textContent = `Inserted ${insertedValue} → ${cfg.label}`;

    const now = new Date();
    const time = document.createElement('span');
    time.className = 'log-time';
    time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    entry.appendChild(tag);
    entry.appendChild(msg);
    entry.appendChild(time);

    /* Remove placeholder text */
    const placeholder = rotationLog.querySelector('.log-empty');
    if (placeholder) placeholder.remove();

    /* Prepend so newest is on top */
    rotationLog.insertBefore(entry, rotationLog.firstChild);
}

/* ---------------------------------------------------------------
   2f. Meta pills
   --------------------------------------------------------------- */

function updateMeta() {
    metaNodes.textContent = `Nodes: ${tree.nodeCount()}`;
    metaHeight.textContent = `Height: ${tree.treeHeight()}`;
    metaBF.textContent = `Root BF: ${tree.rootBF()}`;
}

/* ---------------------------------------------------------------
   3.  Event Handlers
   --------------------------------------------------------------- */

function handleInsert() {
    const raw = nodeInput.value.trim();
    if (raw === '') return;

    const val = parseInt(raw, 10);
    if (isNaN(val)) {
        nodeInput.classList.add('shake');
        nodeInput.addEventListener('animationend', () => nodeInput.classList.remove('shake'), { once: true });
        return;
    }

    tree.insert(val);
    nodeInput.value = '';
    nodeInput.focus();

    /* Render first so positions are assigned */
    render();

    /* Show rotation info */
    showRotationBanner(tree.lastRotation, val);
}

insertBtn.addEventListener('click', handleInsert);

nodeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleInsert();
});

resetBtn.addEventListener('click', () => {
    tree.root = null;
    tree.lastRotation = 'NONE';
    tree.rotatedNodes = new Set();
    edgeSvg.innerHTML = '';
    nodeLayer.innerHTML = '';
    domNodes.clear();
    rotationBanner.classList.add('hidden');
    rotationLog.innerHTML = '<p class="log-empty">No rotations yet.</p>';
    updateMeta();
    emptyState.classList.remove('hidden');
    nodeInput.focus();
});

clearLogBtn.addEventListener('click', () => {
    rotationLog.innerHTML = '<p class="log-empty">No rotations yet.</p>';
});

/* Quick-insert demo chips */
document.querySelectorAll('.chip[data-seq]').forEach(chip => {
    chip.addEventListener('click', () => {
        /* Reset first */
        tree.root = null;
        tree.lastRotation = 'NONE';
        tree.rotatedNodes = new Set();
        edgeSvg.innerHTML = '';
        nodeLayer.innerHTML = '';
        domNodes.clear();
        rotationBanner.classList.add('hidden');
        rotationLog.innerHTML = '<p class="log-empty">No rotations yet.</p>';
        emptyState.classList.remove('hidden');

        const values = chip.dataset.seq.split(',').map(Number);
        let delay = 0;

        values.forEach(v => {
            setTimeout(() => {
                tree.insert(v);
                render();
                showRotationBanner(tree.lastRotation, v);
            }, delay);
            delay += 520;
        });
    });
});

/* ---------------------------------------------------------------
   4.  Resize observer – re-render on container size change
   --------------------------------------------------------------- */

const resizeObserver = new ResizeObserver(() => {
    if (tree.root) render();
});
resizeObserver.observe(treeContainer);

/* ---------------------------------------------------------------
   5.  Initial render
   --------------------------------------------------------------- */

render();
nodeInput.focus();
