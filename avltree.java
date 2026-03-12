import java.util.*;
import java.io.*;
import java.util.function.*;

class AVLNode {
    int data;
    int h;
    AVLNode left, right;

    public AVLNode(int data) {
        this.data = data;
        this.h = 1;
    }
}

class Solution {

    AVLNode insert(AVLNode root, int x) {

        if (root == null)
            return new AVLNode(x);

        if (x < root.data) {
            root.left = insert(root.left, x);
        } else {
            root.right = insert(root.right, x);
        }

        updateHeight(root);

        // Right Heavy
        if (getBF(root) == -2) { // RR or RL

            if (getBF(root.right) == -1) { // RR
                root = leftRotate(root);
            } else { // RL
                root.right = rightRotate(root.right);
                root = leftRotate(root);
            }

        }
        // Left Heavy
        else if (getBF(root) == +2) { // LL or LR

            if (getBF(root.left) == +1) { // LL
                root = rightRotate(root);
            } else { // LR
                root.left = leftRotate(root.left);
                root = rightRotate(root);
            }

        }

        return root;
    }

    AVLNode leftRotate(AVLNode root) {

        AVLNode newRoot = root.right;

        root.right = newRoot.left;

        updateHeight(root);

        newRoot.left = root;

        updateHeight(newRoot);

        return newRoot;
    }

    AVLNode rightRotate(AVLNode root) {

        AVLNode newRoot = root.left;

        root.left = newRoot.right;

        updateHeight(root);

        newRoot.right = root;

        updateHeight(newRoot);

        return newRoot;
    }

    void updateHeight(AVLNode root) {

        if (root == null)
            return;

        root.h = 1 + Math.max(
                root.left == null ? 0 : root.left.h,
                root.right == null ? 0 : root.right.h);
    }

    int getBF(AVLNode root) {

        if (root == null)
            return 0;

        return (root.left == null ? 0 : root.left.h)
                -
                (root.right == null ? 0 : root.right.h);
    }

    void preorder(AVLNode root) {

        if (root == null)
            return;

        System.out.print(root.data + " ");

        preorder(root.left);

        preorder(root.right);
    }
}

class Main {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int num = sc.nextInt();

        AVLNode r = null;

        Solution s = new Solution();

        TreePrinter<AVLNode> tp = new TreePrinter<>(n -> "" + n.data, n -> n.left, n -> n.right);

        while (num-- != 0) {

            int x = sc.nextInt();

            r = s.insert(r, x);

            tp.printTree(r);
        }
    }
}

////////////////////////////////////////////////////////////////
// Pretty print binary tree code
////////////////////////////////////////////////////////////////

class TreePrinter<T> {

    private Function<T, String> getLabel;
    private Function<T, T> getLeft;
    private Function<T, T> getRight;

    private PrintStream outStream = System.out;

    private boolean squareBranches = false;
    private boolean lrAgnostic = false;
    private int hspace = 2;
    private int tspace = 1;

    public TreePrinter(Function<T, String> getLabel,
            Function<T, T> getLeft,
            Function<T, T> getRight) {

        this.getLabel = getLabel;
        this.getLeft = getLeft;
        this.getRight = getRight;
    }

    public void printTree(T root) {

        List<TreeLine> treeLines = buildTreeLines(root);

        printTreeLines(treeLines);
    }

    private void printTreeLines(List<TreeLine> treeLines) {

        if (treeLines.size() > 0) {

            int minLeftOffset = minLeftOffset(treeLines);
            int maxRightOffset = maxRightOffset(treeLines);

            for (TreeLine treeLine : treeLines) {

                int leftSpaces = -(minLeftOffset - treeLine.leftOffset);

                int rightSpaces = maxRightOffset - treeLine.rightOffset;

                outStream.println(
                        spaces(leftSpaces)
                                + treeLine.line
                                + spaces(rightSpaces));
            }
        }
    }

