import child from 'child_process'

/**
 * Функция определяет поднят сетевой интерфейс
 * @param interfaceName наименование интерфейса
 * @return 'true' если интерфейс поднят
 * */
async function netInterfaceIsUp(interfaceName: string = 'eth0'): Promise<boolean> {
  const operstateCmd = `cat /sys/class/net/${interfaceName}/operstate`
  const promise = new Promise<string>((resolve, reject) => {
    child.exec(operstateCmd, (error, operstateStdout, stderr) => {
      if (error) {//Выполняется если команда не может выполнится
        resolve('Interface is not up.')
      }
      if (stderr) {//Выполняется если команда завершиласть с ошибкой
        resolve('Interface is not up.')
      }
      resolve(operstateStdout.toLowerCase().trim())
    })
  })
  return (await promise) == 'up'
}

export {
  netInterfaceIsUp,
}

