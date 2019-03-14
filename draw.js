import { each } from 'lodash';
import Cashbox from '../cashbox/cashbox';

const nearestDraw = () => {
    const MONTH = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    const refreshSeconds = ({ minutes, seconds } = {}, timeLink, unit) => {
        let inter;
        let sec = seconds;
        let min = minutes;

        if (min === 0 && sec === 0) {
            if (inter) clearInterval(inter);

            if (timeLink) timeLink.innerHTML = 'Тираж состоялся...';
            unit.classList.add('games__list-unit_nodraw');
            return;
        }

        sec--;
        if (sec === -1) {
            sec = 59;
            min = min - 1;
        }

        const time = (min <= 9 ? '0' + min : min) + ':' + (sec <= 9 ? '0' + sec : sec);

        if (timeLink) timeLink.innerHTML = `через: ${time}`;

        inter = setTimeout(() => refreshSeconds({
            minutes: min,
            seconds: sec,
        }, timeLink, unit), 1000);
    };

    const setDrawInfo = ({ unit, drawBox, nearestDraw, timeToDrawText } = {}) => {
        const drawLink = drawBox.querySelector('.jsListLinkDraw_draw');
        const timeLink = drawBox.querySelector('.jsListLinkDraw_time');
        const { message, timer = false } = timeToDrawText;

        drawLink.innerHTML = nearestDraw;
        timeLink.innerHTML = message;

        unit.classList.remove('games__list-unit_nodraw');

        if (timer) refreshSeconds(timer, timeLink, unit);
    };

    const getConstDate = (date) => {
        const month = date.getMonth();
        const day = date.getDate();

        return `${day} ${MONTH[month]}`;
    };

    const getDrawTimeText = (drawTime, docTimeDiff) => {
        const drawAfterDays = Cashbox.getDayFromMilli(docTimeDiff);

        if (drawAfterDays) {
            return { message: getConstDate(drawTime) };
        } else {
            const drawAfterSeconds = ~~(docTimeDiff / 1000);
            const drawAfterMinutes = ~~(drawAfterSeconds / 60);
            const drawAfterHours = ~~(drawAfterMinutes / 60);

            if (drawAfterHours > 1) return { message: `через: ${drawAfterHours} ч.` };

            const minutes = drawAfterMinutes % 60;

            if (minutes >= 30) return { message: `через: ${minutes} мин.` };

            const seconds = drawAfterSeconds % 60;
            return {
                message: `через: 0${minutes}:${seconds.length === 1 ? '0' + seconds : seconds}`,
                timer: {
                    minutes,
                    seconds,
                },
            };
        }
    };

    const init = () => {
        const gameList = document.querySelector('.games__list');
        if (!gameList) return;

        const gameItems = gameList.querySelectorAll('.games__list-unit');
        const NOW = new Date();

        each(gameItems, (unit) => {
            const drawBox = unit.querySelector('.jsListLinkDraw');
            if (!drawBox) return;

            const nearestDraw = drawBox.getAttribute('data-nearest-draw');
            const nearestDrawTime = drawBox.getAttribute('data-nearest-draw-time');

            if (!(nearestDraw && nearestDrawTime)) return;

            const drawTime = new Date(nearestDrawTime);
            if (!drawTime) return;

            const docTimeDiff = drawTime - NOW;
            if (docTimeDiff < 0) return;

            setDrawInfo({
                unit,
                drawBox,
                nearestDraw,
                timeToDrawText: getDrawTimeText(drawTime, docTimeDiff),
            });
        });
    };

    return Object.freeze({
        init,
    });
};

export default nearestDraw();
