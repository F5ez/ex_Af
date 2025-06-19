// Класс узла бинарного дерева
class TreeNode {
    constructor(value, level = 0, x = 0, z = 0) {
        this.value = value;   // Значение узла
        this.left = null;     // Левый потомок
        this.right = null;    // Правый потомок
        this.level = level;   // Уровень (глубина) узла
        this.x = x;           // Позиция X для отображения
        this.z = z;           // Позиция Z для отображения
    }
}

// Класс бинарного дерева
class BinaryTree {
    constructor() {
        this.root = null; // Корень дерева
        this.container = document.getElementById('treeContainer'); // DOM-контейнер для сцены
        this.maxDepth = 4; // Максимальная глубина дерева
    }

    // Вставка значения в дерево
    insert(value) {
        if (!this.root) {
            this.root = new TreeNode(value, 0, 0, 0); // Корень
            this.createNodeEntity(this.root);
        } else {
            this.insertNode(this.root, value, 0); // Рекурсивная вставка
        }
    }

    // Рекурсивная вставка в дерево
    insertNode(node, value, level) {
        if (level >= this.maxDepth - 1) {
            console.warn("Достигнута максимальная глубина дерева");
            return;
        }

        const baseSpread = 45;  // Базовое смещение по X
        const minSpread = 5;    // Минимальное смещение
        const spread = Math.max(baseSpread / Math.pow(2, level + 1), minSpread); // Расчёт ширины

        if (value < node.value) {
            // Вставка в левое поддерево
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
            // Вставка в правое поддерево
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

    // Создание 3D узла (кристалл) и связей
    createNodeEntity(node, parentNode = null) {
        const verticalStep = 10;      // Расстояние между уровнями
        const modelYOffset = 15;      // Смещение модели по Y
        const targetY = node.level * verticalStep + modelYOffset;

        if (!parentNode) {
            // Если это корень — просто создаем кристалл
            this.spawnCrystal(node.x, targetY, node.z, node.value);
        } else {
            // Если есть родитель — создаем анимацию связи
            this.animateConnection(parentNode, node);
        }
    }

    // Анимация цилиндра между родителем и потомком
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

        // Установка ориентации цилиндра
        const rotation = this.getRotationBetween(start, end);
        entity.setAttribute('rotation', rotation);

        this.container.appendChild(entity);

        // Анимация масштабирования (вытягивания)
        entity.setAttribute('animation', {
            property: 'scale',
            to: `0.6 0.6 0.6`,
            dur: 300,
            easing: 'easeOutQuad'
        });

        // После окончания — создаем кристалл
        entity.addEventListener('animationcomplete', () => {
            const verticalStep = 10;
            const modelYOffset = 15;
            const childY = child.level * verticalStep + modelYOffset;

            this.spawnCrystal(child.x, childY, child.z, child.value);
        });
    }

    // Создание модели кристалла и текста
    spawnCrystal(x, y, z, value) {
        const model = document.createElement('a-entity');
        model.setAttribute('gltf-model', 'assets/models/crystal.glb');
        model.setAttribute('scale', '15 15 15');
        model.setAttribute('rotation', '0 0 0');
        model.setAttribute('position', `${x} ${y} ${z}`);
        this.container.appendChild(model);

        // Анимация вращения кристалла
        model.setAttribute('animation', {
            property: 'rotation',
            to: '0 360 360',
            dur: 10000,
            easing: 'linear',
            loop: true
        });

        // Текст с числом
        const text = document.createElement('a-text');
        text.setAttribute('value', value);
        text.setAttribute('color', '#630202');
        text.setAttribute('align', 'center');
        text.setAttribute('position', `${x} ${y + 3} ${z}`);
        text.setAttribute('scale', '6 6 6');
        this.container.appendChild(text);
    }

    // Вычисление поворота цилиндра между двумя точками
    getRotationBetween(start, end) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const dz = end.z - start.z;

        const yaw = Math.atan2(dx, dz) * 180 / Math.PI;
        const pitch = Math.atan2(Math.sqrt(dx * dx + dz * dz), dy) * 180 / Math.PI;

        return `${pitch} ${yaw} 0`;
    }
}

// Создание экземпляра дерева
const tree = new BinaryTree();

// Обработка кнопки вставки значения
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('insertBtn').addEventListener('click', () => {
        const valueInput = document.getElementById('valueInput');
        const value = parseInt(valueInput.value);
        if (!isNaN(value)) {
            tree.insert(value); // Вставка значения
            valueInput.value = ''; // Очистка поля
        }
    });
});
