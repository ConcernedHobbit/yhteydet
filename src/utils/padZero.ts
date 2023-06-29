/**
 * Left-pads a string or number with provided amount of zeroes
 * @param str String or number to be zero-padded.
 * @param len Length of the zero pad. @default 2
 * @returns `str` with added left pad
 * @credit https://stackoverflow.com/a/35970186
 */
export function padZero(str: string | number, len = 2) {
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}
