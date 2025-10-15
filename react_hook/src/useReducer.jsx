import { useState } from "./useState";

// 派发器思想
// 1. 收集所有操作某一个数据的方案
// 2. 根据不同的操作，执行不同的逻辑
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const newState = reducer(state, action);
    setState(newState);
  }

  return [
    state,
    dispatch
  ]
}