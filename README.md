AVL Tree Visualizer

A fully interactive, browser-based visualization of an AVL (Adelson-Velsky and Landis) Self-Balancing Binary Search Tree, built with pure HTML, CSS, and Vanilla JavaScript — no frameworks required.

📖 Project Overview

This project lets you insert numbers one at a time and watch the AVL tree rebalance itself in real time. Each node is rendered as an animated circle, edges are drawn with SVG, and a banner + scrollable log tells you exactly which rotation occurred (LL, RR, LR, or RL) and why.

Key features:

Live animated tree with smooth CSS transitions

Color-coded rotation highlighting

Balance factor badge on every node

Timestamped rotation log

One-click demo sequences (LL, RR, LR, RL, Balanced)

Fully responsive layout

⏱ Time Complexity of BST Operations
Operation Average Case Worst Case (Unbalanced)
Search O(log n) O(n)
Insert O(log n) O(n)
Delete O(log n) O(n)
Traversal O(n) O(n)

A standard (unbalanced) BST can degrade into a linked list when elements are inserted in sorted order, causing operations to become O(n) instead of O(log n).

⚖️ Why a Balanced BST is Needed

If values are inserted in sorted order into a normal BST:

Insert: 10 → 20 → 30 → 40 → 50

BST structure:
10
\
 20
\
 30
\
 40
\
 50

The height of the tree becomes n, and operations degrade to O(n).

Balanced trees fix this problem by automatically restructuring themselves to keep height O(log n).

🌲 Introduction to AVL Trees

An AVL Tree is a self-balancing Binary Search Tree where the difference in height between the left and right subtree of any node is at most 1.

Properties:

Maintains standard BST ordering

Automatically balances after insertion

Tree height remains O(log n)

Guarantees O(log n) search, insert, and delete operations

📐 Detecting Imbalance: Balance Factor

The Balance Factor (BF) of a node is defined as:

BF(node) = height(left subtree) − height(right subtree)
Balance Factor Meaning
-1, 0, 1 Balanced
+2 Left heavy
-2 Right heavy

When the absolute value of BF becomes greater than 1, the tree must perform rotations to restore balance.

🔄 The Four Rotation Cases
LL Rotation (Left-Left)

Condition:
The new node is inserted into the left subtree of the left child.

Fix:
Perform a Right Rotation.

    z

/
y
/
x

After rotation:

    y

/ \
 x z
RR Rotation (Right-Right)

Condition:
The new node is inserted into the right subtree of the right child.

Fix:
Perform a Left Rotation.

z
\
 y
\
 x

After rotation:

    y

/ \
 z x
LR Rotation (Left-Right)

Condition:
The new node is inserted into the right subtree of the left child.

Fix:

Left rotation on left child

Right rotation on root

RL Rotation (Right-Left)

Condition:
The new node is inserted into the left subtree of the right child.

Fix:

Right rotation on right child

Left rotation on root

⚔️ AVL Trees vs Red-Black Trees
Feature AVL Tree Red-Black Tree
Balance Strictly balanced Loosely balanced
Height Smaller Slightly larger
Search Faster Slightly slower
Insert/Delete More rotations Fewer rotations
Storage Stores height Stores color
Best Use Read-heavy workloads Write-heavy workloads

Examples:

AVL Trees: Databases, memory indexing

Red-Black Trees: Linux kernel, C++ STL map

🛠 Technologies Used
Technology Purpose
HTML5 Page structure
CSS3 Styling and animations
JavaScript (ES6) AVL logic and visualization
SVG Drawing tree edges
Google Fonts UI typography
📁 Project Structure
avl_tree/
├── index.html # Main UI page
├── style.css # Styling and layout
├── avl.js # AVL Tree logic + visualization
├── avltree.java # Reference AVL implementation
└── README.md
📝 License

This project is open source and available under the MIT License.
