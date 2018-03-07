const GetPayload = 'GetPayload';
const ViewPayload = 'ViewPayload';

// state denormalized from DOM and API
// actions by users are described by intents
// a stateReducer is a function that returns object describing element
// intentreducer turns intent into updated state

class State extends EventEmitter {
  get() {
    return this.state;
  }

  update(newState) {
    this.state = newState;

    this.emit('change');
  }
}

const state = new State();

const handlerToIntentReducer = (handler, thing) => {
  return handler(thing, state);
};

const stateSetter = (handlerToIntentReducer, thing) => {
  const objectOrPromise = intentReducer(handlerToIntentReducer(thing), thing);

  if (objectOrPromise instanceof Promise) { objectOrPromise.then((object) => { state.update(object); }); } else {
    state.update(objectOrPromise);
  }
};

const digestReturnedIntent = (intentCreator) =>
  stateSetter.bind(null, handlerToIntentReducer.bind(null, intentCreator));

const stateReducer = () => {
  return {
    type: 'div',
    listeners: {
      click: (e) => ViewPayload,
    },
    innerHTML: state.get().something,
  };
};

const viewPayload = () => {
  digestReturnedIntent(() => GetPayload)();

  return { something: 'loading' };
};


const getPayload = () => {
  return fetch('https://jsonplaceholder.typicode.com/posts/1/')
    .then((object) => object.json())
    .then((object) => Promise.resolve({ something: JSON.stringify(object) }));
};

const intentReducer = (intent, object) => {
  switch (intent) {
    case ViewPayload: return viewPayload();
    case GetPayload: return getPayload();
    default:
      return {};
  }
};

const elementObjectReducer = (elementObject) => {
  return Object.keys(elementObject.listeners)
    .reduce((element, listener) => {
      element.addEventListener(listener, digestReturnedIntent(elementObject.listeners[listener]));
      element.innerHTML = elementObject.innerHTML;

      return element;
    }, document.createElement(elementObject.type));
};

const main = () => {
  document.body.innerHTML = '';
  document.body.append(elementObjectReducer(stateReducer()));
};

state.addListener('change', main);
state.update({ something: 'hi' });
