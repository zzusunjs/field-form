import type { FieldError } from '../interface';

/**
 * 相当于 promise.all 但是为啥不用 promise.all 呢 ？
 * @param promiseList
 * @returns
 * @reference https://wangdoc.com/javascript/async/promise
 */
export function allPromiseFinish(promiseList: Promise<FieldError>[]): Promise<FieldError[]> {
  // promiseList 中是否有 error 的
  let hasError = false;
  let count = promiseList.length;
  const results: FieldError[] = [];

  // promiseList 为空时直接 resolve
  if (!promiseList.length) {
    return Promise.resolve([]);
  }

  return new Promise((resolve, reject) => {
    promiseList.forEach((promise, index) => {
      // 给每个 promise 都加上 catch 和 then
      promise
        .catch(e => {
          hasError = true;
          return e;
        })
        .then(result => {
          // count 为 promiseList 中还在 pending 状态的
          count -= 1;
          results[index] = result;

          // then 里面写的还是一个函数，函数里面里面直接 return
          if (count > 0) {
            return;
          }

          // 任意一个 hasError 都 reject 掉，不过是到最后一个 promise 结束 pending 状态后才判断
          if (hasError) {
            reject(results);
          }

          // 没有 hasError 的，且 count === 0 的才 resolve
          resolve(results);
        });
    });
  });
}
