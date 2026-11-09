# bem-scss


**Copy markup → press a hotkey → paste a ready BEM-nested SCSS skeleton.**

[Русская версия](README.ru.md)

Works with HTML and Vue templates (`class`, `:class`, `v-bind:class`). Zero dependencies. macOS, Windows (native or WSL) and Linux.

## Example

Input (in your clipboard):

```html
<article class="card card--featured">
  <h2 class="card__title">Title</h2>
  <p :class="['card__text', { 'card__text--muted': muted }]">Text</p>
  <button class="button button--primary">Read</button>
</article>
```

Output (back in your clipboard):

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

## Install

```bash
npm i -g github:lifaranton/public-bem-scss
```

Update to the latest version — the same command.

Requires Node.js 18+. On Linux (not WSL) install `xclip` for clipboard mode.

## Usage

```bash
bem-scss               # clipboard → clipboard
bem-scss Card.vue      # file → stdout
cat page.html | bem-scss -   # stdin → stdout
bem-scss --help
```

Rules: `block__element--modifier`. Block modifiers go inside the block, element modifiers inside the element. Only static class names are picked up: in `:class` expressions just quoted strings are used, dynamic parts like `` `icon--${name}` `` are skipped.

## Hotkey in WebStorm (or any JetBrains IDE)

**Settings → Tools → External Tools → +**

| Field | macOS | Windows + WSL | Windows (no WSL) |
|---|---|---|---|
| Program | `/bin/zsh` | `wsl.exe` | `cmd.exe` |
| Arguments | `-lc "bem-scss"` | `-e bash -lc "bem-scss"` | `/c bem-scss` |
| Working directory | `$ProjectFileDir$` | `$ProjectFileDir$` | `$ProjectFileDir$` |

If you use nvm and the command is not found, replace `bem-scss` in Arguments with `source ~/.nvm/nvm.sh && bem-scss`.

Then **Settings → Keymap → External Tools → bem-scss → Add Keyboard Shortcut**, e.g. `⌘⌥⇧B` / `Ctrl+Alt+Shift+B`.

Workflow: select markup → copy → hotkey → paste into `.scss` or `<style lang="scss">`.

In VS Code you can do the same with a task bound to a keybinding.

## Use as a library

```js
import { convert, extractClasses } from 'bem-scss' // after: npm i github:lifaranton/public-bem-scss

convert('<div class="card card__title"></div>')
```

## License

MIT
