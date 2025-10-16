const {
  useState,
  memo,
  useMemo
} = React;

/**
 * memo核心会对引用进行比较，这种比较是浅比较
 * childData引用，每次父组件更新都会重新创建一个新的对象引用
 * 解决方案：
 *   使用 useMemo 对对象进行缓存
 */
export default function Optimazation() { 
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  // Child 组件每次父组件更新都会重新渲染
  // Child 组件不依赖 count1, 但是每次 count1 更新，Child 组件也会更新，相反，count1不更新，组件就没必要再渲染
  const Child = memo((props) => {
    console.log('Child render');
    return (
		<>
			<h1>count2: {props.childData.count2}</h1>
			<button onClick={props.setCount2}>count2 +</button>
		</>
	);
  })

  // const childData = { count2: count2 };
  // useMemo只有在依赖变化的时候才会重新计算赋值引用
  const childData = useMemo(() => ({ count2 }), [count2]);
  const doubleCount1 = useMemo(() => count1 * 2, [count1]);

  const cbSetCount2 = useCallback(() => setCount2(count2 + 1), []);  

  return (
    <>
      <h1>{count1}</h1>
      <h1>{doubleCount1}</h1>
      <button onClick={() => setCount1(count1 + 1)}>count1 +</button>
      <Child childData={childData} setCount2={cbSetCount2} />
    </>
  )
}