import { Constants } from "../pages/ConstantDefinitions"

export const formatNum = (num: number): string => {
  return num.toLocaleString(
    Constants.CURRENCY_LANGUAGE,
    Constants.CURRENCY_SETTINGS
  )
}

export const setIntersection = <Type>(a: Set<Type> | Array<Type>, b: Set<Type> | Array<Type>): Array<Type> => {
  const arrA = Array.isArray(a) ? a : Array.from(a)  
  const setB = Array.isArray(b) ? new Set(b) : b
  return arrA.filter(x => setB.has(x))
}

export const modify = (obj: Record<string, unknown>, newObj: Record<string, unknown>): void => {
  Object.keys(obj).forEach(function (key) {
    delete obj[key];
  });

  Object.keys(newObj).forEach(function (key) {
    obj[key] = newObj[key];
  });
}

export class UnexpectedError extends Error {
  constructor(m: string) {
    super(m + "\nThis shouldn't happen -- please try to replicate the error then report to the devs. Thank you!");
  }
}

export const isNumeric = (str: string): boolean => {
  if (typeof str != "string") return false // we only process strings!  
  // @ts-expect-error https://stackoverflow.com/a/175787
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

type Rect = {x: number, y: number, height: number, width: number}
export const doRectsCollide = (a: Rect, b: Rect): boolean => {
  return !(
      ((a.y + a.height) < (b.y)) ||
      (a.y > (b.y + b.height)) ||
      ((a.x + a.width) < b.x) ||
      (a.x > (b.x + b.width))
  );
}