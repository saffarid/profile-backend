const schemas = {

}

const accessRights = {
   ReadOnly: 'Read Only',
   ReadWrite: 'Read/Write',
   NotAllow: 'Not allow',
}

const collectionsName = {

}

module.exports = {
   /**
    * Основные действия с БД
    * */
   ACTS: {
      /**
       * Действие вставки в БД
       * */
      insert: 'insert',
      /**
       * Действие удаления из БД
       * */
      remove: 'remove',
      /**
       * Дейсвие выборки из БД
       * */
      select: 'select',
      /**
       * Действие обновления в БД
       * */
      update: 'update'
   },
   /**
    * Права доступа к контенту
    * */
   ACCESS_RIGHTS: accessRights,
   /**
    * Заготовки тел заросов
    * */
   BODY_REQUEST: {
      termsSampling: {
         shift: 0,
         count: 0
      }
   },
   /**
    * Тело ответа
    * */
   BODY_RESPONSE: {
      /**
       * Код ответа
       * */
      responseCode: -1,
      /**
       * Сообщение
       * */
      message: '',
      /**
       * Передаваемые данные
       * */
      datas: {
         /**
          * Найденные, по запросу, документы
          * */
         findings: [],
         /**
          * Флаг наличия ещё не прочитанных документов
          * */
         thereIsMore: false
      }
   },
   /**
    * Коды ответов
    * */
   CODES_RESPONSE: {
      ok: {
         responseCode: 200,
         message: "Хорошо"
      },
      created: {
         responseCode: 201,
         message: "Создано"
      },
      updated: {
         responseCode: 202,
         message: "Обновлено"
      },
      removed: {
         responseCode: 203,
         message: "Удалено"
      },
      noContent: {
         responseCode: 204,
         message: "Нет контента"
      },
      alreadyReported: {
         responseCode: 208,
         message: "Уже сообщалось"
      },
      badRequest: {
         responseCode: 400,
         message: "Некорректный запрос"
      },
      unauthorized: {
         responseCode: 401,
         message: "Не авторизован"
      },
      notFound: {
         responseCode: 404,
         message: "Не найдено"
      },
   },
   /**
    * Объект описание БД
    * */
   DATABASE: {
      /**
       * Наименование БД
       * */
      name: '',
      /**
       * Коллеции БД
       * */
      collections: {

      },
   },

   /**
    * Сущности с которыми проводятся взаимодействия
    * */
   ESSENCE: {
      freelance:{
         name: 'freelance',
         actions:{
            get: 'get'
         }
      }
   },

   NEW_OBJECTS: {

   },
   /**
    * Модель запросов
    * */
   MODEL_REQUESTS: {
      /**
       * Функция формирует адрес запроса к БД.
       * Входные параметры рекомендуется брать из соответствущих разделов api
       * @param collection {String} Наиенование коллекции
       * @param action {String} Выполняемый запрос к БД
       * */
      db: (collection, action) => {
         return `/db/${collection}/${action}`
      },
      /**
       * Функция формирует адрес запроса к серверу для работы с сущностью.
       * Входные параметры рекомендуется брать из соответствущих разделов api
       * @param essence {String} Наиенование коллекции
       * @param action {String} Выполняемый запрос к БД
       * */
      work_e: (essence, action) => {
         return `/work/${essence}/${action}`
      },
   },
}