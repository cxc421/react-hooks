// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, {FC, useEffect, useState} from 'react';

// 1. 利用 JSON.stringify / JSON.parse, 可以確保任意 object, array, number, string. 存取時保持相同型態
// 2. 提供讓使用者自定義 serialize, deserialize 的 function
// 3. 提供 defaultValue 可能為計算出初始值的 function 的可能性
// 4. 如果 key 改變了, 有移除舊 key 對應的 localStorage 的邏輯
function useLocalStorageState(
  key: string,
  defaultValue: any = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
): [any, React.Dispatch<React.SetStateAction<any>>] {
  const [state, setState] = useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage);
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });

  const prevKeyRef = React.useRef(key);

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

type GreetingProps = {
  initialName?: string;
};

const Greeting: FC<GreetingProps> = ({initialName = ''}) => {
  console.log(`Rerender.`);
  const [name, setName] = useLocalStorageState('name', initialName);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name} />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  );
};

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>
        {count}
      </button>
      <Greeting />
    </>
  );
}

export default App;
