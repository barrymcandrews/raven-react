import {useEffect, useState} from "react";

const getHeight = () => {
  if (window.visualViewport) {
    return window.visualViewport.height;
  } else {
    return window.innerHeight;
  }
}

export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = useState(getHeight);

  useEffect(() => {
    function viewportChanged(event) {
      setViewportHeight(getHeight);
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', viewportChanged);

      // eslint-disable-next-line no-unused-vars
      function cleanup() {
        window.visualViewport.removeEventListener('resize', viewportChanged);
      }
    }
  }, []);

  return {viewportHeight};
}
