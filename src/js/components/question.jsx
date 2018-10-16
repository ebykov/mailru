import { h, render, Component } from 'preact';
import store from '../store';
import {connect} from 'preact-redux';
import Data from '../data';
import Svg from '../svg';
import {requestAnimate} from '../lib/animate';
import * as Analytics from '../lib/analytics';

function OptionList(props) {
  const options = props.options;
  const listItems = options.map((item, index) =>
    <div className={`mailru-q__options-item mailru-q__options-item--${props.type}`}>
      <span key={index} onClick={() => props.onAnswer(item)} className={`mailru-q__option mailru-q__option--${props.type}`}>
        <span>{item.text}</span>
      </span>
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
    this.inputRef = this.inputRef.bind(this);
    this.answerEnter = this.answerEnter.bind(this);
    this.answerEnterType = this.answerEnterType.bind(this);
    this.answerEnterClick = this.answerEnterClick.bind(this);
    this.next = this.next.bind(this);
  }

  answer(item) {
    Analytics.sendEvent('Question Option');
    this.setState({
      answer: item,
    });

    store.dispatch({
      type: 'TEST_ANSWER',
      isCorrect: item.isCorrect,
    });
  }

  inputRef(el) {
    this.input = el;
  }

  answerEnter() {
    const val = this.input.value.trim().toLowerCase();
    const isCorrect = this.props.question.answers.indexOf(val) !== -1;
    this.setState({
      answer: {
        text: isCorrect ? this.props.question.answer : val,
        isCorrect: isCorrect
      }
    });

    store.dispatch({
      type: 'TEST_ANSWER',
      isCorrect: isCorrect
    });
  }

  answerEnterType(e) {
    const val = e.currentTarget.value;
    if (e.key === 'Enter' && val.length > 0) {
      this.answerEnter();
      Analytics.sendEvent('Question Input', 'KeyPress');
    }
  }

  answerEnterClick() {
    const val = this.input.value;
    if (val.length > 0) {
      this.answerEnter();
      Analytics.sendEvent('Question Input Button');
    } else {
      this.input.focus();
    }
  }

  next() {
    Analytics.sendEvent('Next');
    store.dispatch({
      type: 'TEST_CONTINUE'
    });

    const nextQuestion = Data.questions[this.props.index + 1];
    if (nextQuestion.era) {
      let currentOffsetY = this.props.test.offsetY;

      store.dispatch({
        type: 'TEST_BG_CHANGE',
        bg: nextQuestion.era.bg.gradient,
      });

      requestAnimate({
        duration: 2000,
        timing: t => (.5 + Math.pow((t * 1.6 - 0.80625), 3)).toFixed(3),
        draw: progress => {
          let p = progress < 0 ? 0 : progress;
          let y = this.props.test.height * 2 * p;
          let off = currentOffsetY + y;

          store.dispatch({
            type: 'TEST_SLIDE',
            offsetY: off,
          });
        },
        end: () => {
          store.dispatch({
            type: 'TEST_BG_CHANGE',
            bg: nextQuestion.era.bg.color,
          });
        }
      });
    } else {
      store.dispatch({
        type: 'TEST_SLIDE',
        offsetY: this.props.test.offsetY + this.props.test.height
      });
    }
  }

  result() {
    Analytics.sendEvent('Result');
    store.dispatch({
      type: 'TEST_FINISHED',
    });
  }

  render(props, state) {
    let body = null;
    if (!state.answer) {
      body = (
        <div className="mailru-q__body">
          <div className={`mailru-q__text mailru-q__text--${props.question.type}`}>{props.question.text}</div>
          {
            Array.isArray(props.question.options)
              ? <OptionList type={props.question.type} options={props.question.options} onAnswer={this.answer} />
              :
              [
                <input type="text" className="mailru-q__input" ref={this.inputRef} onKeyPress={this.answerEnterType} placeholder="Ответ" />,
                <button className={`mailru-q__next-btn mailru-q__next-btn--${props.question.type}`} onClick={this.answerEnterClick}>Ответить</button>
              ]
          }
        </div>
      );
    } else {
      body = (
        <div className="mailru-q__body">
          <div className={`mailru-q__answer mailru-q__answer--${props.question.type} ${state.answer.isCorrect ? 'mailru-q__answer--correct' : 'mailru-q__answer--incorrect'}`}>{state.answer.text}</div>
          <div className="mailru-q__answer-msg" dangerouslySetInnerHTML={{ __html: state.answer.isCorrect ? props.question.correctMsg : props.question.incorrectMsg }} />
          <button className={`mailru-q__next-btn mailru-q__next-btn--${props.question.type}`} onClick={ props.index === Data.questions.length - 1 ? this.result : this.next }>
            { props.index === Data.questions.length - 1 ? 'Результат' : 'Продолжить' }
          </button>
        </div>
      );
    }

    return (
      <div className={`mailru-q mailru-q--${props.question.type}`}>
        <div className={`mailru-q__frame mailru-q__frame--${props.question.type}`} />
        <div className="mailru-q__header">
          <div className="mailru-q__header-inner">
            <div className={`mailru-q__pager mailru-q__pager--${props.question.type}`}>{`${props.index + 1}/${Data.questions.length}`}</div>
          </div>
        </div>
        { props.question.img ?
            <img src={props.question.img} srcset={`${props.question.img2x} 2x`} alt="" className="mailru-q__img" style={{ display: !state.answer && props.question.answerImg ? 'none' : 'block'}} /> : null
        }
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