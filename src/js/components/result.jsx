import { h, render, Component } from 'preact';
import { Provider, connect } from 'preact-redux';
import * as Share from '../lib/share';
import Data from  '../data';
import Svg from '../svg';
import store from "../store";
import request from "../lib/request";
import PerfectScrollbar from 'perfect-scrollbar';
import * as Analytics from "../lib/analytics";

const osnova = {
  isAuthorised: window.osnova_isAuthorised ? window.osnova_isAuthorised : () => { console.log('isAuthorised()') },
  showAuth: window.osnova_showAuth ? window.osnova_showAuth : () => { console.log('showAuth()') },
  whenUserDataChanged: window.osnova_whenUserDataChanged ? window.osnova_whenUserDataChanged : () => { console.log('whenUserDataChanged()') },
};

class Gifts extends Component {
  constructor(props) {
    super(props);

    this.getGift = this.getGift.bind(this);
  }

  getGift(type) {
    Analytics.sendEvent(`Get Gift - ${type}`);

    if (!osnova.isAuthorised()) {
      osnova.showAuth();
      return;
    }

    request(`/special/mailru/getGift?type=${type}`).then(
      resp => {
        resp = JSON.parse(resp);

        if (resp.rc === 401) {
          osnova.showAuth();
        } else if (resp.rc === 200) {
          this.setState({
            gift: resp.data || {}
          });
        }
      },
      error => { console.log(error); }
    );
  }

  render(props, state) {
    const getBottom = () => {
      if (state.gift) {
        if (state.gift.type) {
          return (
            <div class="mailru-result__bottom mailru-gift">
              <div class="mailru-gift__title">{state.gift.type === 'delivery' ? '-40% на Delivery Club' : '-15% на 5 поездок в «Ситимобил»'}</div>,
              <div className="mailru-gift__gift">{state.gift.gift}</div>
            </div>
          );
        } else {
          return (
            <div class="mailru-result__bottom mailru-gift">
              <div class="mailru-gift__title">Упс.</div>
              <div className="mailru-gift__text">
                <p>Промокоды кончились ровно в тот момент, когда вы проходили тест.</p>
                <p>Мы предусмотрели эту возможность, поэтому вы видите этот текст. Простите, что так вышло. Вы все равно молодец!</p>
              </div>
            </div>
          );
        }
      } else if (props.test.correctAnswers >= 13) {
        if (props.test.checkGifts.gift) {
          return (
            <div class="mailru-result__bottom mailru-gift">
              <div class="mailru-gift__title">{props.test.checkGifts.gift.type === 'delivery' ? '-40% на Delivery Club' : '-15% на 5 поездок в «Ситимобил»'}</div>
              <div className="mailru-gift__gift">{props.test.checkGifts.gift.gift}</div>
            </div>
          );
        } else if (props.test.checkGifts.delivery || props.test.checkGifts.citymobil) {
          return (
            <div class="mailru-result__bottom mailru-gift">
              <div class="mailru-gift__title">А еще вы заслужили один из подарков:</div>
              <div class="mailru-gift__gifts">
                {
                  props.test.checkGifts.delivery ?
                    <div class="mailru-gift__btn mailru-gift__btn--delivery" onClick={() => this.getGift('delivery')}>
                      <span>-40% на Delivery&nbsp;Club</span>
                    </div>
                    :
                    <div class="mailru-gift__btn">
                      <span>Тут были промокоды на Delivery Club, но их разобрали</span>
                    </div>
                }
                {
                  props.test.checkGifts.citymobil ?
                    <div class="mailru-gift__btn mailru-gift__btn--citymobil" onClick={() => this.getGift('citymobil')}>
                      <span>-15% на 5 поездок в&nbsp;«Ситимобил»*</span>
                      <div class="mailru-gift__btn-hint">* только в Москве</div>
                    </div>
                    :
                    <div class="mailru-gift__btn">
                      <span>Тут были промокоды на «Ситимобил», но их разобрали</span>
                    </div>
                }
              </div>
              <div class="mailru-gift__hint">Для того, чтобы получить промокод, потребуется авторизация на TJournal</div>
            </div>
          );
        }
      }

      return null;
    };

    return getBottom();
  }

}

class Result extends Component {
  constructor(props) {
    super(props);

    this.shareRef = this.shareRef.bind(this);
    this.restart = this.restart.bind(this);
  }

  getResult(score) {
    let result = {};
    Data.result.some(item => {
      if (item.range[0] <= score && item.range[1] >= score) {
        result = item;
        return true;
      }
    });

    return result;
  }

  shareRef(el) {
    this.setState({
      shareContainer: el
    })
  }

  checkGifts() {
    request('/special/mailru/checkGifts').then(
      resp => {
        resp = JSON.parse(resp);
        console.log(resp);

        if (resp.rc === 200) {
          store.dispatch({
            type: 'CHECK_GIFTS',
            data: resp.data,
          });
        }
      },
      error => { console.log(error); }
    );
  }

  restart() {
    Analytics.sendEvent('Restart');
    store.dispatch({
      type: 'TEST_RESTART',
    });

    this.checkGifts();

    store.dispatch({
      type: 'TEST_BG_CHANGE',
      bg: '#4F5B71',
    });
  }

  componentDidMount() {
    let ps = new PerfectScrollbar('.js-perfect-scrollbar-result');

    Share.make(this.state.shareContainer, {
      url: `https://tjournal.ru/special/mailru/result/${this.props.test.correctAnswers}`,
      title: 'История рунета',
      twitter: 'История рунета'
    });
  }

  render(props, state) {
    const result = this.getResult(props.test.correctAnswers);
    const retina = window.devicePixelRatio > 1;
    return (
      <div class="mailru-result-wrapper js-perfect-scrollbar-result">
        <div className="mailru-result">
          <a href="https://mail.ru/" target="_blank" class="mailru-result__logo" dangerouslySetInnerHTML={{ __html: Svg.logo }} />
          <div class="mailru-result__main" style={{ backgroundImage: `url(${retina ? result.img2x : result.img})` }}>
            <div className="mailru-result__main-inner">
              <div class="mailru-result__result">{props.test.correctAnswers} из 14 правильных ответов</div>
              <div class="mailru-result__title" style={result.titleStyle ? result.titleStyle : null}>Мой рунет<br />выглядит так</div>
              <div className="mailru-result__subtitle">{result.subtitle}</div>
              <div class="mailru-result__share" ref={this.shareRef} />
              <div class="mailru-result__restart-btn" onClick={this.restart}>
                <span>Пройти еще раз</span>
                <span dangerouslySetInnerHTML={{ __html: Svg.refresh }} />
              </div>
            </div>
          </div>
          <Gifts test={props.test} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return {
    test: store.testState
  };
}

export default connect(mapStateToProps)(Result);