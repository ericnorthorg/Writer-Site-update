// === УМНАЯ ФУНКЦИЯ ЗАГРУЗКИ ===

function getLanguage() {
    return localStorage.getItem('site_lang') || 'ru';
}

async function loadGoogleSheet(type) {
    // Убрали искусственную задержку (setTimeout), чтобы грузилось максимально быстро
    const lang = getLanguage(); // 'ru' или 'en'

    try {
        // --- НОВАЯ ЛОГИКА ДЛЯ БЛОГА (Загрузка из JSON) ---
        if (type === 'blog') {
            try {
                // Если язык английский, пытаемся загрузить blog_en.json, иначе blog.json
                // Если пока есть только один файл blog.json, используй строку ниже:
                const fileName = 'blog.json'; 
                
                // А когда создашь английскую версию, раскомментируй эту строку:
                // const fileName = (lang === 'en') ? 'blog_en.json' : 'blog.json';

                const response = await fetch(fileName);
                
                if (!response.ok) {
                    throw new Error(`Не удалось загрузить ${fileName}: ${response.status}`);
                }
                
                const data = await response.json();
                return data;
            } catch (err) {
                console.error("Ошибка при чтении блога:", err);
                return []; // Возвращаем пустой список, чтобы сайт не сломался
            }
        }

        // --- СТАРАЯ ЛОГИКА ДЛЯ ОСТАЛЬНЫХ РАЗДЕЛОВ (Из JS переменных) ---
        // Эти разделы (Книги, Заметки, Главная, Секретное) пока берем по-старому
        
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
        
        if (type === 'hidden') {
            if (typeof hiddenPosts_ru === 'undefined') throw new Error("Ошибка: Файл 'data_hidden.js' не подключен!");
            return (lang === 'en') ? hiddenPosts_en : hiddenPosts_ru;
        }

    } catch (error) {
        // Выводим ошибку в консоль и пользователю, если это не блог (там мы ошибку уже обработали)
        console.error(error);
        if (type !== 'blog') {
            alert(`⛔️ ПРОБЛЕМА НА САЙТЕ:\n${error.message}\n\nПроверьте подключение файлов data_*.js`);
        }
        return [];
    }
    
    return [];
}

// Вспомогательная функция
function mapHomeData(rows) { return rows; }