# bem-scss

**Скопировал разметку → нажал горячую клавишу → вставил готовый каркас SCSS по БЭМ.**

[English version](README.en.md)

- Понимает HTML, Vue (`class`, `:class`) и React (`className`, `clsx(...)`)
- Строит вложенность по БЭМ: `блок__элемент--модификатор`
- Работает на macOS, Windows и Windows + WSL
- Без зависимостей

## Пример

Копируешь разметку:

```vue
<article class="card card--featured">
  <h2 class="card__title">Заголовок</h2>
  <p :class="['card__text', { 'card__text--muted': muted }]">Текст</p>
  <button class="button button--primary">Читать</button>
</article>
```

Нажимаешь горячую клавишу — в буфере обмена уже лежит:

```scss
.card {
  &--featured {
  }

  &__title {
  }

  &__text {
    &--muted {
    }
  }
}

.button {
  &--primary {
  }
}
```

Модификаторы блока — внутри блока, модификаторы элемента — внутри элемента. Динамические классы вроде `` `icon--${name}` `` пропускаются: берутся только классы, написанные целиком.

## Установка

**Обязательно нужен Node.js 18 или новее.** Проверить: `node -v` в терминале.

Установить (одна команда — на Mac, в Windows и в WSL одинаково):

```bash
npm i -g github:lifaranton/public-bem-scss
```

Проверить: `bem-scss --version` — выводит номер версии.

Обновить до новой версии — та же команда установки. Удалить — `npm rm -g bem-scss`.

> Пользуешься WSL — ставь внутри WSL (в терминале Ubuntu), не в Windows.

## Запуск из терминала

```bash
bem-scss               # разметка из буфера обмена → SCSS в буфер обмена
bem-scss Card.vue      # из файла → вывод в терминал
bem-scss --help        # справка
```

## Горячая клавиша в WebStorm (и других IDE JetBrains)

**1. Добавить внешний инструмент**

Открой **Settings → Tools → External Tools → +** и заполни:

- **Name:** `bem-scss`
- **Program** и **Arguments** — по своей системе:

| Система | Program | Arguments |
|---|---|---|
| macOS | `/bin/zsh` | `-lic "bem-scss"` |
| Windows | `cmd.exe` | `/c bem-scss` |
| Windows + WSL | `wsl.exe` | `-- bash -ic "bem-scss"` |

- **Working directory** — оставить пустым.
- По желанию сними галочку **Open console for tool output**, чтобы не всплывало окно.

Нажми **OK**.

> WSL с zsh вместо bash: в Arguments замени `bash` на `zsh`.

**2. Назначить клавишу**

**Settings → Keymap** → в поиске набери `bem-scss` → правый клик по найденному → **Add Keyboard Shortcut** → нажми сочетание, например `⌘⌥⇧B` на Mac или `Ctrl+Alt+Shift+B` на Windows → **OK**.

**3. Проверить**

Выдели разметку → скопируй → нажми клавишу → вставь в `.scss` или в `<style lang="scss">`.

## Горячая клавиша в VS Code (и Cursor)

**1. Добавить задачу**

`Ctrl+Shift+P` (на Mac `⌘⇧P`) → **Tasks: Open User Tasks** → если спросит шаблон, выбери **Others**. Замени содержимое файла на:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "bem-scss",
      "type": "shell",
      "command": "bem-scss",
      "windows": { "command": "bem-scss.cmd" },
      "presentation": { "reveal": "silent", "close": true },
      "problemMatcher": []
    }
  ]
}
```

Сохрани файл. Задача работает во всех проектах. С WSL (Remote — WSL) тоже ничего менять не нужно.

**2. Назначить клавишу**

`Ctrl+Shift+P` → **Preferences: Open Keyboard Shortcuts (JSON)** → добавь внутрь `[ ]`:

```json
{
  "key": "ctrl+alt+shift+b",
  "mac": "cmd+alt+shift+b",
  "command": "workbench.action.tasks.runTask",
  "args": "bem-scss"
}
```

Если в файле уже есть другие сочетания — поставь запятую после предыдущего `}`.

**3. Проверить**

Выдели разметку → скопируй → нажми клавишу → вставь.

## Автор

[@lifaranton](https://github.com/lifaranton) · Лицензия MIT
