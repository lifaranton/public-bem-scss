# bem-scss

**Скопировал разметку → горячая клавиша → вставил готовый каркас SCSS с вложенностью по БЭМ.**

[English version](README.md)

Понимает HTML и шаблоны Vue (`class`, `:class`, `v-bind:class`). Без зависимостей. macOS, Windows (обычный или WSL), Linux.

## Пример

Разметка в буфере обмена:

```html
<article class="card card--featured">
  <h2 class="card__title">Заголовок</h2>
  <p :class="['card__text', { 'card__text--muted': muted }]">Текст</p>
</article>
```

Что окажется в буфере после запуска:

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
```

## Установка

```bash
npm i -g github:lifaranton/public-bem-scss
```

Обновиться до свежей версии — та же команда. Нужен Node.js 18+. На Linux (не WSL) для режима буфера обмена — `xclip`.

## Запуск

```bash
bem-scss               # буфер обмена → буфер обмена
bem-scss Card.vue      # файл → вывод в терминал
cat page.html | bem-scss -   # stdin → вывод в терминал
```

Модификаторы блока — внутри блока, модификаторы элемента — внутри элемента. Берутся только статические классы: из выражений `:class` — строки в кавычках, динамические части вроде `` `icon--${name}` `` пропускаются.

## Горячая клавиша в WebStorm

**Settings → Tools → External Tools → +**

| Поле | macOS | Windows + WSL | Windows без WSL |
|---|---|---|---|
| Program | `/bin/zsh` | `wsl.exe` | `cmd.exe` |
| Arguments | `-lc "bem-scss"` | `-e bash -lc "bem-scss"` | `/c bem-scss` |
| Working directory | `$ProjectFileDir$` | `$ProjectFileDir$` | `$ProjectFileDir$` |

Если Node стоит через nvm и команда не находится — в Arguments замени `bem-scss` на `source ~/.nvm/nvm.sh && bem-scss`.

Дальше **Settings → Keymap → External Tools → bem-scss → Add Keyboard Shortcut**, например `⌘⌥⇧B` / `Ctrl+Alt+Shift+B`.

Порядок работы: выделить разметку → скопировать → горячая клавиша → вставить в `.scss` или `<style lang="scss">`.

## Лицензия

MIT
