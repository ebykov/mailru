import { h, render, Component } from 'preact';
import Enter from './enter';
import Question from './question';
import { requestAnimate } from '../lib/animate';
import Data from '../data';
import {connect} from "preact-redux";
import PerfectScrollbar from 'perfect-scrollbar';

const makePerfectScroll = () => {
  let containers = document.querySelectorAll('.js-perfect-scrollbar-tl');
  [].slice.call(containers).forEach((item) => {
    new PerfectScrollbar(item);
  });
};

class Timeline extends Component {

  componentDidMount() {
    makePerfectScroll();
  }

  render(props, state) {
    let sectionEnter = [
      (
        <div className="mailru-timeline__section js-perfect-scrollbar-tl" style={{height: props.test.height}}>
          <div className="mailru-timeline__section-inner">
            <Enter />
          </div>
        </div>
      )
    ]
    let sectionsQ = Data.questions.map((question, index) => {
      return ([
        ( question.era ?
          <div className="mailru-timeline__section" style={{height: props.test.height}}>
            <div className="mailru-timeline__section-inner">
              { question.era.images.map((item) => {
                return (
                  item.style.animation ?
                    <div style={Object.assign({}, item.style, {width: '', animation: ''})}>
                      <img src={item.img} srcSet={`${item.img2x} 2x`} className="mailru-era-img" style={item.style}/>
                    </div>
                    : <img src={item.img} srcSet={`${item.img2x} 2x`} className="mailru-era-img" style={item.style}/>
                )
              }) }
              <div className="mailru-line">
                <div className="mailru-line__item" />
                <div className="mailru-line__item" />
              </div>
              <div className="mailru-year">{question.year}</div>
            </div>
          </div>
          : null ),
        <div className="mailru-timeline__section js-perfect-scrollbar-tl" style={{height: props.test.height}}>
          <div className="mailru-timeline__section-inner">
            <div className="mailru-line">
              <div className="mailru-line__item" />
              <div className="mailru-line__item" />
            </div>
            <Question index={index} question={question} />
          </div>
        </div>
      ]);
    });

    let sections = [...sectionEnter, ...sectionsQ];

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