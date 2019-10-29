export function find<E extends HTMLElement>(id: string): E | null {
  return document.getElementById(id) as E;
}

export function pick<E extends Element = Element>(selector: string): E | null {
  return document.querySelector(selector);
}

export function div(inner: string, className?: string, id?: string): HTMLDivElement {
  const elm = document.createElement('div');
  if (className) {
    elm.setAttribute('class', className);
  }
  if (id) {
    elm.setAttribute('id', id);
  }
  elm.innerHTML = inner;
  return elm;
}
