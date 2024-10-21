import { createEffect, createEvent, createStore, sample } from 'effector';

export const inputStore = createStore({ id: 0, title: '', loading: false, isError: false });

export const changeId = createEvent<number>();
const sendId = createEffect(async ({ id }: { id: number }) => {
  const url = `https://dummyjson.com/products/${id}`;
  const req = await fetch(url);
  if (req.status !== 200) {
    throw new Error('Error');
  }
  return { id, item: await req.json() };
});

inputStore.on(sendId.failData, (src, payload) => {
  console.log('fail');
  return {
    ...src,
    loading: false,
    isError: true,
  };
});

inputStore.on(sendId.pending, (src, payload) => {
  return {
    ...src,
    loading: sendId.pending.getState(),
  };
});

inputStore.on(sendId.doneData, (src, payload) => {
  return {
    id: payload.id,
    title: `${payload.item.title}`,
    loading: false,
    isError: false,
  };
});

sample({
  source: inputStore,
  target: sendId,
  clock: changeId,
  filter: (src, payload: number) => typeof payload === 'number' && payload > 0 && payload < 100,
  fn: (src, payload) => ({ id: payload }),
});
