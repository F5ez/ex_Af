// Класс для управления очередью
class Queue {
    constructor(maxSize) {
        this.items = [];           // Хранилище элементов
        this.maxSize = maxSize;    // Максимальный размер очереди
    }

    // Добавление элемента в очередь
    enqueue(element) {
        if (this.items.length >= this.maxSize) {
            return; // Не добавляем, если достигнут лимит
        }
        this.items.push(element); // Добавление в конец
    }

    // Удаление элемента из очереди
    dequeue() {
        if (this.isEmpty()) {
            return null; // Если очередь пуста — ничего не делаем
        }
        return this.items.shift(); // Удаляем первый элемент
    }

    // Проверка, пуста ли очередь
    isEmpty() {
        return this.items.length === 0;
    }

    // Получение текущих элементов
    getItems() {
        return this.items;
    }
}

// Создание экземпляра очереди с максимумом 8 элементов
const queue = new Queue(8);

// DOM-элемент, в который добавляются овцы
const queueContainer = document.getElementById('queueContainer');

let counter = 1;          // Счётчик овец
let isAnimating = false; // Флаг анимации

// Добавление овцы в очередь визуально
function addSheep(index) {
    const sheep = document.createElement('a-entity');
    sheep.setAttribute('gltf-model', '#sheepModel');
    sheep.setAttribute('scale', '3 3 3');
    sheep.setAttribute('rotation', '0 -90 0');

    // Начальная позиция овцы (случайная X и Z)
    const startX = (Math.random() - 0.5) * 8;
    const startZ = -50 + (Math.random() - 0.5);

    sheep.setAttribute('position', `${startX} 1 ${startZ}`);
    queueContainer.appendChild(sheep);

    // После загрузки модели задаем анимации движения и покачивания
    sheep.addEventListener('model-loaded', () => {
        sheep.setAttribute('animation__move', {
            property: 'position',
            from: `${startX} 1 ${startZ}`,
            to: `${(index - 3) * 5} 0 5`,
            dur: 600,
            easing: 'linear'
        });

        const duration = Math.floor(Math.random() * 3000) + 1000;
        const angle = Math.random() < 0.5 ? -80 : -100;

        sheep.setAttribute('animation__rotate', {
            property: 'rotation',
            dir: 'alternate',
            dur: duration,
            easing: 'easeInOutSine',
            loop: true,
            to: `0 ${angle} 0`
        });
    });
}

// Обработка добавления овцы по кнопке
function enqueue() {
    if (isAnimating) return;

    if (queue.getItems().length >= queue.maxSize) {
        return; // Превышен лимит очереди
    }

    queue.enqueue("Sheep " + counter); // Добавляем в очередь
    addSheep(queue.getItems().length - 1); // Добавляем в сцену
    counter++;
}

// Обработка выпуска овцы из очереди
function dequeue() {
    if (isAnimating || queue.isEmpty()) return;

    isAnimating = true;

    const firstSheep = queueContainer.children[0];
    const currentPos = firstSheep.getAttribute('position');
    const x = currentPos.x;

    // Анимация поворота/прыжка
    firstSheep.setAttribute('animation__jump', {
        property: 'rotation',
        to: `0 30 0`,
        dur: 200,
        easing: 'linear'
    });

    // Анимация выхода вперёд
    setTimeout(() => {
        firstSheep.setAttribute('animation__leave', {
            property: 'position',
            to: `${x} 0 30`,
            dur: 300,
            easing: 'easeInQuad'
        });
    }, 0);

    // Удаление из DOM и обновление очереди
    setTimeout(() => {
        queue.dequeue();
        queueContainer.removeChild(firstSheep);
        isAnimating = false;
        repositionSheep(); // Обновление позиций оставшихся овец
    }, 500);
}

// Перемещение оставшихся овец на новые позиции
function repositionSheep() {
    const items = queueContainer.children;
    for (let i = 0; i < items.length; i++) {
        items[i].setAttribute('animation', {
            property: 'position',
            to: `${(i - 3) * 5} 0 5`,
            dur: 300,
            easing: 'easeOutQuad'
        });
    }
}

// Генерация толпы овец вне очереди (фоновая сцена)
function generateSheepCrowd(count) {
    const crowdContainer = document.getElementById('crowdContainer');
    const rows = 9;
    const cols = 10;
    const spacingX = 4;
    const spacingZ = 4;
    const startX = -((cols - 1) * spacingX) / 2;
    const startZ = -50;

    let i = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (i >= count) break;

            const sheep = document.createElement('a-entity');
            sheep.setAttribute('gltf-model', '#sheepModel');
            sheep.setAttribute('scale', '3 3 3');

            // Случайное смещение внутри клетки
            const offsetX = (Math.random() - 0.5) * 3;
            const offsetZ = (Math.random() - 0.5) * 2;

            const posX = startX + col * spacingX + offsetX;
            const posZ = startZ - row * spacingZ + offsetZ;

            sheep.setAttribute('position', `${posX} 1 ${posZ}`);

            // Случайный поворот овцы
            const rotationY = -20 - Math.random() * 50;
            sheep.setAttribute('rotation', `0 ${rotationY} 0`);

            crowdContainer.appendChild(sheep);
            i++;
        }
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('enqueueBtn').addEventListener('click', enqueue);   // Кнопка добавить
    document.getElementById('dequeueBtn').addEventListener('click', dequeue);   // Кнопка выпустить
    generateSheepCrowd(45); // Генерация фоновой толпы
});
