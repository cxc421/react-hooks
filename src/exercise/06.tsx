// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {FC, useEffect, useState} from 'react';
import {ErrorBoundary, FallbackProps} from 'react-error-boundary';

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

type PokemonState =
  | {status: 'idle'}
  | {status: 'pending'}
  | {status: 'resolved'; pokemon: Pokemon}
  | {status: 'rejected'; error: Error};

const PokemonInfo: FC<PokemonInfoProps> = ({pokemonName}) => {
  const [pokemonState, setPokemonState] = useState<PokemonState>({
    status: 'idle',
  });

  useEffect(() => {
    if (!pokemonName) return;
    setPokemonState({status: 'pending'});
    fetchPokemon(pokemonName)
      .then(pokemon => setPokemonState({status: 'resolved', pokemon}))
      .catch(error => setPokemonState({status: 'rejected', error}));
  }, [pokemonName]);

  if (pokemonState.status === 'idle') {
    return <>Submit a pokemon</>;
  }

  if (pokemonState.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />;
  }

  if (pokemonState.status === 'rejected') {
    throw pokemonState.error;
  }

  return <PokemonDataView pokemon={pokemonState.pokemon} />;
};

const ErrorFallback: FC<FallbackProps> = ({error, resetErrorBoundary}) => (
  <div role="alert">
    There was an error:{' '}
    <pre style={{whiteSpace: 'normal'}}>{error ? error.message : ''}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

function App() {
  const [pokemonName, setPokemonName] = React.useState('');

  function handleSubmit(newPokemonName: string) {
    setPokemonName(newPokemonName);
  }

  function handleReset() {
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {/* 利用 key 不同時會 unmount/mount 的特性, 可以 reset ErrorBoundary 的 state */}
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
