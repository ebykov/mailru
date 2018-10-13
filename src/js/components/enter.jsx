import { h, render, Component } from 'preact';
import { connect } from 'preact-redux';
import store from '../store';

class Enter extends Component {
  constructor() {
    super();

    this.start = this.start.bind(this);
  }

  start() {
    store.dispatch({
      type: 'TEST_STARTED',
      isStarted: true
    });

    this.props.test.slideTo(0, this.props.test.height, (offsetY) => {
      store.dispatch({
        type: 'TEST_SLIDE',
        offsetY: offsetY
      });
    });
  }

  render(props, state) {
    return (
      <div className="mailru-enter">
        <div className="mailru-enter__title">История рунета</div>
        <div className="mailru-enter__text">
          <p>15 октября 2018 года MRG отметила юбилей — 20 лет. За эти годы российский интернет несколько раз перерождался и оброс гигантским количеством событий, историй и мемов.</p>
          <p>Мы подготовили тест на знание рунета — проверьте, насколько хорошо вы с ней знакомы.</p>
        </div>
        <div className="mailru-enter__start">
          <button className="mailru-enter__start-btn" onClick={this.start}>Начать</button>
          <div className="mailru-enter__start-line"></div>
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