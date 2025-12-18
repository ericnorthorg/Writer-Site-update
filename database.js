// === УМНАЯ ФУНКЦИЯ ЗАГРУЗКИ (С ДИАГНОСТИКОЙ) ===

function getLanguage() {
    return localStorage.getItem('site_lang') || 'ru';
}

async function loadGoogleSheet(type) {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 300));
    const lang = getLanguage(); // 'ru' или 'en'

    try {
        // --- ДИАГНОСТИКА: Проверяем, видны ли переменные ---
        
        if (type === 'home') {
            if (typeof indexData_ru === 'undefined') throw new Error("Ошибка: Файл 'data_home.js' не подключен или в нем ошибка!");
            return (lang === 'en') ? indexData_en : indexData_ru;
        }
        
        if (type === 'blog') {
            if (typeof blogPosts_ru === 'undefined') throw new Error("Ошибка: Файл 'data_blog.js' не подключен или в нем ошибка!");
            return (lang === 'en') ? blogPosts_en : blogPosts_ru;
        }
        
        if (type === 'books') {
            if (typeof myBooks_ru === 'undefined') throw new Error("Ошибка: Файл 'data_books.js' не подключен или в нем ошибка!");
            return (lang === 'en') ? myBooks_en : myBooks_ru;
        }
        
        if (type === 'notes') {
            if (typeof notes_ru === 'undefined') throw new Error("Ошибка: Файл 'data_notes.js' не подключен или в нем ошибка!");
            return (lang === 'en') ? notes_en : notes_ru;
        }
        
        if (type === 'hidden') {
            if (typeof hiddenPosts_ru === 'undefined') throw new Error("Ошибка: Файл 'data_hidden.js' не подключен или в нем ошибка!");
            return (lang === 'en') ? hiddenPosts_en : hiddenPosts_ru;
        }

    } catch (error) {
        // Выводим ошибку прямо на экран, чтобы вы ее увидели
        alert(`⛔️ ПРОБЛЕМА НА САЙТЕ:\n${error.message}\n\nУбедитесь, что:\n1. Файл data_*.js лежит в папке.\n2. Он подключен в HTML перед database.js.`);
        console.error(error);
        return []; // Возвращаем пустой массив, чтобы сайт не вис намертво
    }
    
    return [];
}

// Вспомогательная функция (должна быть здесь)
function mapHomeData(rows) { return rows; }