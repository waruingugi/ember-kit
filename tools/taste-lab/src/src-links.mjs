// Source links for the "Taken from" chips.
export const sh = (n, label) => [label || `shadcn/ui ${n}`, `https://ui.shadcn.com/docs/components/${n}`];
export const be = (n, label) => [label || `beUI ${n}`, `https://beui.dev/components/motion/${n}`];
export const ez = (n, label) => [label || `easyui ${n}`, `https://easyui.site/components/${n}`];
export const arc = (n, label) => [label || `Arc ${n}`, `https://uiarc.dev/components/${n}`];
export const radix = (n) => [`Radix ${n}`, `https://www.radix-ui.com/primitives/docs/components/${n}`];
export const house = (id) => [`House part ${id}`, `../../components/showcase/index.html#${id}`];
export const skill = (n) => [`${n} skill`, null];
export const orbs = ['thinking-orbs', 'https://libraries.dev/orbs'];
export const law = {
  fitts: 'Fitts', hick: 'Hick', jakob: 'Jakob', prox: 'proximity',
};
