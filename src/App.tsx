import { inputStore, changeId } from './store';
import { useUnit } from 'effector-react';

function App() {
  const store = useUnit(inputStore);

  return (
    <>
      <div>
        <form
          id="sendIdForm"
          onSubmit={(event) => {
            event.preventDefault();
            changeId(+event.currentTarget.elements.idInput.value);
          }}
        >
          <input type="text" name="idInput" form="sendIdForm" />
          <button type="submit" disabled={store.loading} style={{ cursor: store.loading ? 'not-allowed' : 'pointer' }}>
            Send Id
          </button>
          {store.isError && <span>Вы плохо ввели число</span>}
          {!!store.id && !!store.title && !store.isError && (
            <span>
              {store.id} {store.title}
            </span>
          )}
        </form>
      </div>
    </>
  );
}

export default App;
