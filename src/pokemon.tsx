import React, {FC} from 'react';
import {
  ErrorBoundary,
  ErrorBoundaryProps,
  FallbackProps,
} from 'react-error-boundary';

const formatDate = (date: Date) =>
  `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${String(
    date.getSeconds(),
  ).padStart(2, '0')}.${String(date.getMilliseconds()).padStart(3, '0')}`;

// the delay argument is for faking things out a bit
export type Pokemon = {
  id?: string;
  number: string;
  name: string;
  image: string;
  attacks: {
    special: {
      name: string;
      type: string;
      damage: any;
    }[];
  };
  fetchedAt: string;
};

function fetchPokemon(name: string, delay = 1500) {
  const pokemonQuery = `
    query PokemonInfo($name: String) {
      pokemon(name: $name) {
        id
        number
        name
        image
        attacks {
          special {
            name
            type
            damage
          }
        }
      }
    }
  `;

  return window
    .fetch('https://graphql-pokemon2.vercel.app/', {
      // learn more about this API here: https://graphql-pokemon2.vercel.app/
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        delay: delay,
      } as any,
      body: JSON.stringify({
        query: pokemonQuery,
        variables: {name: name.toLowerCase()},
      }),
    })
    .then(async response => {
      const {data} = await response.json();
      if (response.ok) {
        const pokemon = data?.pokemon;
        if (pokemon) {
          pokemon.fetchedAt = formatDate(new Date());
          return pokemon;
        } else {
          return Promise.reject(
            new Error(`No pokemon with the name "${name}"`),
          );
        }
      } else {
        // handle the graphql errors
        const error = {
          message: data?.errors?.map((e: Error) => e.message).join('\n'),
        };
        return Promise.reject(error);
      }
    });
}

type PokemonInfoFallbackProps = {
  name: string;
};

const PokemonInfoFallback: FC<PokemonInfoFallbackProps> = ({name}) => {
  const initialName = React.useRef(name).current;
  const fallbackPokemonData: Pokemon = {
    name: initialName,
    number: 'XXX',
    image: '/img/pokemon/fallback-pokemon.jpg',
    attacks: {
      special: [
        {name: 'Loading Attack 1', type: 'Type', damage: 'XX'},
        {name: 'Loading Attack 2', type: 'Type', damage: 'XX'},
      ],
    },
    fetchedAt: 'loading...',
  };
  return <PokemonDataView pokemon={fallbackPokemonData} />;
};

type PokemonDataViewProps = {
  pokemon: Pokemon;
};

const PokemonDataView: FC<PokemonDataViewProps> = ({pokemon}) => {
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <section>
        <h2>
          {pokemon.name}
          <sup>{pokemon.number}</sup>
        </h2>
      </section>
      <section>
        <ul>
          {pokemon.attacks.special.map(attack => (
            <li key={attack.name}>
              <label>{attack.name}</label>:{' '}
              <span>
                {attack.damage} <small>({attack.type})</small>
              </span>
            </li>
          ))}
        </ul>
      </section>
      <small className="pokemon-info__fetch-time">{pokemon.fetchedAt}</small>
    </div>
  );
};

type PokemonFormProps = {
  pokemonName: string;
  initialPokemonName?: string;
  onSubmit: (name: string) => void;
};

const PokemonForm: FC<PokemonFormProps> = ({
  pokemonName: externalPokemonName,
  initialPokemonName = externalPokemonName || '',
  onSubmit,
}) => {
  const [pokemonName, setPokemonName] = React.useState(initialPokemonName);

  // this is generally not a great idea. We're synchronizing state when it is
  // normally better to derive it https://kentcdodds.com/blog/dont-sync-state-derive-it
  // however, we're doing things this way to make it easier for the exercises
  // to not have to worry about the logic for this PokemonForm component.
  React.useEffect(() => {
    // note that because it's a string value, if the externalPokemonName
    // is the same as the one we're managing, this will not trigger a re-render
    if (typeof externalPokemonName === 'string') {
      setPokemonName(externalPokemonName);
    }
  }, [externalPokemonName]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPokemonName(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(pokemonName);
  }

  function handleSelect(newPokemonName: string) {
    setPokemonName(newPokemonName);
    onSubmit(newPokemonName);
  }

  return (
    <form onSubmit={handleSubmit} className="pokemon-form">
      <label htmlFor="pokemonName-input">Pokemon Name</label>
      <small>
        Try{' '}
        <button
          className="invisible-button"
          type="button"
          onClick={() => handleSelect('pikachu')}
        >
          "pikachu"
        </button>
        {', '}
        <button
          className="invisible-button"
          type="button"
          onClick={() => handleSelect('charizard')}
        >
          "charizard"
        </button>
        {', or '}
        <button
          className="invisible-button"
          type="button"
          onClick={() => handleSelect('mew')}
        >
          "mew"
        </button>
      </small>
      <div>
        <input
          className="pokemonName-input"
          id="pokemonName-input"
          name="pokemonName"
          placeholder="Pokemon Name..."
          value={pokemonName}
          onChange={handleChange}
        />
        <button type="submit" disabled={!pokemonName.length}>
          Submit
        </button>
      </div>
    </form>
  );
};

const ErrorFallback: React.ComponentType<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error ? error.message : ''}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

const PokemonErrorBoundary = (props: ErrorBoundaryProps) => {
  return <ErrorBoundary FallbackComponent={ErrorFallback} {...props} />;
};

export {
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  fetchPokemon,
  PokemonErrorBoundary,
};
