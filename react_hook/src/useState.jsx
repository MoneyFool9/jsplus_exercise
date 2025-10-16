import { render } from "./render";

const states = [];
const stateSetters = [];

let stateIndex = 0;

function createState(initialState, stateIndex) {
  return states[stateIndex] ? states[stateIndex] : initialState;
}

function createStateSetter(stateIndex) {
  return (newState) => {
    if (typeof newState === 'function') { 
      states[stateIndex] = newState(states[stateIndex]);
    } else {
      states[stateIndex] = newState;
    }
    render();
  }
}


export function useState(initialState) {
  if (!states[stateIndex]) { 
    states[stateIndex] = createState(initialState, stateIndex);
  }

  if (!stateSetters[stateIndex]) { 
    stateSetters[stateIndex] = createStateSetter(stateIndex);
  }

  const _state = states[stateIndex];
  const _stateSetter = stateSetters[stateIndex];

  stateIndex++;
  return [  
    _state,
    _stateSetter
  ]
}

