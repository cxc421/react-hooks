// useState: greeting
// http://localhost:3000/isolated/exercise/01.js

import React, {FC, useState} from 'react';

type GreetingProps = {
  initialName?: string;
};

const Greeting: FC<GreetingProps> = ({initialName = ''}) => {
  const [name, setName] = useState(initialName);

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
  return <Greeting initialName="Chris" />;
}

export default App;
