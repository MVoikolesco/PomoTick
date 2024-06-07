import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { useIsEmpty } from '@/composables/useIsEmpty';

describe('useIsEmpty', () => {

  let isEmpty;

  beforeAll(async () => {
    const composable = useIsEmpty();
    isEmpty = composable.isEmpty;
  });

  test('should return true for empty values', () => {

    expect(isEmpty('')).toBeTruthy();
    expect(isEmpty(' ')).toBeTruthy();
    expect(isEmpty(null)).toBeTruthy(true);
    expect(isEmpty(undefined)).toBeTruthy(true);
    expect(isEmpty([])).toBeTruthy(true);
    expect(isEmpty({})).toBeTruthy(true);
  });

  test('should return false for non-empty values', () => {

    // expect(isEmpty(0)).toBeFalsy();
    // expect(isEmpty('0')).toBeFalsy();
    expect(isEmpty(1)).toBeFalsy();
    expect(isEmpty('1')).toBeFalsy();
    expect(isEmpty('Hello')).toBeFalsy();
    expect(isEmpty([1, 2, 3])).toBeFalsy();
    expect(isEmpty({ name: 'John', age: 30 })).toBeFalsy();
  });
});