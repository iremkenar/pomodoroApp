import { sum } from '../src/helpers/math';

test('sum of 3 and 5 must be 8', () => {
  const result = sum(3, 5);
  expect(result).toBe(8);
});

test('sum of 3 without y', () => {
  const result = sum(3);
  expect(result).toBe(3);
});
