const state = {};
const ClickIntent = 'ClickIntent';

const stateReducer = (state) => {
  return {
    type: 'div',
    props: {
      onclick: () => ClickIntent,
    },
  };
};

const intentReducer = (intent) => {
  switch (intent) {
    case ClickIntent:
      return { clicked: true };

    default:
      return {};
  }
};

const handlerToIntentReducer = (handler, event) => {
  return handler(event, state);
};

const stateSetter = (handlerToIntentReducer, event) => {
  state = intentReducer(handlerToIntentReducer(event));
};

const elementObjectReducer = (elementObject) => {
  return Object.keys(elementObject.props)
    .reduce((element, prop) => (
      elementObject.setAttribute(handlerToIntentReducer.bind(null, handler))
    ), document.createElement(elementObject.type));
};

const renderToBody = () => {
  document.body.append(elementObjectReducer(stateReducer(state)));
};

state = renderToBody();