    private List<TreeLine> buildTreeLines(T root) {

        if (root == null)
            return Collections.emptyList();

        String rootLabel = getLabel.apply(root);

        List<TreeLine> leftTreeLines = buildTreeLines(getLeft.apply(root));

        List<TreeLine> rightTreeLines = buildTreeLines(getRight.apply(root));

        int leftCount = leftTreeLines.size();
        int rightCount = rightTreeLines.size();

        int minCount = Math.min(leftCount, rightCount);
        int maxCount = Math.max(leftCount, rightCount);

        int maxRootSpacing = 0;

        for (int i = 0; i < minCount; i++) {

            int spacing = leftTreeLines.get(i).rightOffset -
                    rightTreeLines.get(i).leftOffset;

            if (spacing > maxRootSpacing)
                maxRootSpacing = spacing;
        }

        int rootSpacing = maxRootSpacing + hspace;

        if (rootSpacing % 2 == 0)
            rootSpacing++;

        List<TreeLine> allTreeLines = new ArrayList<>();

        allTreeLines.add(
                new TreeLine(
                        rootLabel,
                        -(rootLabel.length() - 1) / 2,
                        rootLabel.length() / 2));

        int leftTreeAdjust = 0;
        int rightTreeAdjust = 0;

        if (leftTreeLines.isEmpty() && !rightTreeLines.isEmpty()) {

            allTreeLines.add(new TreeLine("\\", 1, 1));

            rightTreeAdjust = 2;

        } else if (!leftTreeLines.isEmpty() && rightTreeLines.isEmpty()) {

            allTreeLines.add(new TreeLine("/", -1, -1));

            leftTreeAdjust = -2;

        } else if (!leftTreeLines.isEmpty() && !rightTreeLines.isEmpty()) {

            for (int i = 1; i < rootSpacing; i += 2) {

                String branches = "/" + spaces(i) + "\\";

                allTreeLines.add(
                        new TreeLine(
                                branches,
                                -((i + 1) / 2),
                                (i + 1) / 2));
            }

            rightTreeAdjust = (rootSpacing / 2) + 1;

            leftTreeAdjust = -((rootSpacing / 2) + 1);
        }

        for (int i = 0; i < maxCount; i++) {

            if (i >= leftTreeLines.size()) {

                TreeLine rightLine = rightTreeLines.get(i);

                rightLine.leftOffset += rightTreeAdjust;

                rightLine.rightOffset += rightTreeAdjust;

                allTreeLines.add(rightLine);

            } else if (i >= rightTreeLines.size()) {

                TreeLine leftLine = leftTreeLines.get(i);

                leftLine.leftOffset += leftTreeAdjust;

                leftLine.rightOffset += leftTreeAdjust;

                allTreeLines.add(leftLine);

            } else {

                TreeLine leftLine = leftTreeLines.get(i);
                TreeLine rightLine = rightTreeLines.get(i);

                int adjustedSpacing = rootSpacing;

                TreeLine combined = new TreeLine(

                        leftLine.line +
                                spaces(adjustedSpacing -
                                        leftLine.rightOffset +
                                        rightLine.leftOffset)
                                +
                                rightLine.line,

                        leftLine.leftOffset + leftTreeAdjust,

                        rightLine.rightOffset + rightTreeAdjust);

                allTreeLines.add(combined);
            }
        }

        return allTreeLines;
    }

    private static int minLeftOffset(List<TreeLine> treeLines) {

        return treeLines.stream()
                .mapToInt(l -> l.leftOffset)
                .min()
                .orElse(0);
    }

    private static int maxRightOffset(List<TreeLine> treeLines) {

        return treeLines.stream()
                .mapToInt(l -> l.rightOffset)
                .max()
                .orElse(0);
    }

    private static String spaces(int n) {

        return String.join("", Collections.nCopies(n, " "));
    }

    private static class TreeLine {

        String line;

        int leftOffset;

        int rightOffset;

        TreeLine(String line, int leftOffset, int rightOffset) {

            this.line = line;

            this.leftOffset = leftOffset;

            this.rightOffset = rightOffset;
        }
    }
}