class TreeNode {
    constructor(value, level = 0, x = 0, z = 0) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.level = level;
        this.x = x;
        this.z = z;
    }
}

class BinaryTree {
    constructor() {
        this.root = null;
        this.container = document.getElementById('treeContainer');
        this.maxDepth = 4;
    }

    insert(value) {
        if (!this.root) {
            this.root = new TreeNode(value, 0, 0, 0);
            this.createNodeEntity(this.root);
        } else {
            this.insertNode(this.root, value, 0);
        }
    }

    insertNode(node, value, level) {
        if (level >= this.maxDepth - 1) {
            console.warn("Достигнута максимальная глубина дерева");
            return;
        }

        const baseSpread = 45;
        const minSpread = 5;
        const spread = Math.max(baseSpread / Math.pow(2, level + 1), minSpread);

        if (value < node.value) {
            if (!node.left) {
                const offsetX = node.x - spread;
                const offsetZ = offsetX * 0.2;
                const newNode = new TreeNode(value, level + 1, offsetX, offsetZ);
                node.left = newNode;
                this.createNodeEntity(newNode, node);
            } else {
                this.insertNode(node.left, value, level + 1);
            }
        } else {
            if (!node.right) {
                const offsetX = node.x + spread;
                const offsetZ = offsetX * 0.2;
                const newNode = new TreeNode(value, level + 1, offsetX, offsetZ);
                node.right = newNode;
                this.createNodeEntity(newNode, node);
            } else {
                this.insertNode(node.right, value, level + 1);
            }
        }
    }

    createNodeEntity(node, parentNode = null) {
        const verticalStep = 10;
        const modelYOffset = 15;
        const targetY = node.level * verticalStep + modelYOffset;

        if (!parentNode) {
            // Корень — создаём сразу
            this.spawnCrystal(node.x, targetY, node.z, node.value);
        } else {
            // Дочерние — с анимацией
            this.animateConnection(parentNode, node);
        }
    }

    animateConnection(parent, child) {
        const verticalStep = 10;
        const modelYOffset = 15;

        const parentY = parent.level * verticalStep + modelYOffset;
        const childY = child.level * verticalStep + modelYOffset;

        const start = new THREE.Vector3(parent.x, parentY, parent.z);
        const end = new THREE.Vector3(child.x, childY, child.z);
        const direction = new THREE.Vector3().subVectors(end, start);
        const distance = direction.length();
        const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

        const entity = document.createElement('a-entity');
        entity.setAttribute('geometry', `primitive: cylinder; radius: 0.1; height: ${distance}`);
        entity.setAttribute('material', 'color: red');
        entity.setAttribute('position', `${midpoint.x} ${midpoint.y} ${midpoint.z}`);
        entity.setAttribute('scale', `1 0 1`);

        const rotation = this.getRotationBetween(start, end);
        entity.setAttribute('rotation', rotation);

        this.container.appendChild(entity);

        // Анимация вытягивания цилиндра
        entity.setAttribute('animation', {
            property: 'scale',
            to: `0.6 0.6 0.6`,
            dur: 300,
            easing: 'easeOutQuad'
        });

        entity.addEventListener('animationcomplete', () => {
            const verticalStep = 10;
            const modelYOffset = 15;
            const childY = child.level * verticalStep + modelYOffset;

            this.spawnCrystal(child.x, childY, child.z, child.value);
        });
    }

    spawnCrystal(x, y, z, value) {
        const model = document.createElement('a-entity');
        model.setAttribute('gltf-model', 'assets/models/crystal.glb');
        model.setAttribute('scale', '15 15 15');
        model.setAttribute('rotation', '0 0 0');
        model.setAttribute('position', `${x} ${y} ${z}`);
        this.container.appendChild(model);
        model.setAttribute('animation', {
            property: 'rotation',
            to: '0 360 360',
            dur: 10000,
            easing: 'linear',
            loop: true
        });

        const text = document.createElement('a-text');
        text.setAttribute('value', value);
        text.setAttribute('color', '#630202');
        text.setAttribute('align', 'center');
        text.setAttribute('position', `${x} ${y + 3} ${z}`);
        text.setAttribute('scale', '6 6 6');
        this.container.appendChild(text);
    }

    getRotationBetween(start, end) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const dz = end.z - start.z;

        const yaw = Math.atan2(dx, dz) * 180 / Math.PI;
        const pitch = Math.atan2(Math.sqrt(dx * dx + dz * dz), dy) * 180 / Math.PI;

        return `${pitch} ${yaw} 0`;
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
