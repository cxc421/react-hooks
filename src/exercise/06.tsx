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

type ErrorBoundaryProps = {FallbackComponent: FC<{error: Error}>};
type ErrorBoundaryState = {error: Error | null};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {error: null};
  static getDerivedStateFromError(error: Error) {
    // 更新 state 以至於下一個 render 會顯示 fallback UI
    return {error};
  }
  // componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  //   console.log(errorInfo);
  //   this.setState({error});
  // }
  render() {
    const {error} = this.state;
    if (error) {
      return <this.props.FallbackComponent error={error} />;
    }
    return this.props.children;
  }
}

const ErrorFallback: FC<{error: Error}> = ({error}) => (
  <div role="alert">
    There was an error:{' '}
    <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
  </div>
);

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
        {/* 利用 key 不同時會 unmount/mount 的特性, 可以 reset ErrorBoundary 的 state */}
        <ErrorBoundary FallbackComponent={ErrorFallback} key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
