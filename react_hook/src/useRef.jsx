const refs = [];
let refIndex = 0;

export function useRef(initialValue) {
  if(!refs[refIndex]) {
    refs[refIndex] = {
      current: initialValue
    };
  }

  const currentRef = refs[refIndex];

  refIndex++;

  return currentRef;
}

export function resetRefIndex() { 
  refIndex = 0;
}