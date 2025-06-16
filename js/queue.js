class Queue {
    constructor(maxSize) {
        this.items = [];
        this.maxSize = maxSize;
    }

    enqueue(element) {
        if (this.items.length >= this.maxSize) {
            return;
        }
        this.items.push(element);
    }

    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }

    getItems() {
        return this.items;
    }
}

const queue = new Queue(8);
const queueContainer = document.getElementById('queueContainer');
let counter = 1;
let isAnimating = false;

function addSheep(index) {
    const sheep = document.createElement('a-entity');
    sheep.setAttribute('gltf-model', '#sheepModel');
    sheep.setAttribute('scale', '3 3 3');
    sheep.setAttribute('rotation', '0 -90 0');

    const startX = (Math.random() - 0.5) * 8;
    const startZ = -50 + (Math.random() - 0.5) ;

    sheep.setAttribute('position', `${startX} 1 ${startZ}`);
    queueContainer.appendChild(sheep);

    // Важно! Ждём полной загрузки модели
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




function enqueue() {
    if (isAnimating) return;

    if (queue.getItems().length >= queue.maxSize) {
        return;
    }

    queue.enqueue("Sheep " + counter);
    addSheep(queue.getItems().length - 1);
    counter++;
}


function dequeue() {
    if (isAnimating || queue.isEmpty()) return;

    isAnimating = true;

    const firstSheep = queueContainer.children[0];
    const currentPos = firstSheep.getAttribute('position');
    const x = currentPos.x;

    // Этап 1 — прыжок через забор
    firstSheep.setAttribute('animation__jump', {
        property: 'rotation',
        to: `0 30 0`,
        dur: 200,
        easing: 'linear'
    });

    // разворот
    setTimeout(() => {
        firstSheep.setAttribute('animation__leave', {
            property: 'position',
            to: `${x} 0 30`,
            dur: 300,
            easing: 'easeInQuad'
        });
    }, 0);

    // Полное удаление после всех анимаций
    setTimeout(() => {
        queue.dequeue();
        queueContainer.removeChild(firstSheep);
        isAnimating = false;
        repositionSheep();
    }, 500);
}


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

            // Немного случайности внутри ячейки
            const offsetX = (Math.random() - 0.5) * 3;
            const offsetZ = (Math.random() - 0.5) * 2;

            const posX = startX + col * spacingX + offsetX;
            const posZ = startZ - row * spacingZ + offsetZ;

            sheep.setAttribute('position', `${posX} 1 ${posZ}`);

            const rotationY = -20 - Math.random() * 50;
            sheep.setAttribute('rotation', `0 ${rotationY} 0`);

            crowdContainer.appendChild(sheep);
            i++;
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('enqueueBtn').addEventListener('click', enqueue);
    document.getElementById('dequeueBtn').addEventListener('click', dequeue);
    generateSheepCrowd(45);

});
