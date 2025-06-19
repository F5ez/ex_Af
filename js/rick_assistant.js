// Запуск кода после полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {

    // Получение элементов интерфейса помощника
    const panel       = document.querySelector('.assistant_wrap_text');        // Панель текста
    const arrowWrap   = document.querySelector('.assistant_wrap');             // Обёртка стрелки
    const arrowImg    = document.querySelector('.as_img');                     // Иконка стрелки
    const menuBtn     = document.getElementById('menu_text');                  // Кнопка перелистывания текста
    const textBlock   = document.querySelector('.as_rick_text');               // Сам текст
    const counterElem = document.querySelector('.rick_arr_count');             // Счётчик сообщений
    const rickImg     = document.querySelector('.as_rick_img img');            // Изображение Рика

    // Получение текстов из глобальной переменной или дефолтного массива
    const text_index = window.rickTextIndex || [
        "Дефолтный текст, если ничего не задано"
    ];

    // Список изображений для ротации
    const rick_images = [
        "assets/rick/rick2.png",
        "assets/rick/rick3.png",
        "assets/rick/rick4.png",
        "assets/rick/rick5.png",
        "assets/rick/rick_smile.png"
    ];

    // Состояния
    let opened = true;           // Открыта ли панель по умолчанию
    let currentIndex = 0;        // Индекс текущего текста
    let typeInterval = null;     // Таймер печати текста

    // Функция для печати текста по символам
    function typeText(el, txt, speed = 5) {
        if (typeInterval) clearInterval(typeInterval);
        el.textContent = '';
        let i = 0;
        typeInterval = setInterval(() => {
            el.textContent += txt[i++];
            if (i >= txt.length) clearInterval(typeInterval);
        }, speed);
    }

    // Обновление содержимого и счётчиков
    function refreshUI() {
        const content = text_index[currentIndex];

        // Если обычный текст
        if (typeof content === 'string' && !content.includes('<form')) {
            typeText(textBlock, content);
        } else {
            // HTML-строка — вставляем как есть
            clearInterval(typeInterval);
            textBlock.innerHTML = content;
        }

        // Обновляем счётчик и изображение
        counterElem.textContent = `${currentIndex + 1}\\${text_index.length}`;
        rickImg.src = rick_images[currentIndex % rick_images.length];
    }

    // Открытие панели
    const openPanel = () => {
        panel.style.display = 'flex';
        arrowWrap.style.display = 'flex';
        panel.style.marginLeft = '0';
        arrowWrap.style.marginLeft = '800px';
        arrowImg.style.transform = 'rotate(180deg)';
        opened = true;
    };

    // Закрытие панели
    const closePanel = () => {
        panel.style.display = 'none';
        arrowWrap.style.display = 'none';
        opened = false;
        currentIndex = 0;
        refreshUI(); // Сброс к первому сообщению
    };

    // Клик по стрелке — открытие/закрытие
    arrowWrap.addEventListener('click', () => {
        if (opened) {
            closePanel();
        } else {
            openPanel();
        }
    });

    // Клик по кнопке навигации — вперёд по тексту
    menuBtn.addEventListener('click', () => {
        if (currentIndex < text_index.length - 1) {
            currentIndex++;
            refreshUI();
        }
    });

    // Инициализация панели
    openPanel();    // По умолчанию открыта
    refreshUI();    // Загружаем первый текст
});
