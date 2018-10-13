import { h, render, Component } from 'preact';
import Data from '../data';

export default class Pager extends Component {
  constructor() {
    super();
  }

  render(props, state) {
    let pages = Data.questions.map((item) => {
      return (
        <div className="mailru-pager__item">{item.year}</div>
      );
    });
    return (
      <div class="mailru-pager">
        <div className="mailru-pager__inner">{pages}</div>
      </div>
    )
  }
}