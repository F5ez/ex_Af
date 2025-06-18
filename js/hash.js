let usedPositions = [];
let isAnimating = false;

class HashTable {
    constructor(size) {
        this.size = size;
        this.buckets = new Array(size).fill(null).map(() => []);
        this.container = document.getElementById('hashContainer');
    }

    hash(value) {
        return value % this.size;
    }

    insert(value) {
        const index = this.hash(value);
        const bucket = this.buckets[index];
        bucket.push(value);
        this.createVisualElement(value, index, bucket.length - 1);
    }

    createVisualElement(value, index, depth) {
        isAnimating = true;
        const models = [
            { model: '#carModel1', rotation: '0 -90 -90', scale: '1 1 1' },
            { model: '#carModel2', rotation: '0 90 90', scale: '1.5 1.5 1.5' },
            { model: '#carModel3', rotation: '0 -90 -90', scale: '0.008 0.008 0.008' }
        ];

        const randomItem = models[Math.floor(Math.random() * models.length)];
        const car = document.createElement('a-entity');
        car.setAttribute('gltf-model', randomItem.model);
        car.setAttribute('rotation', randomItem.rotation);
        car.setAttribute('position', `0 0 0`);
        this.container.appendChild(car);

        const baseX = -40;
        const preX = baseX + 30;
        const targetY = 20 - (index * 5);
        const targetX = baseX + (depth * 5);
        const targetZ = 0;

        car.addEventListener('model-loaded', () => {
            car.setAttribute('scale', randomItem.scale);

            car.setAttribute('animation__move1', {
                property: 'position',
                to: `${preX} 0 0`,
                dur: 1500,
                easing: 'easeInOutSine'
            });

            setTimeout(() => {
                car.setAttribute('animation__move2', {
                    property: 'position',
                    to: `${preX} ${targetY} ${targetZ}`,
                    dur: 500,
                    easing: 'easeInOutSine'
                });
            }, 1500);

            setTimeout(() => {
                car.setAttribute('animation__move3', {
                    property: 'position',
                    to: `${targetX - 15} ${targetY} ${targetZ}`,
                    dur: 500,
                    easing: 'easeInOutSine'
                });
            }, 2000);

            setTimeout(() => {
                car.parentNode.removeChild(car);
                isAnimating = false;
            }, 2500);
        });
    }
}

let usedPositionsX0 = [];
let usedPositionsX8 = [];
const maxCars = 8;

function spawnCarFromX(xPos, usedPositions) {
    if (usedPositions.length >= maxCars) return;

    const models = [
        { model: '#carModel1', rotation: '90 90 90', scale: '1 1 1' },
        { model: '#carModel2', rotation: '270 90 90', scale: '1.5 1.5 1.5' },
        { model: '#carModel3', rotation: '90 90 90', scale: '0.008 0.008 0.008' }
    ];

    const randomItem = models[Math.floor(Math.random() * models.length)];
    const container = document.getElementById('sceneContainer');

    const car = document.createElement('a-entity');
    car.setAttribute('gltf-model', randomItem.model);
    car.setAttribute('rotation', randomItem.rotation);
    car.setAttribute('position', `${xPos} 30 0`);
    car.setAttribute('shadow', 'cast: true');

    car.addEventListener('model-loaded', () => {
        car.setAttribute('scale', randomItem.scale);
    });

    container.appendChild(car);

    const duration = Math.floor(Math.random() * 2000) + 2000;

    car.setAttribute('animation__move', {
        property: 'position',
        to: `${xPos} -30 0`,
        dur: duration,
        easing: 'linear'
    });

    usedPositions.push(car);

    setTimeout(() => {
        usedPositions.splice(usedPositions.indexOf(car), 1);
        car.remove();
    }, duration + 500);
}

// Спавнеры
setInterval(() => spawnCarFromX(0, usedPositionsX0), 2500);  // слева
setInterval(() => spawnCarFromX(8, usedPositionsX8), 3500);  // справа





const tableSize = 8;
const hashTable = new HashTable(tableSize);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('insertBtn').addEventListener('click', () => {
        const valueInput = document.getElementById('valueInput');
        const value = parseInt(valueInput.value);
        if (!isNaN(value)) {
            hashTable.insert(value);
            valueInput.value = '';
        }
    });

    // Запуск генерации машин

});