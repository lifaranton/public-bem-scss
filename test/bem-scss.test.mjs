import { test } from 'node:test'
import assert from 'node:assert/strict'
import { extractClasses, convert } from '../bem-scss.mjs'

test('extracts classes from class and :class', () => {
  const html = `<div class="card card--big"><span :class="['card__title', { 'card__title--active': on }]"></span></div>`
  assert.deepEqual(extractClasses(html), ['card', 'card--big', 'card__title', 'card__title--active'])
})

test('ignores dynamic template parts', () => {
  assert.deepEqual(extractClasses('<i :class="`icon icon--${name}`"></i>'), [])
})

test('builds nested BEM SCSS', () => {
  const html = `<div class="card card--big"><p class="card__text card__text--muted"></p></div>`
  assert.equal(
    convert(html),
    `.card {
  &--big {
  }

  &__text {
    &--muted {
    }
  }
}
`,
  )
})

test('React: className string and expression', () => {
  const jsx = `<div className="card card--big">
    <h2 className={clsx('card__title', { 'card__title--active': isActive })}>Hi</h2>
    <p className={isMuted ? "card__text card__text--muted" : "card__text"} />
    <i className={\`icon icon--\${name}\`} />
  </div>`
  assert.deepEqual(extractClasses(jsx), [
    'card', 'card--big', 'card__title', 'card__title--active', 'card__text', 'card__text--muted',
  ])
})

test('keeps document order across class and :class', () => {
  const html = `<b :class="['menu__item']"></b><a class="menu"></a>`
  assert.deepEqual(extractClasses(html), ['menu__item', 'menu'])
})

test('element without block class still creates the block', () => {
  assert.equal(convert('<b class="menu__item"></b>'), `.menu {\n  &__item {\n  }\n}\n`)
})
