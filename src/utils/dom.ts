export function find(id: string): HTMLElement | null {
  return document.getElementById(id);
}

export function pick<E extends Element = Element>(selector: string): E | null {
  return document.querySelector(selector);
}

export function div(inner: string, className?: string): HTMLDivElement {
  const elm = document.createElement('div');
  if (className) {
    elm.setAttribute('class', className);
  }
  elm.innerHTML = inner;
  return elm;
}
