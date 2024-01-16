import path from 'path'

/**
 * Функция проверяет путь полученный в аргументе.
 * Если путь абсолютный, функция возвращает его, иначе добавляет текущую рабочую директорию.
 * */
export const checkAbsolutePath = (_path: string) => path.isAbsolute(_path) ? _path : path.join(process.cwd(), _path)