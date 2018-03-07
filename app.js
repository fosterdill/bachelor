const GetPayload = 'GetPayload';
const ViewPayload = 'ViewPayload';

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

const viewPayload = (digestReturnedIntent) => {
  digestReturnedIntent(() => GetPayload, state)();

  return { something: 'loading' };
};

const stateReducer = () => {
  return {
    type: 'div',
    listeners: {
      click: (e) => ViewPayload,
    },
    innerHTML: state.get().something,
  };
};


const getPayload = () => {
  return fetch('https://jsonplaceholder.typicode.com/posts/1/')
    .then((object) => object.json())
    .then((object) => Promise.resolve({ something: JSON.stringify(object) }));
};

const intentReducer = (intent, object, digestReturnedIntent) => {
  switch (intent) {
    case ViewPayload: return viewPayload(digestReturnedIntent);
    case GetPayload: return getPayload();
    default:
      return {};
  }
};

state.addListener('change', window.main.bind(null, document.body, stateReducer, state));
state.update({ something: 'hi' });
