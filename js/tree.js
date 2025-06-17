class TreeNode {
    constructor(value, level = 0, x = 0) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.level = level;
        this.x = x;
    }
}

class BinaryTree {
    constructor() {
        this.root = null;
        this.container = document.getElementById('treeContainer');
    }

    insert(value) {
        if (!this.root) {
            this.root = new TreeNode(value, 0, 0);
            this.createNodeEntity(this.root);
        } else {
            this.insertNode(this.root, value, 0);
        }
    }

    insertNode(node, value, level) {
        const baseSpread = 40; // ширина дерева

        const spread = baseSpread / Math.pow(2, level + 1); // уменьшаем разлёт по уровням

        if (value < node.value) {
            if (!node.left) {
                const offsetX = node.x - spread;
                const newNode = new TreeNode(value, level + 1, offsetX);
                node.left = newNode;
                this.createNodeEntity(newNode, node);
            } else {
                this.insertNode(node.left, value, level + 1);
            }
        } else {
            if (!node.right) {
                const offsetX = node.x + spread;
                const newNode = new TreeNode(value, level + 1, offsetX);
                node.right = newNode;
                this.createNodeEntity(newNode, node);
            } else {
                this.insertNode(node.right, value, level + 1);
            }
        }
    }

    createNodeEntity(node, parentNode = null) {
        const sphere = document.createElement('a-sphere');
        sphere.setAttribute('radius', '1');
        sphere.setAttribute('color', '#4CAF50');

        const verticalStep = 5;
        const targetY = 20 - node.level * verticalStep;

        sphere.setAttribute('position', `${node.x} ${targetY + 10} 0`);

        sphere.setAttribute('animation', {
            property: 'position',
            to: `${node.x} ${targetY} 0`,
            dur: 1000,
            easing: 'easeOutBounce'
        });

        this.container.appendChild(sphere);

        if (parentNode) {
            sphere.addEventListener('animationcomplete', () => {
                this.drawEdge(parentNode, node);
            });
        }
    }

    drawEdge(parent, child) {
        const verticalStep = 5;

        const parentY = 20 - parent.level * verticalStep;
        const childY = 20 - child.level * verticalStep;

        const line = document.createElement('a-entity');
        line.setAttribute('line', {
            start: `${parent.x} ${parentY} 0`,
            end: `${child.x} ${childY} 0`,
            color: '#000'
        });
        this.container.appendChild(line);
    }
}

const tree = new BinaryTree();

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('insertBtn').addEventListener('click', () => {
        const valueInput = document.getElementById('valueInput');
        const value = parseInt(valueInput.value);
        if (!isNaN(value)) {
            tree.insert(value);
            valueInput.value = '';
        }
    });
});
