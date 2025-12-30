// === УНИВЕРСАЛЬНАЯ БАЗА ДАННЫХ (JSON + CMS + MULTILANGUAGE) ===

function getLanguage() {
    return localStorage.getItem('site_lang') || 'ru';
}

async function loadGoogleSheet(type) {
    const lang = getLanguage(); // 'ru' или 'en'

    // Список всех разделов, которые теперь управляются через JSON/Админку
    const jsonSections = ['blog', 'books', 'notes', 'home', 'hidden'];

    if (jsonSections.includes(type)) {
        try {
            // === ВОТ ЗДЕСЬ МАГИЯ ===
            // Если язык английский, ищем файл с приставкой _en (например, blog_en.json)
            // Если русский — берем обычный (blog.json)
            let fileName = (lang === 'en') ? `${type}_en.json` : `${type}.json`;
            
            const response = await fetch(fileName);
            
            // Если английского файла пока нет (ошибка 404), пробуем загрузить русский как запасной вариант
            if (!response.ok) {
                console.warn(`File ${fileName} not found, falling back to RU.`);
                fileName = `${type}.json`;
                
                const fallback = await fetch(fileName);
                if (!fallback.ok) throw new Error("File not found");
                
                const data = await fallback.json();
                return data.posts || data;
            }
            
            const data = await response.json();
            // Админка сохраняет посты внутри { posts: [...] }, но старые файлы могут быть плоскими
            // Эта строка универсальна: если есть поле posts - берем его, иначе берем всё
            return data.posts || data;

        } catch (err) {
            console.error(`Ошибка загрузки ${type}:`, err);
            return [];
        }
    }

    return [];
}

// Эта функция больше не используется для JSON-данных, но оставим пустой, чтобы не ломать старые вызовы, если они есть
function mapHomeData(rows) { return rows; }