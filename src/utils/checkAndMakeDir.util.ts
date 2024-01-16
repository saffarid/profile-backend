import fs from 'fs'

export const checkAndMakeDir = (path: string) => {
  // TODO: (ВОЗМОЖНО) убрать { recursive: true } после того, как станет имплементировано (в py-скрипте) сохранение одним аргументом командной строки
  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true })
  return path
}