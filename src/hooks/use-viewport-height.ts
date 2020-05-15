import {useEffect, useState} from "react";

interface VisualViewportWindow extends Window {
  visualViewport?: any;
}

declare var window: VisualViewportWindow;

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
    function viewportChanged(event: any) {
      setViewportHeight(getHeight);
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', viewportChanged);

      return () => {
        window.visualViewport.removeEventListener('resize', viewportChanged);
      }
    }
  }, []);

  return {viewportHeight};
}
