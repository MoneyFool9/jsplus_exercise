const callbackArr = [];
let callbackIndex = 0;

export function useCallback(cb, depArr) {
  if (callbackArr[callbackIndex]) {
    const [_callback, _depArr] = callbackArr[callbackIndex];
    const isFullySame = depArr.every((dep, index) => dep === _depArr[index]);

    if (isFullySame) {
      callbackIndex++;
      return _callback;
    } else {
      return setNewCallback(cb, depArr);
    }
  } else {
    return setNewCallback(cb, depArr);
  }

  function setNewCallback(cb, depArr) {
    callbackArr[callbackIndex++] = [
      cb,
      depArr
    ]
    return cb;
  }
}

export function resetCallbackIndex() {
  callbackIndex = 0;
}