const memoArr = [];
let memoIndex = 0;


export function useMemo(cb, depArr) {
  if (memoArr[memoIndex]) {
    const [_memo, _depArr] = memoArr[memoIndex];
    const isFullySame = depArr.every((dep, index) => dep === _depArr[index]);

    if (isFullySame) {
      memoIndex++;
      return _memo;
    } else {
      return setNewMemo(cb, depArr);
    }
  } else {
    return setNewMemo(cb, depArr);
  }

  function setNewMemo(cb, depArr) {
    const value = cb();
    memoArr[memoIndex++] = [
      value,
      depArr
    ]
    return value;
  }
}

export function resetMemoIndex() {
  memoIndex = 0;
}