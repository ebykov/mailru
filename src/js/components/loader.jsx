import { h, render, Component } from 'preact';
import { Provider, connect } from 'preact-redux';
import store from '../store';
import { requestAnimate } from '../lib/animate';

export default class Loader extends Component {
  constructor() {
    super();

    this.setState({
      year: 1995
    });
  }

  componentDidMount() {
    let year = this.state.year;
    let add = 23;
    requestAnimate({
      duration: 3000,
      timing: t => { return t*t*t*t*t },
      draw: progress => {
        this.setState({
          year: Math.floor(year + (progress * add)),
        });
      },
      end: () => {
        setTimeout(() => {
          store.dispatch({
            type: 'TEST_LOADED',
          });
        }, 500);
      }
    });
  }

  render(props, state) {
    return (
      <div className="mailru__loader">{state.year}</div>
    );
  }
}

// const mapStateToProps = function(store) {
//   return {
//     test: store.testState.test
//   };
// }
//
// export default connect(mapStateToProps)(Loader);