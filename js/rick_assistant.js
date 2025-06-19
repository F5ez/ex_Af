document.addEventListener('DOMContentLoaded', () => {
    const panel       = document.querySelector('.assistant_wrap_text');
    const arrowWrap   = document.querySelector('.assistant_wrap');
    const arrowImg    = document.querySelector('.as_img');
    const menuBtn     = document.getElementById('menu_text');
    const textBlock   = document.querySelector('.as_rick_text');
    const counterElem = document.querySelector('.rick_arr_count');
    const rickImg     = document.querySelector('.as_rick_img img');

    // Локальные тексты для стека
    const text_index = window.rickTextIndex || [
        "Дефолтный текст, если ничего не задано"
    ];

    const rick_images = [
        "assets/rick/rick2.png",
        "assets/rick/rick3.png",
        "assets/rick/rick4.png",
        "assets/rick/rick5.png",
        "assets/rick/rick_smile.png"
    ];

    let opened = true;
    let currentIndex = 0;
    let typeInterval = null;

    function typeText(el, txt, speed = 5) {
        if (typeInterval) clearInterval(typeInterval);
        el.textContent = '';
        let i = 0;
        typeInterval = setInterval(() => {
            el.textContent += txt[i++];
            if (i >= txt.length) clearInterval(typeInterval);
        }, speed);
    }

    function refreshUI() {
        const content = text_index[currentIndex];
        if (typeof content === 'string' && !content.includes('<form')) {
            typeText(textBlock, content);
        } else {
            clearInterval(typeInterval);
            textBlock.innerHTML = content;
        }
        counterElem.textContent = `${currentIndex + 1}\\${text_index.length}`;
        rickImg.src = rick_images[currentIndex % rick_images.length];
    }

    const openPanel = () => {
        panel.style.display = 'flex';
        arrowWrap.style.display = 'flex';
        panel.style.marginLeft = '0';
        arrowWrap.style.marginLeft = '800px';
        arrowImg.style.transform = 'rotate(180deg)';
        opened = true;
    };

    const closePanel = () => {
        panel.style.display = 'none';
        arrowWrap.style.display = 'none';
        opened = false;
        currentIndex = 0;
        refreshUI();
    };

    arrowWrap.addEventListener('click', () => {
        if (opened) {
            closePanel();
        } else {
            openPanel();
        }
    });

    menuBtn.addEventListener('click', () => {
        if (currentIndex < text_index.length - 1) {
            currentIndex++;
            refreshUI();
        }
    });

    openPanel();
    refreshUI();
});
