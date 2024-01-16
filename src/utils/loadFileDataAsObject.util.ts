import fs from 'node:fs'
import { checkAbsolutePath } from './index'

/**
 * Функция загружает данные из файла в виде объекта
 * @param directoryPath - путь до директории с файлом
 * @param file - название файла
 */
export const loadFileDataAsObject = (directoryPath: string, file: string): any => {
  const path = checkAbsolutePath(`${directoryPath}/${file}`)
  return fs.existsSync(path) && fs.statSync(path).size != 0 ? JSON.parse(fs.readFileSync(path).toString()) : null
}
