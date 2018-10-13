import { h, render, Component } from 'preact';
import { Provider, connect } from 'preact-redux';
import Loader from './loader';
import Timeline from './timeline';
import Pager from './pager';
import store from '../store';

class App extends Component {
  componentDidMount() {
    store.dispatch({
      type: 'HEIGHT_CHANGE',
      height: this.props.container.offsetHeight
    });
  }

  render(props, state) {
    return (
      <div class="mailru">
        { props.test.isLoaded ?
          [
            <Timeline />,
            props.test.isStarted ? <Pager /> : null
          ]
          : <Loader />
        }
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