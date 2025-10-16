const { Component } = React;

export default class PureComponent extends Component { 
  // 
  shouldComponentUpdate(nextProps, nextState) { 
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
  }
}


/**
 * 浅比较 two objects  (shallow compare)
 *
 * @param {object | null} o1 
 * @param {object | null} o2 
 * @returns {boolean} 
 */
function shallowEqual(o1, o2) {
  if (o1 === o2) return true;

  if (typeof o1 !== 'object' || o1 === null || typeof o2 !== 'object' || o2 === null) {
    return false;
  }

  const keys1 = Object.keys(o1);
  const keys2 = Object.keys(o2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!o2.hasOwnProperty(key) || o1[key] !== o2[key]) {
      return false;
    }
  }

  return true;
}