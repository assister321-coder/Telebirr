import { useEffect, useState } from "react";

/** Live ticking clock — re-renders every `intervalMs` (default 1s). */
export function useClock(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** "6:27 PM" */
export const clockTime = (d: Date) =>
  d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

/** Greeting driven by the real current hour. */
export function greetingKey(d: Date) {
  const h = d.getHours();
  if (h < 12) return "greet.morning";
  if (h < 18) return "greet.afternoon";
  return "greet.evening";
}
