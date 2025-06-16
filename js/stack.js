let stack = [];
let stackEntity;

window.onload = function() {
    stackEntity = document.querySelector('#stack');
};

// Скейлы
const modelConfigs = [
    { id: '#model2', scale: '0.8 0.8 0.8' },
    { id: '#model3', scale: '6 6 6' },
    { id: '#model4', scale: '6 6 6' },
    { id: '#model5', scale: '1.5 1.5 1.5' }
];

let modelIndex = 0;

function pushStack() {
    if (stack.length >= 9) {
        return;
    }

    const index = stack.length;
    const yPos = index * 1.05 + 0.4;

    const config = modelConfigs[modelIndex];

    const model = document.createElement('a-entity');
    model.setAttribute('gltf-model', config.id);
    model.setAttribute('position', `0 ${yPos - 3} 0`);
    model.setAttribute('scale', config.scale);
    model.setAttribute('shadow', 'cast: true; receive: false');

    const randomRotation = Math.random() * 20-5;
    model.setAttribute('rotation', `0 ${randomRotation} 0`);

    model.setAttribute('animation', `
        property: position;
        to: 0 ${yPos} 0;
        dur: 1000;
        easing: easeOutElastic
    `);

    stackEntity.appendChild(model);
    stack.push(model);

    modelIndex = (modelIndex + 1) % modelConfigs.length;
}


function popStack() {
    if (stack.length === 0) return;

    const model = stack.pop();

    const startX = model.object3D.position.x;
    const startY = model.object3D.position.y;
    const startZ = model.object3D.position.z;

    const offsetX = 1.5;  // фиксированный сдвиг вбок
    const portalX = 3;    // центр портала
    const portalY = 0.05; // высота портала

    // 1️⃣ Сдвиг вбок
    model.setAttribute('animation__slide', {
        property: 'position',
        to: `${startX + offsetX} ${startY} ${startZ}`,
        dur: 500,
        easing: 'easeInOutSine'
    });

    // 2️⃣ Перелёт в портал
    setTimeout(() => {
        model.setAttribute('animation__move', {
            property: 'position',
            to: `${portalX} ${portalY} ${startZ}`,
            dur: 600,
            easing: 'easeInOutCubic'
        });
    }, 500);

    // 3️⃣ Удаляем сразу после попадания
    setTimeout(() => {
        stackEntity.removeChild(model);
    }, 1100);
}
