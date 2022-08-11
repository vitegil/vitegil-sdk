/**
 * 监视页面加载
 * @param callback 回调函数
 */
export default function (callback: (data?: any) => void) {
  if (document.readyState === "complete") {
    callback();
  } else {
    window.addEventListener("load", callback);
  }
}