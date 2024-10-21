/* eslint-disable @typescript-eslint/no-unused-vars */
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

inputStore.on(sendId.failData, (src, _) => {
  console.log('fail');
  return {
    ...src,
    loading: false,
    isError: true,
  };
});

inputStore.on(sendId.pending, (src, _) => {
  return {
    ...src,
    loading: sendId.pending.getState(),
  };
});

inputStore.on(sendId.doneData, (_, payload) => {
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
  filter: (_, payload: number) => typeof payload === 'number' && payload > 0 && payload < 100,
  fn: (_, payload) => ({ id: payload }),
});
