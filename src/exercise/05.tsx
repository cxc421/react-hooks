// useRef and useEffect: DOM interaction
// http://localhost:3000/isolated/exercise/05.js

import React, {FC, useEffect, useRef} from 'react';
// eslint-disable-next-line no-unused-vars
import VanillaTilt, {HTMLVanillaTiltElement} from 'vanilla-tilt';

const Tilt: FC = ({children}) => {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tiltNode = (tiltRef.current as unknown) as HTMLVanillaTiltElement;

    VanillaTilt.init(tiltNode, {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    });

    return () => tiltNode.vanillaTilt.destroy();
  }, []);

  return (
    <div className="tilt-root" ref={tiltRef}>
      <div className="tilt-child">{children}</div>
    </div>
  );
};

function App() {
  return (
    <Tilt>
      <div className="totally-centered">vanilla-tilt.js</div>
    </Tilt>
  );
}

export default App;
