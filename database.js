// === УМНАЯ ФУНКЦИЯ ЗАГРУЗКИ ===

function getLanguage() {
    return localStorage.getItem('site_lang') || 'ru';
}

async function loadGoogleSheet(type) {
    // Убрали искусственную задержку (setTimeout), чтобы грузилось максимально быстро
    const lang = getLanguage(); // 'ru' или 'en'

    try {
        // --- НОВАЯ ЛОГИКА ДЛЯ БЛОГА (Загрузка из JSON для работы CMS) ---
        if (type === 'blog') {
            try {
                // Если язык английский, можно сделать отдельный файл blog_en.json
                // Пока используем один файл:
                const fileName = 'blog.json'; 
                
                // Когда будет готов перевод, можно раскомментировать:
                // const fileName = (lang === 'en') ? 'blog_en.json' : 'blog.json';

                const response = await fetch(fileName);
                
                if (!response.ok) {
                    throw new Error(`Не удалось загрузить ${fileName}: ${response.status}`);
                }
                
                const data = await response.json();
                
                // ВАЖНОЕ ОБНОВЛЕНИЕ ДЛЯ АДМИНКИ:
                // Decap CMS сохраняет данные в структуре { "posts": [ ... ] }
                // Мы проверяем: если есть поле "posts", берем его. Если нет — берем весь объект (для совместимости).
                return data.posts || data;

            } catch (err) {
                console.error("Ошибка при чтении блога:", err);
                return []; // Возвращаем пустой список, чтобы сайт не сломался
            }
        }

        // --- НОВАЯ ЛОГИКА ДЛЯ HIDDEN (Секретный раздел) ---
        if (type === 'hidden') {
            try {
                // Если язык английский, в будущем создашь hidden_en.json
                // Пока грузим русскую версию для админки
                const fileName = 'hidden.json'; 
                
                const response = await fetch(fileName);
                if (!response.ok) throw new Error('Failed load hidden');
                
                const data = await response.json();
                return data.posts || data;
            } catch (err) {
                console.error("Ошибка hidden:", err);
                return [];
            }
        }

        // --- СТАРАЯ ЛОГИКА ДЛЯ ОСТАЛЬНЫХ РАЗДЕЛОВ (Из JS переменных) ---
        // Эти данные пока редактируются через код (файлы data_*.js)
        
        if (type === 'home') {
            if (typeof indexData_ru === 'undefined') throw new Error("Ошибка: Файл 'data_home.js' не подключен!");
            return (lang === 'en') ? indexData_en : indexData_ru;
        }
        
        if (type === 'books') {
            if (typeof myBooks_ru === 'undefined') throw new Error("Ошибка: Файл 'data_books.js' не подключен!");
            return (lang === 'en') ? myBooks_en : myBooks_ru;
        }
        
        if (type === 'notes') {
            if (typeof notes_ru === 'undefined') throw new Error("Ошибка: Файл 'data_notes.js' не подключен!");
            return (lang === 'en') ? notes_en : notes_ru;
        }

    } catch (error) {
        // Выводим ошибку в консоль и пользователю (кроме блога и hidden, там обработка выше)
        console.error(error);
        if (type !== 'blog' && type !== 'hidden') {
            alert(`⛔️ ПРОБЛЕМА НА САЙТЕ:\n${error.message}\n\nПроверьте подключение файлов data_*.js`);
        }
        return [];
    }
    
    return [];
}

// Вспомогательная функция
function mapHomeData(rows) { return rows; }