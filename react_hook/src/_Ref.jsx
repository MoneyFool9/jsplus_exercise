// const {
//   useState,
//   useReducer,
//   useRef
// } = React;
import { useRef } from "./useRef";
import { useState } from "./useState";
import { useReducer } from "./useReducer";


export default function _RefFoo() {
  const [count1, setCount] = useReducer((x) => x + 1, 0);
  const [count2, setCount2] = useState(0);

  let ref = useRef(0);
  let inputRef = useRef();

  function handleClick() { 
    ref.current = ref.current + 1;
    // console.log('ref.current:', ref.current);
    alert('You clicked' + ref.current + 'times');
  }
  
  function handleChange() {
    console.log(inputRef.current.value);
  }

  return (
    <div className="border">
      <h1>函数组件</h1>
      <input type="text" ref={inputRef} onChange={handleChange} />
      <button onClick={() => setCount()}>{ count1 }</button>
      <button onClick={() => setCount2(count2 + 1)}>{count2}</button>
      
      <button onClick={handleClick}>click</button>
    </div>
  )
}