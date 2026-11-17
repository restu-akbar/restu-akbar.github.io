import { createContext, useContext, useEffect, useState } from "react";
import { bundled, fetchContent } from "./index";

const ContentContext = createContext(bundled);

// Renders immediately with the bundled content, then swaps in live content from
// /api/content when it is available.
export const ContentProvider = ({ children }) => {
  const [data, setData] = useState(bundled);

  useEffect(() => {
    let cancelled = false;
    fetchContent().then((live) => {
      if (live && !cancelled) setData(live);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return <ContentContext.Provider value={data}>{children}</ContentContext.Provider>;
};

export const useContent = () => useContext(ContentContext);
