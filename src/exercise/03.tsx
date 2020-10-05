// Lifting state
// http://localhost:3000/isolated/exercise/03.js

import React, {FC} from 'react';

type NameProps = {};
const Name: FC<NameProps> = () => {
  const [name, setName] = React.useState('');
  return (
    <div>
      <label htmlFor="name">Name: </label>
      <input id="name" value={name} onChange={e => setName(e.target.value)} />
    </div>
  );
};

type FavoriteAnimalProps = {
  animal: string;
  onAnimalChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
const FavoriteAnimal: FC<FavoriteAnimalProps> = ({animal, onAnimalChange}) => {
  return (
    <div>
      <label htmlFor="animal">Favorite Animal: </label>
      <input id="animal" value={animal} onChange={onAnimalChange} />
    </div>
  );
};

type DisplayProps = {
  animal: string;
};
const Display: FC<DisplayProps> = ({animal}) => {
  return <div>{`Your favorite animal is: ${animal}!`}</div>;
};

function App() {
  const [animal, setAnimal] = React.useState('');
  return (
    <form>
      <Name />
      <FavoriteAnimal
        animal={animal}
        onAnimalChange={event => setAnimal(event.target.value)}
      />
      <Display animal={animal} />
    </form>
  );
}

export default App;
