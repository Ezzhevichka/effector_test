/* eslint-disable @typescript-eslint/no-unused-vars */
import { createEffect, createEvent, createStore, sample } from 'effector';

const $inputStore = createStore<number>(0);
const $pendingStore = createStore<boolean>(false);
const $errorStore = createStore<boolean>(false);
const $productStore = createStore<string>('');

const changeId = createEvent<number>();

const sendIdFx = createEffect(async (id: number) => {
  const url = `https://dummyjson.com/products/${id}`;
  const req = await fetch(url);
  if (req.status !== 200) {
    throw new Error('Error');
  }
  const item = await req.json();
  return item.title;
});

sample({
  clock: changeId,
  target: [sendIdFx, $inputStore],
  filter: (id: number) => id > 0 && id < 100,
});

sample({
  clock: sendIdFx.pending,
  target: $pendingStore,
  fn: () => !!sendIdFx.pending.getState(),
});

sample({
  clock: sendIdFx.doneData,
  target: $productStore,
});

sample({
  clock: sendIdFx.doneData,
  target: $errorStore,
  fn: () => false,
});

sample({
  clock: sendIdFx.fail,
  target: $errorStore,
  fn: () => true,
});

sample({
  clock: [sendIdFx.done, sendIdFx.fail],
  fn: () => false,
  target: $pendingStore,
});

export const inputModel = { changeId, $inputStore, $pendingStore, $productStore, $errorStore };
