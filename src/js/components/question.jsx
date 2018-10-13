import { h, render, Component } from 'preact';
import store from '../store';
import {connect} from 'preact-redux';
import Data from '../data';
import Svg from '../svg';

function OptionList(props) {
  const options = props.options;
  const listItems = options.map((item, index) =>
    <div className={`mailru-q__options-item mailru-q__options-item--${props.type}`}>
      <span key={index} onClick={() => props.onAnswer(item)} className={`mailru-q__option mailru-q__option--${props.type}`}>{item.text}</span>
    </div>
  );

  return (
    <div className={`mailru-q__options mailru-q__options--${props.type}`}>{listItems}</div>
  );
}

class Question extends Component {
  constructor() {
    super();

    this.answer = this.answer.bind(this);
    this.next = this.next.bind(this);
  }

  answer(item) {
    this.setState({
      answer: item,
    });
  }

  next() {
    store.dispatch({
      type: 'TEST_CONTINUE'
    });

    this.props.test.slideTo(this.props.index + 1, this.props.test.height, (offsetY) => {
      store.dispatch({
        type: 'TEST_SLIDE',
        offsetY: offsetY
      });
    });
  }

  render(props, state) {
    let body = null;
    if (!state.answer) {
      body = (
        <div className="mailru-q__body">
          <div className="mailru-q__text">{props.question.text}</div>
          {
            Array.isArray(props.question.options)
              ? <OptionList type={props.question.type} options={props.question.options} onAnswer={this.answer} />
              : null
          }
        </div>
      );
    } else {
      body = (
        <div className="mailru-q__body">
          <div className={`mailru-q__answer ${state.answer.isCorrect ? 'mailru-q__answer--correct' : 'mailru-q__answer--incorrect'}`}>{state.answer.text}</div>
          <div className="mailru-q__answer-msg" dangerouslySetInnerHTML={{ __html: state.answer.isCorrect ? props.question.correctMsg : props.question.incorrectMsg }} />
          <button className={`mailru-q__next-btn mailru-q__next-btn--${props.question.type}`} onClick={this.next}>Продолжить</button>
        </div>
      );
    }

    return (
      <div className={`mailru-q mailru-q--${props.question.type}`}>
        <div className={`mailru-q__frame mailru-q__frame--${props.question.type}`}></div>
        <div className="mailru-q__pager">{`${props.index + 1}/${Data.questions.length}`}</div>
        <a href="https://mail.ru/" target="_blank" className="mailru-q__logo" dangerouslySetInnerHTML={{ __html: Svg.logo }} />
        <img src={props.question.img} alt="" className="mailru-q__img"/>
        {body}
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return {
    test: store.testState
  };
};

export default connect(mapStateToProps)(Question);