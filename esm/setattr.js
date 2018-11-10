/* global SVGElement */

import { setStyle } from './setstyle.js';
import { getEl } from './util.js';

const xlinkns = 'http://www.w3.org/1999/xlink';

export const setAttr = (view, arg1, arg2) => {
  const el = getEl(view);
  let isSVG = el instanceof SVGElement;

  let isFunc = typeof arg2 === 'function';

  if (arg2 !== undefined) {
    if (arg1 === 'style') {
      setStyle(el, arg2);
    } else if (isSVG && isFunc) {
      el[arg1] = arg2;
    } else if (arg1 === 'dataset') {
      setData(el, arg2);
    } else if (!isSVG && (arg1 in el || isFunc)) {
      el[arg1] = arg2;
    } else {
      if (isSVG && (arg1 === 'xlink')) {
        setXlink(el, arg2);
        return;
      }
      el.setAttribute(arg1, arg2);
    }
  } else {
    for (const key in arg1) {
      setAttr(el, key, arg1[key]);
    }
  }
};

const setXlink = (el, obj) => {
  for (const key in obj) {
    el.setAttributeNS(xlinkns, key, obj[key]);
  }
}

const setData = (el, obj) => {
  for (const key in obj) {
    el.dataset[key] = obj[key];
  }
}
