let effectDepArrs = [];
let effectIndex = 0;


export function useEffect(cb, depArr) {
  if (typeof cb !== 'function') {
    throw new Error('Callback must be a function');
  }

  if (depArr !== undefined && !Array.isArray(depArr)) { 
    throw new Error('Dependency must be an array or undefined');
  }

  if (depArr === undefined) {
    cb();
  }

  const isChanged = effectDepArrs[effectIndex]
    ? depArr.some((dep, index) => dep !== effectDepArrs[effectIndex][index])
    : true;
  
  isChanged && cb();

  effectDepArrs[effectIndex] = depArr;
  effectIndex++;
}

// 监听render，将effectIndex重置为0
export function resetEffectIndex() {
  effectIndex = 0;
}