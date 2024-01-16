/**
 * Функция проверяет является аргумент объектом
 * */
export const isObject: (arg: any) => boolean = (arg: any) => {
  return arg === Object(arg)
}