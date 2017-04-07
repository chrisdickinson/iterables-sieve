'use strict'

module.exports = sieve

const STATE = Symbol('state')
const TAKE = Symbol('take')
const NEXT = Symbol('next')
const TAIL = Symbol('tail')

class IterState {
  constructor (value, done) {
    this.value = value
    this.done = done
    this[NEXT] = null
  }
}

class Iter {
  constructor (take) {
    this[STATE] = null
    this[TAKE] = take
    this[TAIL] = null
  }

  [Symbol.iterator] () {
    return this
  }

  next () {
    while (!this[STATE]) {
      this[TAKE]()
    }
    const next = this[STATE]
    this[STATE] = this[STATE][NEXT]
    next[NEXT] = null
    if (!this[STATE]) {
      this[TAIL] = null
    }
    return next
  }
}

function sieve (iterable, test) {
  if (!iterable || typeof iterable[Symbol.iterator] !== 'function') {
    throw new TypeError('expected iterable as first argument')
  }

  if (typeof test !== 'function') {
    throw new TypeError('expected function as second argument')
  }

  const yes = new Iter(take)
  const no = new Iter(take)
  let idx = 0

  iterable = iterable[Symbol.iterator]()
  return [yes, no]

  function take () {
    const cursor = iterable.next()
    if (cursor.done) {
      tail(yes, new IterState(null, true))
      tail(no, new IterState(null, true))
    } else {
      tail((
        test(cursor.value, idx++, iterable)
        ? yes
        : no
      ), new IterState(cursor.value, false))
    }
  }
}

function tail (iter, toAdd) {
  if (iter[TAIL]) {
    iter[TAIL][NEXT] = toAdd
    iter[TAIL] = toAdd
  } else {
    iter[STATE] = toAdd
    iter[TAIL] = toAdd
  }
}
