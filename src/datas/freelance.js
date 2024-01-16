module.exports = {
    f: {
        profile: {
            desc: 'Добрый день! Меня зовут Павлов Никита.\n' +
                'Занимаюсь разработкой сайтов с 2019 года.',
            features: [
                'Всегда на связи',
                'Готов начать сейчас',
                'Ваша работа будет доведена до конца',
                'Выделенный IP-адрес, на котором вы можете отслеживать ход выполнения работ'
            ]
        },
        competence: {
            competencies: [
                'HTML, CSS, JavaScript',
                'Vue',
                'Angular',
                'Java',
            ],
        },
        portfolio: {
            thoth: {
                title: 'Thoth',
                desc: `<span>Desktop-приложение для ведения учета имеющихся продуктов и места их хранения.
                    Приложение позволяет заносить заказы-покупки и оповещать в день их прихода.
                    В переспективе отслеживание заказов от клиентов и учет доходов/расходов</span>`,
            },
            letters: {
                title: 'Письма для рассылки',
                desc: `<span>Рассылка писем — один из эффективных способов общения с клиентами. Она позволит почти
                    без вложений оповещать аудиторию обо всем, что происходит в компании — о новинках, акциях,
                    распродажах. А ещё это отличный способ напомнить о себе старым клиентам.</span>`
            },
            web_devices: {
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
                        </ul>
                         <br/>
                         <span>В настоящее время приложение переводится на базу OpenWRT с использованием TypeScript.</span>`
            },
            nadoumchik: {
                title: '#Надоумчик',
                desc: `<span>
                        Сайт дзен-канала <a class="l" href="https://dzen.ru/nadoumchik" target="_blank" style="color: #759fff;">Надоумчик</a> .
                        К сожалению у автора не нашлось времени на написание новых публикаций и со временем сайт прекратил свою работу.
                        На данный момент крутиться на моём персональном сервере с некоторомы публикациями с дзен-канала.
                        Рельзован с использованием:
                        </span>
                        <ul>
                            <li>Node.js;</li>
                            <li>Vue.js;</li>
                            <li>Express;</li>
                            <li>MongoDB.</li>
                        </ul>`,
            },
            github_test: {
                title: 'Поиск репозиториев на github, с использованием GraphQL api.',
                desc: `<span>
                        Основано на тестовом задании.
                        Выполняет поиск репозиториев на github.
                        Рельзован с использованием:
                        </span>
                        <ul>
                            <li>Node.js;</li>
                            <li>React/Redux;</li>
                            <li>Express;</li>
                        </ul>
                        <span>Примечание: авторизация осуществляется токеном github. Можете указывать любой свой токен. Он передается только между страницами в url и на api.github в header.</span>
                        `,
            },
            axelrod: {
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
                            <li>Backend - django;</li>
                            <li>Frontend - vue.js.</li>
                        </ul>`,
            },
        },
        contact: {
            mail: {
                text: 'PAVLOV.NIKITA@MAIL.RU',
                imgUrl: 'SvgMail',
                href: 'pavlov.nikita@mail.ru',
            },
            telegram: {
                text: 'TELEGRAM',
                imgUrl: 'SvgTelegram',
                href: 'https://t.me/saffarid',
            },
            vk: {
                text: 'VKONTAKTE',
                imgUrl: 'SvgVk',
                href: 'https://vk.com/id5690462',
            },
            whatsapp: {
                text: 'WHATSAPP',
                imgUrl: 'SvgWhatsApp',
                href: 'https://wa.me/79193690010',
            },
            github: {
                text: 'GitHub',
                imgUrl: 'SvgGitHub',
                href: 'https://github.com/saffarid',
            }
        },
    },
}