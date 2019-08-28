import { Store } from './context';
import { createState } from './reducers';
import { State, Action, Dispatch } from './types';

describe('Store', () => {
  it('can store state', () => {
    function reducer(state: State, action: Action) {
      if (action.type === 'COUNTING') {
        return state.update('counter', value => value + 1);
      }
      return state;
    }

    const store = new Store(createState({ counter: 1 }), reducer);
    expect(store.getState().get('counter')).toBe(1);

    store.dispatch({ type: 'COUNTING' });
    expect(store.getState().get('counter')).toBe(2);

    function action() {
      return (dispatch: Dispatch, getState: () => State) => {
        expect(getState().get('counter')).toBe(2);
        dispatch({ type: 'COUNTING' });
        expect(getState().get('counter')).toBe(3);
      };
    }

    store.dispatch(action());
    expect(store.getState().get('counter')).toBe(3);
  });

  it('defers to the reducer when given null intial state', () => {
    function reducer(state: State = createState({ counter: 1 }), action: Action) {
      if (action && action.type === 'COUNTING') {
        return state.update('counter', value => value + 1);
      }
      return state;
    }

    const store = new Store(null, reducer);
    expect(store.getState().get('counter')).toBe(1);

    store.dispatch({ type: 'COUNTING' });
    expect(store.getState().get('counter')).toBe(2);
  });
});
