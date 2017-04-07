'use strict'

const tap = require('tap')

const sieve = require('./iterable-sieve')

function test (name, testCase) {
  return tap.test(name, assert => {
    testCase(assert)
    return Promise.resolve()
  })
}

test('works on empty array', assert => {
  const [yes, no] = sieve([], () => true)

  assert.deepEqual([...yes], [])
  assert.deepEqual([...no], [])
})

test('works on all-true array', assert => {
  const [yes, no] = sieve([1, true, 'uh-huh'], Boolean)

  assert.deepEqual([...yes], [1, true, 'uh-huh'])
  assert.deepEqual([...no], [])
})

test('works on all-true array (either way)', assert => {
  const [yes, no] = sieve([1, true, 'uh-huh'], Boolean)

  // order of ops matters!
  assert.deepEqual([...no], [])
  assert.deepEqual([...yes], [1, true, 'uh-huh'])
})

test('works on all-false array', assert => {
  const [yes, no] = sieve([0, false], Boolean)

  assert.deepEqual([...yes], [])
  assert.deepEqual([...no], [0, false])
})

test('works on all-false array (either way)', assert => {
  const [yes, no] = sieve([0, false], Boolean)

  // order of ops matters!
  assert.deepEqual([...no], [0, false])
  assert.deepEqual([...yes], [])
})

test('works on 50-50 array', assert => {
  const [yes, no] = sieve([true, 0, 1, false], Boolean)

  assert.deepEqual([...yes], [true, 1])
  assert.deepEqual([...no], [0, false])
})

test('works on 50-50 array (either way)', assert => {
  const [yes, no] = sieve([true, 0, 1, false], Boolean)

  assert.deepEqual([...no], [0, false])
  assert.deepEqual([...yes], [true, 1])
})

test('works on any iterable', assert => {
  const [yes, no] = sieve(new Set([true, true, 0, 1, false]), Boolean)

  assert.deepEqual([...no], [0, false])
  assert.deepEqual([...yes], [true, 1])
})

test('works on raw generator', assert => {
  const [yes, no] = sieve((function * () {
    yield 1
    yield 0
    yield 1
  })(), Boolean)

  assert.deepEqual([...no], [0])
  assert.deepEqual([...yes], [1, 1])
})

test('works on raw generator', assert => {
  const [yes, no] = sieve((function * () {
    yield 1
    yield 0
    yield 1
  })(), Boolean)

  assert.deepEqual([...no], [0])
  assert.deepEqual([...yes], [1, 1])
})

test('fails if false-y value given', assert => {
  assert.throws(TypeError, () => {
    sieve(false)
  })
})

test('fails if non-iterable value given', assert => {
  assert.throws(TypeError, () => {
    sieve({[Symbol.iterator]: null})
  })
})

test('fails if no test given', assert => {
  assert.throws(TypeError, () => {
    sieve([])
  })
})
