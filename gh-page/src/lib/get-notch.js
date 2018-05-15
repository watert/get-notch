const notchKeys = {
  bottom: 'paddingBottom',
  top: 'paddingTop',
  left: 'paddingLeft',
  right: 'paddingRight',
};
function eachObject(obj, method) {
  Object.keys(obj).forEach((key, idx) => {
    method(obj[key], key);
  });
}
function mapObject(obj, method) {
  const ret = {};
  eachObject(obj, (val, key) => {
    ret[key] = method(val, key);
  })
  return ret;
}
function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function () {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};
export function supportsEnvNotch() {
  return CSS.supports('padding-bottom: env(safe-area-inset-bottom)');
}
export function supportsConstantNotch() {
  return CSS.supports('padding-bottom: constant(safe-area-inset-bottom)');
}
// export function hasNotch() {
//   return supportsEnvNotch() || supportsConstantNotch();
// }
export function createInvisibleDom() {
  const div = document.createElement('div');
  Object.assign(div.style, {
    position: 'absolute', top: 0, left: 0,
    width: '0px', height: '0px',

    visibility: 'hidden',
    overflow: 'visible',
  });
  return div;
}
export function getNotch() {
  return getDomPaddings(getDom());
}
export function listenNotchChange(method, config = {}) {
  let _before = {};

  const detect = throttle(() => {
    // console.log('detect');
    const notch = getDomPaddings(getDom());
    const changed = (() => {
      if (!_before) return true;
      return 0 !== Object.keys(notch).filter((key) => {
        return notch[key] !== _before[key]
      }).length;
    })();
    // console.log('changed?', changed, _before, notch)
    if (changed) {
      _before = notch;
      method(notch);
    }
  }, config.throttle || 100, {
    trailing: true, leading: true,
  });

  window.addEventListener('scroll', detect);
  window.addEventListener('resize', detect);

  return function unsubscribe() {
    window.removeEventListener('scroll', detect);
    window.removeEventListener('resize', detect);
  }
};

let _dom = null;
export function getDom() {
  if (_dom) return _dom;
  const wrap = createInvisibleDom();
  const div = document.createElement('div');
  div.innerHTML = 'TEST';
  _dom = div;
  const insets = {
    paddingBottom: 'safe-area-inset-bottom',
    paddingTop: 'safe-area-inset-top',
    paddingLeft: 'safe-area-inset-left',
    paddingRight: 'safe-area-inset-right',
  }
  if (supportsEnvNotch()) {
    eachObject(insets, (val, key) => {
      div.style[key] = `env(${val})`;
    })
    // proceed = true;
  } else if (supportsConstantNotch()) {
    // div.style.paddingBottom = 'constant(safe-area-inset-bottom)';
    eachObject(insets, (val, key) => {
      div.style[key] = `constant(${val})`;
    })
    // proceed = true;
  }
  wrap.appendChild(div);
  document.body.appendChild(wrap);
  return div;
}
export function getDomPaddings(dom) {
  return mapObject(notchKeys, (propName) => {
    return parseInt(window.getComputedStyle(dom)[propName]);
  });
  // paddingBottom: parseInt(window.getComputedStyle(this.dom).paddingBottom),  
}

export default getNotch;
// const hasNotch = function () {
//   var proceed = false;
//   var div = document.createElement('div');
//   if (CSS.supports('padding-bottom: env(safe-area-inset-bottom)')) {
//     div.style.paddingBottom = 'env(safe-area-inset-bottom)';
//     proceed = true;
//   } else if (CSS.supports('padding-bottom: constant(safe-area-inset-bottom)')) {
//     div.style.paddingBottom = 'constant(safe-area-inset-bottom)';
//     proceed = true;
//   }
//   if (proceed) {
//     document.body.appendChild(div);
//     let calculatedPadding = parseInt(window.getComputedStyle(div).paddingBottom);
//     document.body.removeChild(div);
//     if (calculatedPadding > 0) {
//       return true;
//     }
//   }
//   return false;
// };


// export default function getNotch() {
//   return hasNotch();
// }