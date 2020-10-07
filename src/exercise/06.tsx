// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {FC, useEffect, useState} from 'react';

import {
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  fetchPokemon,
  Pokemon,
} from '../pokemon';

type PokemonInfoProps = {
  pokemonName: string;
};

const PokemonInfo: FC<PokemonInfoProps> = ({pokemonName}) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    if (!pokemonName) return;
    setPokemon(null);
    fetchPokemon(pokemonName)
      .then(pokemonData => setPokemon(pokemonData))
      .catch(err => alert(err.message));
  }, [pokemonName]);

  if (!pokemonName) {
    return <>Submit a pokemon</>;
  }
  if (!pokemon) {
    return <PokemonInfoFallback name={pokemonName} />;
  }
  return <PokemonDataView pokemon={pokemon} />;
};

function App() {
  const [pokemonName, setPokemonName] = React.useState('');

  function handleSubmit(newPokemonName: string) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  );
}

export default App;
