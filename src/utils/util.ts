/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export async function readBodyAsBuffer(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0)
    req.setEncoding(null)
    req.on(
      "data",
      (chunk: string) => (buffer = Buffer.concat([buffer, Buffer.from(chunk)]))
    )
    req.on("end", () => resolve(buffer))
    req.on("error", reject)
  })
}