// === УНИВЕРСАЛЬНАЯ БАЗА ДАННЫХ (JSON + CMS + MULTILANGUAGE) ===

function getLanguage() {
    return localStorage.getItem('site_lang') || 'ru';
}

async function loadGoogleSheet(type) {
    const lang = getLanguage(); // 'ru' или 'en'

    // Список всех разделов, которые управляются через JSON/Админку
    const jsonSections = ['blog', 'books', 'notes', 'home', 'hidden'];

    if (jsonSections.includes(type)) {
        try {
            // 1. Определяем имя файла в зависимости от языка
            // Если язык английский — ищем *_en.json, если русский — *.json
            let fileName = (lang === 'en') ? `${type}_en.json` : `${type}.json`;
            
            const response = await fetch(fileName);
            
            // 2. Если файл не найден (например, английский еще не создан), 
            // делаем "Fallback" — загружаем русскую версию, чтобы сайт не был пустым.
            if (!response.ok) {
                console.warn(`File ${fileName} not found, falling back to default (RU).`);
                fileName = `${type}.json`;
                
                const fallback = await fetch(fileName);
                if (!fallback.ok) throw new Error(`Critical: File ${fileName} not found`);
                
                const data = await fallback.json();
                return data.posts || data;
            }
            
            // 3. Если файл найден — отдаем данные
            const data = await response.json();
            // Админка сохраняет данные внутри объекта { "posts": [...] }
            // Мы проверяем: если есть обертка posts, берем массив внутри. Если нет — берем как есть.
            return data.posts || data;

        } catch (err) {
            console.error(`Ошибка загрузки раздела ${type}:`, err);
            return []; // Возвращаем пустой массив, чтобы верстка не "поехала"
        }
    }

    return [];
}

// Вспомогательная функция (оставляем для совместимости, если где-то остался старый вызов)
function mapHomeData(rows) { return rows; }