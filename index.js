// state denormalized from DOM and API
// actions by users are described by intents
// a stateReducer is a function that returns object describing element
// intentreducer turns intent into updated state

const handlerToIntentReducer = (handler, object) => {
  return handler(object, state);
};

const digestReturnedIntent = (object, intentCreator, state) =>
  stateSetter.bind(null, handlerToIntentReducer.bind(null, intentCreator), object, state);

const stateSetter = (handlerToIntentReducer, object, state) => {
  const objectOrPromise = intentReducer(handlerToIntentReducer(object), object, digestReturnedIntent.bind(null, object));

  if (objectOrPromise instanceof Promise) { objectOrPromise.then((object) => { state.update(object); }); } else {
    state.update(objectOrPromise);
  }
};

const elementObjectReducer = (elementObject, state) => {
  return Object.keys(elementObject.listeners)
    .reduce((element, listener) => {
      element.addEventListener(listener, digestReturnedIntent(elementObject, elementObject.listeners[listener], state));
      element.innerHTML = elementObject.innerHTML;

      return element;
    }, document.createElement(elementObject.type));
};

window.main = (element, stateReducer, state) => {
  element.innerHTML = '';
  element.append(elementObjectReducer(stateReducer(), state));
};

