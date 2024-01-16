import {
  EModbusFunctions,
  EEquipmentTypes,
  ESensorsTypes,
  EScriptManagerStatus,
  ETasks
} from './../modules/smart-greenhouse-constants/src/enums/enums'

export {EEquipmentTypes as EquipmentTypes}
export {EModbusFunctions as ModbusFunctions}
export {ESensorsTypes as SensorsTypes}
export {EScriptManagerStatus as ScriptManagerStatus}
export {ETasks}

/** Список уровней логирования */
export enum logLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Список событий генерируемых приложением
 * */
export enum eventNames {
  HANDLE_ERROR = 'handle_error',
  NEW_SENSORS_DATA = 'new_sensors_data',
  NEW_VIDEO_FILES = 'new_video_files',
  CONFIG_CHANGE = 'config_change',
  STAGE_SCRIPT_CHANGE = 'stage_script_change'
}



