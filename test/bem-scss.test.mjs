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

test('element without block class still creates the block', () => {
  assert.equal(convert('<b class="menu__item"></b>'), `.menu {\n  &__item {\n  }\n}\n`)
})
