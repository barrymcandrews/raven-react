import {useEffect, useState} from "react";

export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = useState(window.visualViewport.height);

  useEffect(() => {
    function viewportChanged(event) {
      setViewportHeight(window.visualViewport.height);
    }

    window.visualViewport.addEventListener('resize', viewportChanged);

    // eslint-disable-next-line no-unused-vars
    function cleanup() {
      window.visualViewport.removeEventListener('resize', viewportChanged);
    }
  }, []);

  return {viewportHeight};
}
