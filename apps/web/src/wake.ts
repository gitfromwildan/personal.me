const MOVES = ["pointermove", "pointerdown", "keydown", "scroll"];

/** Runs `fn` once, on the visitor's first move: a pointer, a key or a scroll. */
export function onFirstMove(fn: () => void) {
  const once = () => {
    for (const type of MOVES) removeEventListener(type, once);
    fn();
  };
  for (const type of MOVES) addEventListener(type, once, { passive: true });
}
