import { ensureEl, isConstructor, isFunction } from './util';
import { setChildren } from './setchildren';

export const router = (parent, Views, initData) => {
  return new Router(parent, Views, initData);
};

export class Router {
  constructor (parent, Views, initData) {
    this.el = ensureEl(parent);
    this.Views = Views;
    this.initData = initData;
  }
  update (route, data) {
    if (route !== this.route) {
      const Views = this.Views;
      const View = Views[route];

      this.route = route;
      this.view = isConstructor(View) ? new View(this.initData, data) : (isFunction(View) ? View(this.initData, data) : View);

      setChildren(this.el, [ this.view ]);
    }
    this.view && this.view.update && this.view.update(data, route);
  }
}
