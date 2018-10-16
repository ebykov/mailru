import { h, render, Component } from 'preact';
import { Provider, connect } from 'preact-redux';
import Data from '../data';

class Pager extends Component {
  constructor() {
    super();
  }

  render(props, state) {
    let offsetX = 0;
    const type = Data.questions[props.test.activeIndex].type;
    const currentYear = Data.questions[props.test.activeIndex].year;
    const years = Data.questions.map(item => item.year);
    const pages = [...new Set(years)].map((item, index) => {
      if (currentYear === item) {
        offsetX = index * 100;
      }
      return (
        <div className={`mailru-pager__item${currentYear === item ? ' mailru-pager__item--active': ''}`}>{item}</div>
      );
    });
    return (
      <div class="mailru-pager">
        <div className={`mailru-pager__planet mailru-pager__planet--${type}`} style={{ animation: props.test.planetAnimation }} />
        <div className="mailru-pager__pin" />
        <div className="mailru-pager__wrapper">
          <div className="mailru-pager__inner" style={{ transform: `translateX(calc(50% - ${offsetX}px - 50px)` }}>{pages}</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return {
    test: store.testState
  };
}

export default connect(mapStateToProps)(Pager);