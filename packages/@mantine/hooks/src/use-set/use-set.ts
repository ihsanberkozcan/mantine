import { useRef } from 'react';
import { useForceUpdate } from '../use-force-update/use-force-update';

export function readonlySetLikeToSet<T>(input: ReadonlySetLike<T>): Set<T> {
  if (input instanceof Set) {
    return input;
  }
  const result = new Set<T>();
  for (const item of input as any) {
    result.add(item);
  }
  return result;
}

export function useSet<T>(values?: T[]): Set<T> {
  const setRef = useRef(new Set(values));
  const forceUpdate = useForceUpdate();

  setRef.current.add = (...args) => {
    const res = Set.prototype.add.apply(setRef.current, args);
    forceUpdate();
    return res;
  };

  setRef.current.clear = (...args) => {
    Set.prototype.clear.apply(setRef.current, args);
    forceUpdate();
  };

  setRef.current.delete = (...args) => {
    const res = Set.prototype.delete.apply(setRef.current, args);
    forceUpdate();
    return res;
  };

  setRef.current.union = <U>(other: ReadonlySetLike<U>): Set<T | U> => {
    const result = new Set<T | U>(setRef.current as Set<T>);
    readonlySetLikeToSet(other).forEach((item) => result.add(item));
    return result;
  };

  setRef.current.intersection = <U>(other: ReadonlySetLike<U>): Set<T & U> => {
    const result = new Set<T & U>();
    const otherSet = readonlySetLikeToSet(other);
    setRef.current.forEach((item) => {
      if (otherSet.has(item as any)) {
        result.add(item as T & U);
      }
    });
    return result;
  };

  setRef.current.difference = <U>(other: ReadonlySetLike<U>): Set<T> => {
    const result = new Set<T>();
    const otherSet = readonlySetLikeToSet(other);
    setRef.current.forEach((item) => {
      if (!otherSet.has(item as any)) {
        result.add(item);
      }
    });
    return result;
  };

  setRef.current.symmetricDifference = <U>(other: ReadonlySetLike<U>): Set<T | U> => {
    const result = new Set<T | U>();
    const otherSet = readonlySetLikeToSet(other);

    setRef.current.forEach((item) => {
      if (!otherSet.has(item as any)) {
        result.add(item);
      }
    });

    otherSet.forEach((item) => {
      if (!setRef.current.has(item as any)) {
        result.add(item);
      }
    });

    return result;
  };

  return setRef.current;
}
