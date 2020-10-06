// useRef and useEffect: DOM interaction
// http://localhost:3000/isolated/exercise/05-classes.js

import React, {FC, useEffect, useRef} from 'react';
import VanillaTilt, {HTMLVanillaTiltElement} from 'vanilla-tilt';

const Tilt: FC = ({children}) => {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tiltNode = (tiltRef.current as unknown) as HTMLVanillaTiltElement;
    const vanillaTiltOptions = {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    };
    VanillaTilt.init(tiltNode, vanillaTiltOptions);
    return () => tiltNode.vanillaTilt.destroy();
  }, []);
  return (
    <div ref={tiltRef} className="tilt-root">
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
