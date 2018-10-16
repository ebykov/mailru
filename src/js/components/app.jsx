import { h, render, Component } from 'preact';
import { Provider, connect } from 'preact-redux';
import Loader from './loader';
import Timeline from './timeline';
import Pager from './pager';
import Result from './result';
import store from '../store';
import Data from '../data';

class App extends Component {
  componentWillMount() {
    store.dispatch({
      type: 'TEST_PARAMS',
      params: this.props.params,
    });
  }

  componentDidMount() {
    store.dispatch({
      type: 'TEST_SET_HEIGHT',
    });

    window.addEventListener('resize', () => {
      store.dispatch({
        type: 'TEST_SET_HEIGHT',
      });

      if (this.props.test.status === 'STARTED') {
        const height = window.innerHeight - 50;
        let offsetY = 0;

        Data.questions.map((item, index) => {
          if (index <= this.props.test.activeIndex) {
            offsetY += item.era ? height * 2 : height;
          }
        });

        store.dispatch({
          type: 'TEST_SLIDE',
          offsetY: offsetY,
        });
      }
    });
  }

  render(props, state) {
    const getBody = (status) => {
      switch (status) {
        case 'LOADED': return <Timeline />;
        case 'STARTED': return ([
          <Timeline />,
          <Pager />
        ]);
        case 'FINISHED': return <Result />;
        default: return <Loader />;
      }
    };

    return (
      <div class={`mailru${props.params.isFeed ? ' is-feed' : ''}`}>
        <div className="mailru-bg" style={{ background: props.test.bg }}></div>
        <div className="mailru__inner" style={{ height: `${props.test.height}px`}}>{getBody(props.test.status)}</div>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return {
    test: store.testState
  };
}

export default connect(mapStateToProps)(App);