export function padZero(str: string | number, len = 2) {
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}
