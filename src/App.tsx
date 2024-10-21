import { inputModel } from './store';
import { useUnit } from 'effector-react';

function App() {
  const { $inputStore, $pendingStore, $productStore, $errorStore, changeId } = inputModel;
  const inputStore = useUnit($inputStore);
  const pendingStore = useUnit($pendingStore);
  const productStore = useUnit($productStore);
  const errorStore = useUnit($errorStore);

  console.log(errorStore);

  return (
    <>
      <div>
        <form
          id="sendIdForm"
          onSubmit={(event) => {
            event.preventDefault();
            //@ts-expect-error Because
            changeId(+event.currentTarget.elements.idInput.value);
          }}
        >
          <input type="text" name="idInput" form="sendIdForm" />
          <button type="submit" disabled={pendingStore} style={{ cursor: pendingStore ? 'not-allowed' : 'pointer' }}>
            Send Id
          </button>
          {errorStore && <span>Вы плохо ввели число</span>}
          {!!inputStore && !!productStore && !errorStore && (
            <span>
              {inputStore} {productStore}
            </span>
          )}
        </form>
      </div>
    </>
  );
}

export default App;
