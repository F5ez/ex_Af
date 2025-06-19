document.addEventListener('DOMContentLoaded', () => {
    const panel       = document.querySelector('.assistant_wrap_text');
    const arrowWrap   = document.querySelector('.assistant_wrap');
    const arrowImg    = document.querySelector('.as_img');
    const menuBtn     = document.getElementById('menu_text');
    const textBlock   = document.querySelector('.as_rick_text');
    const counterElem = document.querySelector('.rick_arr_count');
    const rickImg     = document.querySelector('.as_rick_img img');

    const text_index = [
        "Эй, ты! Да-да, именно ты с мышкой в руке. Добро пожаловать в лабораторию 3D-структур данных! Я — Рик Санчес, гений, учёный и теперь твой AR-наставник. Здесь ты не просто клацаешь по кнопкам — ты вживую наблюдаешь, как деревья растут, стеки рушатся, очереди маршируют, а хеш-таблицы... хешируют. Всё это — с анимациями, реальным пространством и даже машинным обучением (ха, конечно, не таким умным как я). Если запутаешься — кликай стрелку, я тебе всё разжую. Ну, или почти всё. Погнали, юный Падуан!",
        "Ну что, прокрастинатор с Wi-Fi, держись крепче. Сейчас я покажу тебе, как в 3D работают структуры данных. Итак, на повестке дня: стек — кладбище последнего добавленного, очередь — проходи без очереди, дерево — не зелёное, но двоичное, и хеш-таблица — мать её, магия индексов и коллизий. Каждая структура — с анимацией, движением и каплей боли в твоём мозгу. Погнали по порядку!",
        "Стек — это как стопка бургеров у Джерри: что положил последним — то и съешь первым. LIFO, детка. Last In — First Out. Всё просто: закинул, закинул, потом достал... и достал то, что закинул последним. Порядок? Логика? Здесь мы не ищем лёгких путей — мы стекуем!",
        "Очередь — это как поход в межгалактическую столовую: кто встал первым, тот и жуёт первым. FIFO, малыш. First In — First Out. Пришёл, встал, жди, пока всех перед тобой обслужат. Никаких подрезаний, это тебе не Мексика. Добавляешь — в конец. Убираешь — из начала. Порядок, дисциплина и никакой Рик в обход!",
        "Дерево, детка, но не то, что растёт у тебя за окном. Это такая структура, где каждый элемент может плодить себе потомков — один слева, один справа. Двоичное дерево, понял? У каждого узла — свои дети, а у кого-то и внуки. Поиск в нём как по генеалогии Морти: сначала папа, потом мама, потом сын, потом сосед, потом сам Рик. Быстро, логично и без бензопилы. И да — чем глубже, тем больнее процессор!",
        "Хеш-таблица — это как вселенский портал: ты кидаешь туда ключ, а он телепортирует тебя прямо к нужной ячейке. Быстро, чётко, без соплей. Всё работает по формуле: ключ превращается в индекс, индекс указывает на место, и ты туда всё кидаешь. Главное — избегать коллизий. Это когда два идиота лезут в один портал. В жизни — драка. В хеш-таблице — цепочка. Или перезапись. Или просто Рик в ярости. Так что выбирай ключи с умом, не как Джерри.",
        "Так-так-так, ну хватит болтать! Сейчас я выясню, что тебе реально нужно. Отвечай на вопросы — и я подберу тебе самую чёткую структуру данных. Не наугад, а с нейросеточкой, бубубу!",

            // 7. Опросник (HTML строка)
        `
        <form id="rick_form" class="rick_form_block">
    <label>Как часто ты швыряешь данные внутрь?
        <select name="insert_freq">
            <option value="low">Редко, как Джерри додумывает шутку</option>
            <option value="medium" selected>Нормально, как Морти бегает</option>
            <option value="high">Постоянно, как Рик бухает!</option>
        </select>
    </label><br>

    <label>Как часто удаляешь, аки позор?
        <select name="delete_freq">
            <option value="low">Почти не удаляю — оставляю хаос</option>
            <option value="medium">Удаляю по делу, как Рик порталы</option>
            <option value="high">Чищу всё, как у Феникса в понедельник</option>
        </select>
    </label><br>

    <label>Как часто ищешь, как безумец?
        <select name="search_freq">
            <option value="low">Не ищу — знаю, что потеряно</option>
            <option value="medium">Иногда ищу, как Морти ключи</option>
            <option value="high" selected>Ищу постоянно, как Рик приключения</option>
        </select>
    </label><br>

    <label>Нужен порядок, как в мультивселенной федералов?
        <input type="checkbox" name="need_order" checked>
    </label><br>

    <label>Ключи как личности — уникальные?
        <input type="checkbox" name="unique_keys">
    </label><br>

    <label>Ты чётко знаешь, куда идти по ключу?
        <select name="access_by_key">
            <option value="low">Никто не знает адрес — чистый Рой</option>
            <option value="medium">Иногда попадаю, как Бет к Джерри</option>
            <option value="high">Всегда в точку — как порталган</option>
        </select>
    </label><br>

    <button type="submit">Рассчитать структуру</button>
</form>

        `
    ];

    const rick_images = [
        "assets/rick/rick2.png",
        "assets/rick/rick3.png",
        "assets/rick/rick4.png",
        "assets/rick/rick5.png",
        "assets/rick/rick_smile.png"
    ];

    let opened = false;
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
            if (typeof content === 'string' && content.includes('<form')) {
                setupFormHandler();
            } // форма
        }
        counterElem.textContent = `${currentIndex + 1}\\${text_index.length}`;
        rickImg.src = rick_images[currentIndex % rick_images.length];
    }

    const openPanel  = () => { panel.style.marginLeft = '0';  arrowWrap.style.marginLeft = '800px'; arrowImg.style.transform = 'rotate(180deg)'; opened = true; };
    const closePanel = () => { panel.style.marginLeft = '-800px'; arrowWrap.style.marginLeft = '0';  arrowImg.style.transform = 'rotate(0deg)';   opened = false; currentIndex = 0; refreshUI(); };

    arrowWrap.addEventListener('click', () => opened ? closePanel() : openPanel());

    menuBtn.addEventListener('click', () => {
        if (currentIndex < text_index.length - 1) {
            currentIndex++;
            refreshUI();
        }
    });

    refreshUI();

    function setupFormHandler() {
        const form = document.getElementById('rick_form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const payload = {
                insert_freq: formData.get("insert_freq"),
                delete_freq: formData.get("delete_freq"),
                search_freq: formData.get("search_freq"),
                need_order: formData.get("need_order") === "on",
                unique_keys: formData.get("unique_keys") === "on",
                access_by_key: formData.get("access_by_key")
            };

            try {
                const response = await fetch('http://127.0.0.1:5000/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error("API response error");

                const data = await response.json();
                console.log("✅ Ответ от нейросети:", data);

                let resultText = `Ага! Вот что нейросеть наковыряла:\n\n🔥 Лучший выбор — **${data.best_structure}**!\n`;

                if (data.alternatives?.length > 1) {
                    resultText += `\n📊 Альтернативы:\n`;
                    for (let i = 1; i < data.alternatives.length; i++) {
                        const alt = data.alternatives[i];
                        resultText += `• ${alt.structure} (${Math.round(alt.confidence * 100)}%)\n`;
                    }
                }

                text_index.push(resultText);
                currentIndex++;
                refreshUI();

            } catch (e) {
                console.warn('❌ Ошибка запроса к нейросети:', e);
                text_index.push("Нейросеть облажалась. Видимо, портал нестабилен. Попробуй позже.");
                currentIndex++;
                refreshUI();
            }
        });
    }
});
