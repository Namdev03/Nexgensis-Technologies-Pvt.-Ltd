import { useEffect, useState } from "react";

// Returns a debounced copy of `value` that only updates once the caller has
// stopped changing `value` for `delay` ms. Used so we don't fire a network
// request on every keystroke while the user is still typing.
export default function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
