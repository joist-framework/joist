export type EffectFn = () => void;

const effects: EffectFn[] = [];

export function effect(cb: EffectFn): () => void {
  const index = effects.push(cb) - 1;

  return () => {
    effects.splice(index, 1);
  };
}
