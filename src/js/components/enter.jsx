import { h, render, Component } from 'preact';
import { connect } from 'preact-redux';
import store from '../store';
import Data from '../data';
import * as Analytics from '../lib/analytics';
import {requestAnimate} from '../lib/animate';
import request from '../lib/request';
import Svg from '../svg';

class Enter extends Component {
  constructor() {
    super();

    this.start = this.start.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        opacity: 1
      });
    }, 0);
  }

  componentWillMount() {
    this.setState({
      opacity: 0
    });
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

  start() {
    Analytics.sendEvent('Start');
    this.setState({
      amp: true
    });

    this.checkGifts();

    setTimeout(() => {
      store.dispatch({
        type: 'TEST_STARTED',
      });

      store.dispatch({
        type: 'TEST_BG_CHANGE',
        bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #333333 100%), #000000',
      });

      requestAnimate({
        duration: 2000,
        timing: t => (.5 + Math.pow((t * 1.6 - 0.80625), 3)).toFixed(3),
        draw: progress => {
          let p = progress < 0 ? 0 : progress;
          let y = this.props.test.height * 2 * p;

          store.dispatch({
            type: 'TEST_SLIDE',
            offsetY: y,
          });
        },
        end: () => {
          store.dispatch({
            type: 'TEST_BG_CHANGE',
            bg: '#333333',
          });
        }
      });
    }, 500);
  }

  render(props, state) {
    return (
      <div className="mailru-enter" style={{ opacity: state.opacity }}>
        <a href="https://mail.ru/" target="_blank" className="mailru-enter__logo" dangerouslySetInnerHTML={{ __html: Svg.logo }} />
        {
          props.test.params.isFeed ?
            <a href="/78357" className="mailru-enter__title">История рунета</a>
            :
            <div className="mailru-enter__title">История рунета</div>
        }
        <div className="mailru-enter__text">
          <p>15 октября 2018 года Mail.Ru Group отметила юбилей — 20 лет. За эти годы российский интернет несколько раз перерождался и оброс гигантским количеством  историй и мемов.</p>
          <p>Мы подготовили тест на знание событий из истории рунета — проверьте, насколько хорошо вы с ней знакомы.</p>
        </div>
        <div className="mailru-enter__start">
          <button className="mailru-enter__start-btn" onClick={this.start}>Начать</button>
          <div className={`mailru-enter__start-line${state.amp ? ' is-active' : ''}`} />
        </div>
      </div>
    )
  }
};

const mapStateToProps = function(store) {
  return {
    test: store.testState
  };
};

export default connect(mapStateToProps)(Enter);