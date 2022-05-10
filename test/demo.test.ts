import { sum } from '../src/demo'

// eslint-disable-next-line no-undef
describe('Demo case', () => {
  test('should sum 1 + 2 return 3', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
