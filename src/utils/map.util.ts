/**
 * Функция пропорционально переносит значение (value)
 * из текущего диапазона значений (fromMin .. fromMax)
 * в новый диапазон (toMin .. toMax), заданный параметрами.
 * */
export const map = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) => {
  return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin
}
