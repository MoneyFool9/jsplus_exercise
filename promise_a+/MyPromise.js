// 手写Promise
/**
 * promise a+规范
 * 1. promise是一个类
 * 2. 构造函数接收一个执行器函数executor，executor立即执行
 * 3. promise有三种状态：pending、fulfilled、rejected
 * 4. promise有一个then方法，then方法接收两个回调函数参数，分别是onFulfilled、onRejected
 * 5. then方法返回一个新的promise对象
 * 6. 当promise状态变为fulfilled时，调用onFulfilled，并将promise的值传递给onFulfilled
 * 7. 当promise状态变为rejected时，调用onRejected，并将promise的reason传递给onRejected
 * 8. 如果onFulfilled或onRejected返回一个值x，则执行resolvePromise函数，解析x
 * 9. 如果onFulfilled或onRejected抛出一个异常e，则执行reject(e)
 * 10. 如果onFulfilled或onRejected不是函数，则忽略它们，并将值传递给下一个then
 * 11. 如果promise的状态已经改变，则不能再改变
 * 12. then方法可以被多次调用
 * 13. 如果在then中返回的是一个promise，则新的promise会跟随这个promise的状态
 * 14. 如果在then中返回的不是一个promise，则新的promise会变为fulfilled，值为返回的值
 * 15. 如果在executor中抛出异常，则promise变为rejected，reason为抛出的异常
 * 16. promise必须是异步执行的，不能在then中同步执行
 * 17. promise必须支持链式调用
 * 18. promise必须支持catch方法，catch方法是then方法的别名，只接收onRejected一个参数
 * 19. promise必须支持finally方法，finally方法接收一个回调函数，无论promise状态如何都会执行
 * 20. finally方法返回一个新的promise，值与原promise相同
 * 21. finally方法中的回调函数不接收任何参数
 * 22. 如果finally中的回调函数返回一个promise，则新的promise会跟随这个promise的状态
 * 23. 如果finally中的回调函数抛出一个异常，则新的promise会变为rejected，reason为抛出的异常
 * 24. 如果finally中的回调函数不是函数，则忽略它
 * 25. promise必须支持静态方法resolve、reject、all、race
 * 26. Promise.resolve(value)返回一个以value为值的fulfilled状态的promise
 * 27. Promise.reject(reason)返回一个以reason为reason的rejected状态的promise
 * 28. Promise.all(iterable)返回一个新的promise，只有当iterable中的所有promise都变为fulfilled时，新的promise才会变为fulfilled，值为所有promise的值组成的数组；如果有一个promise变为rejected，则新的promise会变为rejected，reason为第一个变为rejected的promise的reason
 * 29. Promise.race(iterable)返回一个新的promise，新的promise的状态由第一个变为fulfilled或rejected的promise决定，值或reason为第一个变为fulfilled或rejected的promise的值或reason
 * 30. Promise.allSettled(iterable)返回一个新的promise，新的promise在iterable中的所有promise都变为fulfilled或rejected后变为fulfilled，值为一个对象数组，每个对象表示对应的promise的状态和值或reason
 * 31. Promise.any(iterable)返回一个新的promise，新的promise在iterable中的第一个变为fulfilled的promise变为fulfilled，值为第一个变为fulfilled的promise的值；如果所有promise都变为rejected，则新的promise会变为rejected，reason为一个AggregateError对象，包含所有promise的reason
*/
class MyPromise {
  #state = 'pending';
  #result = undefined;
  #handlers = [];

  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(executor) { 
    const resolve = (data) => {
      this.#changeState(MyPromise.FULFILLED, data)
    }
    const reject = (reason) => {
      this.#changeState(MyPromise.REJECTED, reason)
    }
    try {
      executor(resolve, reject)
    } catch (error) {  // 无法捕获异步错误
      reject(error)
    }
  }

  #changeState(state, result) { 
    if (this.#state !== MyPromise.PENDING) return
    this.#state = state
    this.#result = result
    this.#run()
  }

  #isPromiseLike(value) { 
    return (typeof value === 'object' && value !== null) || typeof value === 'function' && typeof value.then === 'function'
  }

  #runMicroTask(func) {
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(func)
    }
    else if (typeof MutationObserver === 'function') { 
      const ob = new MutationObserver(func)
      const textNode = document.createTextNode('1')
      ob.observe(textNode, { characterData: true })
      textNode.data = '2'
    }
    else if (typeof process === 'object' && typeof process.nextTick === 'function') {
      process.nextTick(func)
    } else {
      setTimeout(func, 0)
    }
  }

  #runOne(callback, resolve, reject) {
    this.#runMicroTask(() => {
      if (typeof callback !== "function") {
			  const settled = this.#state === MyPromise.FULFILLED ? resolve : reject;
        settled(this.#result);
        return;
      }
      try {
        const value = callback(this.#result);
        if (this.#isPromiseLike(value)) {
          value.then(resolve, reject);
        } else {
          resolve(value);
        }
      } catch (error) {
        reject(error);
      }
   })
  }

  #run() {
    if (this.#state === MyPromise.PENDING) return
    while (this.#handlers.length) { 
      const { onFulfilled, onRejected, resolve, reject } = this.#handlers.shift()
      if (this.#state === MyPromise.FULFILLED) {
        this.#runOne(onFulfilled, resolve, reject)
      }
      else if (this.#state === MyPromise.REJECTED) {
        this.#runOne(onRejected, resolve, reject)
      }
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.#handlers.push({ onFulfilled, onRejected, resolve, reject });
      this.#run()
    })
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  finally(onFinally) {
    return this.then(
      (value) => {
        if (typeof onFinally === 'function') {
          return MyPromise.resolve(onFinally()).then(() => value);
        }
        return value;
      },
      (reason) => {
        if (typeof onFinally === 'function') {
          return MyPromise.resolve(onFinally()).then(() => { throw reason; });
        }
        throw reason;
      }
    );
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    let _resolve, _reject;
    const p = new MyPromise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    if(p.#isPromiseLike(value)) {
      value.then(_resolve, _reject);
    } else {
      _resolve(value);
    }
    return p;
  }
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
  static all(promises) {
    let res, rej;
    const p = new MyPromise((resolve, reject) => {
      res = resolve;
      rej = reject;
    });
    let i = 0;
    let fulfilled = 0;
    const result = []
    for (const promise of promises) {
      const index = i;
      i++;
      MyPromise.resolve(promise).then((data) => {
        // 1. 完成的数据汇总到最终结果
        result[index] = data;
        // 2. 判断是否全部完成
        fulfilled++;
        if (fulfilled === i) {
          res(result);
        }
      }, rej)
    }
    if (i === 0) {
      res([]);
    }
    return p;
  }
}




// const p = new Promise((resolve, reject) => { 
//   resolve(1);
// })

// p.then((value) => {
//   console.log(value);
// })

MyPromise.resolve(1112222).then((data) => {
  console.log(data);
})

const proms = [1, 2, new Promise((res) => res(3)), MyPromise.resolve(4)];

MyPromise.all(proms).then((data) => {
  console.log(data);
})