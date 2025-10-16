const {
  useState,
  useReducer,
  useEffect
} = React;

// import { useEffect } from "./useEffect";
// import { useState } from "./useState";
// import { useReducer } from "./useReducer";
import Optimazation from "./optimazation";
/**
 *  data => state
 *  React => view library
 *  
 *  view => update => 视图上的变化
 * 
 *  view  <=>  视图
 * 
 *  useState()  ==> state, setState
 * 
 *  react => 运行时行为
 *  view = f(state)   函数是一等公民
 *  vue => 编译时行为
 * 
 *  useReducer() ==> state, dispatch
 *  多种操作方案，每一种方案可能有很多地方都需要使用
 *  useReducer就是可以收集所有操作某一个数据的方案
 */

export default function App() {
  const [state, setState] = useState(0);

  // dispatch 状态派发
  const [count, dispatch] = useReducer(countReducer, 0);

  function countReducer(count, { type, payload }) {
    switch (type) {
      case 'PLUS':
        return count + payload;
      case 'MINUS': 
        return count - payload;
      case 'MUL': 
        return count * payload;
      case 'DIV':
        return count / payload;
      default:
        return count;
    }
  }

  /**
   *  如果第二次参数undefined, 每次render都会执行 == 组件更新
   *  如果第二次参数是[], 只会在第一次render执行  == componentDidMount
   *  如果第二次参数是[xxx, yyy], 只有在xxx或者yyy变化的时候才会执行 == componentDidUpdate
   *  
   */
  useEffect(() => {
    console.log('每次render都会执行');
  })

  useEffect(() => {
    console.log('只会在第一次render执行');
  }, [])

  useEffect(() => {
    console.log('只有在state或者count变化的时候才会执行');

    // 清除副作用逻辑
    return () => {
      console.log('组件卸载，或者下一次执行effect之前会执行');
    }
  }, [state, count])

  let t = null;
  useEffect(() => {
    console.log('UseEffect');

    t = setInterval(() => {
      console.log('定时器');
      setState(s => s + 1)
    }, 1000)

    return () => {
      clearInterval(t);
      t = null;
      console.log('清除定时器');
    }
  }, [])

  // const OptimazationMemo = React.memo(Optimazation);

  return (
		<>
			<h1>{state}</h1>
			<h1>{count}</h1>
			{/* <button onClick={() => setState(state + 1)}>+</button> */}

			<div className="button-group">
				<button onClick={() => dispatch({ type: "PLUS", payload: 1 })}>
					+
				</button>
				<button onClick={() => dispatch({ type: "MINUS", payload: 1 })}>
					-
				</button>
				<button onClick={() => dispatch({ type: "MUL", payload: 2 })}>
					*
				</button>
				<button onClick={() => dispatch({ type: "DIV", payload: 2 })}>
					/
				</button>
			</div>

			<Optimazation />
		</>
  );
}
