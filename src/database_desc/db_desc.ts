import {IColumn, IForeignKey, ITable, IDbDesc} from "../modules/database-wrapper/src/interfaces/interfaces";
import {DbDesc} from "../modules/database-wrapper/src/sqlite/DbDesc";
import {Column} from "../modules/database-wrapper/src/sqlite/Column";

const dbDesc = new DbDesc({
  acl: <ITable>{
    tableName: "acl",
    columns: [
      new Column('id', 'TEXT', true, false, false),
      new Column('groupname', 'TEXT', false, true, true),
      new Column('exec', 'TEXT', false, true, false),
      new Column('read', 'TEXT', false, true, false),
      new Column('write', 'TEXT', false, true, false),
    ],
    default: [
      {
        groupname: 'admin',
        exec: ['users'].join(),
        read: ['users'].join(),
        write: ['users'].join(),
      },
      {
        groupname: 'user',
        exec: [].join(),
        read: ['portfolio'].join(),
        write: [].join(),
      },
      {
        groupname: 'guest',
        exec: [].join(),
        read: ['portfolio'].join(),
        write: [].join(),
      },
    ]
  },
  users: <ITable>{
    tableName: "users",
    columns: [
      new Column('id', 'TEXT', true, false, false),
      new Column('username', 'TEXT', false, true, true),
      new Column('password', 'TEXT', false, true, false),
      new Column('acl', 'TEXT', false, true, false, <IForeignKey>{foreignTable: 'acl', foreignColumn: 'id'}),
    ],
    default: [
      {
        username: 'admin',
        password: 'admin',
        acl: {groupname: 'admin'}
      },
    ]
  },
  portfolio: <ITable>{
    tableName: 'drags',
    columns: [
      new Column('id', 'INTEGER', true, false, false),
      new Column('title', 'TEXT', false, false, false),
      new Column('desc', 'TEXT', false, false, false),
    ],
    default: [
      {
        title: 'SPA стоечного оборудования',
        desc: `<span>Web-приложения для таких стоечных устройств как:</span>
                        <ul>
                            <li>Устройство контроля климата CCU;</li>
                            <li>Устройство автоматического ввода резерва ATS;</li>
                            <li>Устройство распределения питания iPDU.</li>
                        </ul>
                        <span>При разработке каждого приложения основной целью ставилось быстрое 
                        и лёгкое понимание оператором текущего состояния оборудования.</span>
                         <br/>
                         <span>Для ускорения разработки новых устройств основные компоненты были выделены в 4 библиотеки:</span>
                         <ul>
                            <li>Компоненты-узлы (кнопки, поля ввода, комбобоксы, переключатели и т.д.);</li>
                            <li>Компоненты-контейнеры;</li>
                            <li>Виджеты - компоненты для лёгкого анализа показателей;</li>
                            <li>Общая составляющая приложения.</li>
                        </ul>`
      },
      {
        title: 'Axelrod',
        desc: `<span>Web-приложение  для автомитизированной торговли биржевыми активами с использованием Tinkoff Invest API.
                        Основные цели - переложить отслеживание графика с человека на алгоритм и исключить эмоциональную составляющую при выставлении заявок.
                        Приложение позволяет совершить только 3 основных функции:
                        </span>
                        <ul>
                            <li>Добавить ценную бумагу на отслеживание;</li>
                            <li>Изменить конфигурацию для отслеживания;</li>
                            <li>Прекратить отслеживать ценную бумагу.</li>
                        </ul>
                        <span>Разработывалось исключительно для личного пользования.</span>
                        <span>Реализация:</span>
                        <ul>
                            <li>Backend - FastApi;</li>
                            <li>Frontend - Vue3.</li>
                        </ul>`,
      }
    ]
  }
})

export {dbDesc}