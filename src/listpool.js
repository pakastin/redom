import { isFunction, getEl, isConstructor } from './util';

const propKey = key => item => item[key];

export const listPool = (View, key, initData) => {
  return new ListPool(View, key, initData);
};

export class ListPool {
  constructor (View, key, initData) {
    this.View = View;
    this.initData = initData;
    this.oldLookup = {};
    this.lookup = {};
    this.oldViews = [];
    this.views = [];

    if (key != null) {
      this.lookup = {};
      this.key = isFunction(key) ? key : propKey(key);
    }
  }
  update (data, context) {
    const { View, key, initData } = this;
    const keySet = key != null;

    const oldLookup = this.lookup;
    const newLookup = {};

    const newViews = new Array(data.length);
    const oldViews = this.views;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      let view;

      if (keySet) {
        const id = key(item);
        view = oldLookup[id] || (isConstructor(View) ? new View(initData, item, i, data) : View(initData, item, i, data));
        newLookup[id] = view;
        view.__redom_id = id;
      } else {
        view = oldViews[i] || (isConstructor(View) ? new View(initData, item, i, data) : View(initData, item, i, data));
      }
      view.update && view.update(item, i, data, context);

      let el = getEl(view.el);
      el.__redom_view = view;
      newViews[i] = view;
    }

    this.oldViews = oldViews;
    this.views = newViews;

    this.oldLookup = oldLookup;
    this.lookup = newLookup;
  }
}
