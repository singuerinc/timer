import { useEffect } from "react";
import { useDarkMode } from "usehooks-ts";

export function useTheme() {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);
}
