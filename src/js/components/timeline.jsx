import { h, render, Component } from 'preact';
import Enter from './enter';
import Question from './question';
import { requestAnimate } from '../lib/animate';
import Data from '../data';
import {connect} from "preact-redux";


class Timeline extends Component {
  constructor() {
    super();

    // this.onStart = this.onStart.bind(this);
    // this.onNext = this.onNext.bind(this);
    //
    // this.scrollTo = this.scrollTo.bind(this);
  }

  // onStart() {
  //   requestAnimate({
  //     duration: 2000,
  //     timing: t => (.5 + Math.pow((t*1.6-0.80625), 3)).toFixed(3),
  //     draw: progress => {
  //       let y = this.props.containerHeight * 2 * progress;
  //       this.setState({
  //         offsetY: y,
  //       });
  //     },
  //     end: () => {
  //       this.props.onStart();
  //     }
  //   });
  // }
  //
  // onNext(index) {
  //   requestAnimate({
  //     duration: 2000,
  //     timing: t => (.5 + Math.pow((t*1.6-0.80625), 3)).toFixed(3),
  //     draw: progress => {
  //       let p = progress < 0 ? 0 : progress;
  //       let y = this.props.containerHeight * 2 * p;
  //       this.setState({
  //         offsetY: (this.props.containerHeight * (index * 2)) + y,
  //       });
  //     }
  //   });
  // }
  //
  // scrollTo() {
  //   requestAnimate({
  //     duration: 2000,
  //     timing: t => (.5 + Math.pow((t*1.6-0.80625), 3)).toFixed(3),
  //     draw: progress => {
  //       let p = progress < 0 ? 0 : progress;
  //       let y = this.props.containerHeight * 2 * p;
  //       this.setState({
  //         offsetY: (this.props.containerHeight * (index * 2)) + y,
  //       });
  //     }
  //   });
  // }

  // slide() {
  //   requestAnimate({
  //     duration: 2000,
  //     timing: t => (.5 + Math.pow((t*1.6-0.80625), 3)).toFixed(3),
  //     draw: progress => {
  //       let p = progress < 0 ? 0 : progress;
  //       let y = this.props.height * 2 * p;
  //       this.setState({
  //         offsetY: (this.props.containerHeight * (index * 2)) + y,
  //       });
  //     }
  //   });
  // }

  render(props, state) {
    let sections1 = [
      (
        <div className="mailru-timeline__section" style={{height: props.test.height}}>
          <Enter />
        </div>
      )
    ]
    let sections2 = Data.questions.map((question, index) => {
      return ([
        <div className="mailru-timeline__section" style={{height: props.test.height}}>
          <div className="mailru-year">{question.year}</div>
        </div>,
        <div className="mailru-timeline__section" style={{height: props.test.height}}>
          <Question index={index} question={question} />
        </div>
      ]);
    });

    let sections = [...sections1, ...sections2];

    return (
      <div className="mailru-timeline" style={{transform: `translateY(-${props.test.offsetY}px)`}}>
        {sections}
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return {
    test: store.testState
  };
};

export default connect(mapStateToProps)(Timeline);