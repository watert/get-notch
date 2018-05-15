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

export function supportsEnvNotch() {
  return CSS.supports('padding-bottom: env(safe-area-inset-bottom)');
}
export function supportsConstantNotch() {
  return CSS.supports('padding-bottom: constant(safe-area-inset-bottom)');
}
export function getDom() {
  var div = document.createElement('div');
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
  document.body.appendChild(div);
  return div;
}
export function getDomPaddings(dom) {
  const hash = {
    bottom: 'paddingBottom',
    top: 'paddingTop',
    left: 'paddingLeft',
    right: 'paddingRight',
  };
  return mapObject(hash, (propName) => {
    return parseInt(window.getComputedStyle(dom)[propName]);
  });
  // paddingBottom: parseInt(window.getComputedStyle(this.dom).paddingBottom),  
}


const hasNotch = function () {
  var proceed = false;
  var div = document.createElement('div');
  if (CSS.supports('padding-bottom: env(safe-area-inset-bottom)')) {
    div.style.paddingBottom = 'env(safe-area-inset-bottom)';
    proceed = true;
  } else if (CSS.supports('padding-bottom: constant(safe-area-inset-bottom)')) {
    div.style.paddingBottom = 'constant(safe-area-inset-bottom)';
    proceed = true;
  }
  if (proceed) {
    document.body.appendChild(div);
    let calculatedPadding = parseInt(window.getComputedStyle(div).paddingBottom);
    document.body.removeChild(div);
    if (calculatedPadding > 0) {
      return true;
    }
  }
  return false;
};


export default function getNotch() {
  return hasNotch();
}