import React, {useState, useEffect, useRef} from 'react';
/**
 *
 * @param {String} key The key to set in localStorage for this value
 * @param {Object} defaultValue The value to use if it is not already in localStorage
 * @param {{serialize: Function, deserialize: Function}} options The serialize and deserialize functions to use (defaults to JSON.stringify and JSON.parse respectively)
 */
// 1. 利用 JSON.stringify / JSON.parse, 可以確保任意 object, array, number, string. 存取時保持相同型態
// 2. 提供讓使用者自定義 serialize, deserialize 的 function
// 3. 提供 defaultValue 可能為計算出初始值的 function 的可能性
// 4. 如果 key 改變了, 有移除舊 key 對應的 localStorage 的邏輯
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage);
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });

  const prevKeyRef = useRef(key);
  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key; // remember new key
    window.localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, setState];
}
