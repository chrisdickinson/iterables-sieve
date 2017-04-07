# @iterables/sieve

Sometimes you want to iterate over a set _once_ and split the set into two
separate usable piles.

This does that!

```javascript
const sieve = require('@iterables/sieve')

const [yes, no] = sieve([1, 0, 1], (xs, idx, all) => {
  return Boolean(xs)
})

console.log([...yes]) // [1, 1]
console.log([...no]) // [0]

// works with any iterable:
const [yes, no] = sieve(function * () {
  yield 0
  yield 1
  yield 2
}(), xs => Boolean(xs))

console.log([...yes]) // [1, 2]
console.log([...no]) // [0]
```

## Installation

```
$ npm install --save @iterables/sieve
```

## API

### `sieve(iterable:Iterator<T>, test:Function) -> [Iterator<T>, Iterator<T>]`

* `iterable`: any iterable (generator instance, `Set`, `Map`, `Array`, etc.)
* `test`: a function taking `xs`, `idx`, and `all`, returning `Boolean`
  * `xs`: an item from `iterable`.
  * `idx`: the index within the array.
  * `all`: the original iterable

Returns a two-element array of iterators. The first element, `yes`, is an
iterable of all items from the original iterable that pass the test function.
The second element, `no`, contains all the failing items.

Note: this function will buffer the skipped items in the second iterable to be
realized. That is, if you evaluate the `yes` iterable *all at once* first, all
failing elements will be buffered in `no` until it is iterated. Usually realizing
the array is the goal, so keeping the elements in memory shouldn't be an issue.

If memory _is_ an issue, consider taking one element at a time from `yes` and
`no`, which will buffer at most `N` items, where `N` is the largest run of
all-passing or all-failing items.

## License

MIT
