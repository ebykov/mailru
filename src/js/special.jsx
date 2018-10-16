import '../css/special.styl';
import { h, render } from 'preact';
import { Provider, connect } from 'preact-redux';
import App from './components/app';
import store from './store';
import * as Analytics from "./lib/analytics";

export default class Special {
  constructor(params = {}) {
    this.params = params;
    this.container = this.params.container;

    if (this.params.css) {
      this.loadStyles(this.params.css).then(() => this.init());
    } else {
      this.init();
    }
  }

  loadStyles(path) {
    return new Promise((resolve, reject) => {
      let link = document.createElement('link');

      link.rel = 'stylesheet';
      link.href = path;

      link.onload = () => resolve();
      link.onerror = () => reject();

      document.body.appendChild(link);
    });
  }

  init() {
    const Main = () => (
      <Provider store={store}>
        <App container={this.container} params={this.params} />
      </Provider>
    )

    render(<Main />, this.container);

    document.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a') {
        Analytics.sendEvent(e.target.href);
      }
    })
  }
}