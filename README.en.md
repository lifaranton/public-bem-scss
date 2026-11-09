# bem-scss

**Copy markup → press a hotkey → paste a ready BEM-nested SCSS skeleton.**

[Русская версия](README.md)

- Understands HTML, Vue (`class`, `:class`) and React (`className`, `clsx(...)`)
- Builds BEM nesting: `block__element--modifier`
- Works on macOS, Windows and Windows + WSL
- Zero dependencies

## Example

Copy this markup:

```vue
<article class="card card--featured">
  <h2 class="card__title">Title</h2>
  <p :class="['card__text', { 'card__text--muted': muted }]">Text</p>
  <button class="button button--primary">Read</button>
</article>
```

Press the hotkey — your clipboard now has:

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

Block modifiers go inside the block, element modifiers inside the element. Dynamic classes like `` `icon--${name}` `` are skipped: only complete class names are used.

## Install

**Node.js 18 or newer is required.** Check with `node -v`.

Install (same command on Mac, Windows and WSL):

```bash
npm i -g github:lifaranton/public-bem-scss
```

Check: `bem-scss --version` prints the version.

Update — run the install command again. Uninstall — `npm rm -g bem-scss`.

> Using WSL — install inside WSL (Ubuntu terminal), not in Windows.

## Run from terminal

```bash
bem-scss               # markup from clipboard → SCSS to clipboard
bem-scss Card.vue      # from file → print to terminal
bem-scss --help
```

## Hotkey in WebStorm (and other JetBrains IDEs)

**1. Add an external tool**

**Settings → Tools → External Tools → +**:

- **Name:** `bem-scss`
- **Program** and **Arguments** for your system:

| System | Program | Arguments |
|---|---|---|
| macOS | `/bin/zsh` | `-lic "bem-scss"` |
| Windows | `cmd.exe` | `/c bem-scss` |
| Windows + WSL | `wsl.exe` | `-- bash -ic "bem-scss"` |

- **Working directory** — leave empty.
- Optionally uncheck **Open console for tool output**.

Click **OK**.

> WSL with zsh instead of bash: replace `bash` with `zsh` in Arguments.

**2. Assign a shortcut**

**Settings → Keymap** → search `bem-scss` → right-click → **Add Keyboard Shortcut** → press e.g. `⌘⌥⇧B` on Mac or `Ctrl+Alt+Shift+B` on Windows → **OK**.

**3. Try it**

Select markup → copy → press the hotkey → paste into `.scss` or `<style lang="scss">`.

## Hotkey in VS Code (and Cursor)

**1. Add a task**

`Ctrl+Shift+P` (`⌘⇧P` on Mac) → **Tasks: Open User Tasks** → if asked for a template, pick **Others**. Replace the file content with:

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

Save. The task works in every project, including Remote — WSL.

**2. Assign a shortcut**

`Ctrl+Shift+P` → **Preferences: Open Keyboard Shortcuts (JSON)** → add inside `[ ]`:

```json
{
  "key": "ctrl+alt+shift+b",
  "mac": "cmd+alt+shift+b",
  "command": "workbench.action.tasks.runTask",
  "args": "bem-scss"
}
```

If the file already has shortcuts, put a comma after the previous `}`.

**3. Try it**

Select markup → copy → press the hotkey → paste.

## Author

[@lifaranton](https://github.com/lifaranton) · MIT License
