// Hook flow
// https://github.com/donavon/hook-flow
// http://localhost:3000/isolated/examples/hook-flow.js

// 1. 注意, Parent render 完後, Child 才開始 render
// 2. 注意, 同一Component 中 所有上一輪的 effect 都 chelan up 後, 才會依序執行新一輪的 effect
// ex: [Mount] Parent Init => Parent Render => Child Init => Child Render => Child Effect => Parent Effect
// ex: [Update] Parent Render => Child Render => Child Clean Effect => Child Effect => Parent Clean Effect => Parent Effect
// ex: [Unmount] Parent Render => Child Clen Effect => Parent Clean Effect => Parent Effect

import React from 'react';

function Child() {
  console.log('%c    Child: render start', 'color: MediumSpringGreen');

  const [count, setCount] = React.useState(() => {
    console.log('%c    Child: useState(() => 0)', 'color: tomato');
    return 0;
  });

  React.useEffect(() => {
    console.log('%c    Child: useEffect(() => {})', 'color: LightCoral');
    return () => {
      console.log(
        '%c    Child: useEffect(() => {}) cleanup 🧹',
        'color: LightCoral',
      );
    };
  });

  React.useEffect(() => {
    console.log(
      '%c    Child: useEffect(() => {}, [])',
      'color: MediumTurquoise',
    );
    return () => {
      console.log(
        '%c    Child: useEffect(() => {}, []) cleanup 🧹',
        'color: MediumTurquoise',
      );
    };
  }, []);

  React.useEffect(() => {
    console.log('%c    Child: useEffect(() => {}, [count])', 'color: HotPink');
    return () => {
      console.log(
        '%c    Child: useEffect(() => {}, [count]) cleanup 🧹',
        'color: HotPink',
      );
    };
  }, [count]);

  const element = (
    <button onClick={() => setCount(previousCount => previousCount + 1)}>
      {count}
    </button>
  );

  console.log('%c    Child: render end', 'color: MediumSpringGreen');

  return element;
}

function App() {
  console.log('%cApp: render start', 'color: MediumSpringGreen');

  const [showChild, setShowChild] = React.useState(() => {
    console.log('%cApp: useState(() => false)', 'color: tomato');
    return false;
  });

  React.useEffect(() => {
    console.log('%cApp: useEffect(() => {})', 'color: LightCoral');
    return () => {
      console.log('%cApp: useEffect(() => {}) cleanup 🧹', 'color: LightCoral');
    };
  });

  React.useEffect(() => {
    console.log('%cApp: useEffect(() => {}, [])', 'color: MediumTurquoise');
    return () => {
      console.log(
        '%cApp: useEffect(() => {}, []) cleanup 🧹',
        'color: MediumTurquoise',
      );
    };
  }, []);

  React.useEffect(() => {
    console.log('%cApp: useEffect(() => {}, [showChild])', 'color: HotPink');
    return () => {
      console.log(
        '%cApp: useEffect(() => {}, [showChild]) cleanup 🧹',
        'color: HotPink',
      );
    };
  }, [showChild]);

  const element = (
    <>
      <label>
        <input
          type="checkbox"
          checked={showChild}
          onChange={e => setShowChild(e.target.checked)}
        />{' '}
        show child
      </label>
      <div
        style={{
          padding: 10,
          margin: 10,
          height: 50,
          width: 50,
          border: 'solid',
        }}
      >
        {showChild ? <Child /> : null}
      </div>
    </>
  );

  console.log('%cApp: render end', 'color: MediumSpringGreen');

  return element;
}

export default App;
