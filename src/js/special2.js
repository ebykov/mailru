import '../css/special.styl';

import BaseSpecial from './base';
import Data from './data';
import Svg from './svg';
import * as Share from './lib/share';
import * as Analytics from './lib/analytics';
import { makeElement } from './lib/dom';

const CSS = {
    main: 'specialContainer',
};

class Special extends BaseSpecial {
    constructor(params = {}) {
        super();

        Object.assign(this.params, params);
        this.saveParams();

        if (Data && params.data) {
            Object.assign(Data, params.data);
        }

        if (this.params.css) {
            this.loadStyles(this.params.css).then(() => this.init());
        }
    }

    init() {
        /** Демонстрация */
        this.container.classList.add(CSS.main);
        this.container.textContent = Data.title;
        this.container.innerHTML += Svg.demo;
        this.container.appendChild(this.demoButton());
        this.container.appendChild(this.demoInput());

        Share.make(this.container, this.params.share);
    }

    /**
     * Код ниже не нужен, просто пара примеров
     */

    /**
     * Клики слушаются чаще всего. Просто добавляем атрибут data-click с названием функции-обработчика
     */
    demoButton() {
        return makeElement('button', CSS.main + '__button', {
            type: 'button',
            textContent: 'Кнопка',
            data: {
                click: 'demoClickHandler'
            }
        });
    }

    demoClickHandler(el, event) {
        console.log('Click on element', el);

        /**
         * Так отправляются события в аналитику, но обычно они прописываются в конце,
         * когда понятно, какие вообще данные будут полезны
         */
        Analytics.sendEvent('Button', 'Click');
    }

    /**
     * Инпуты реже, но тут та же логика — атрибут data-input.
     * По идее такое работает со всеми событиями, но я не проверял.
     * Для keydown лучше писать свой listener
     */
    demoInput() {
        return makeElement('input', CSS.main + '__input', {
            type: 'text',
            placeholder: 'Поле ввода',
            data: {
                input: 'demoInputWatcher'
            }
        });
    }

    demoInputWatcher(el, event) {
        console.log('Input value:', el.value);
    }
}

export default Special;