import assert from 'node:assert/strict';

class StableAdapterFixture {
  visibleToasts = [];
  #generation;
  #subscribers = new Set();

  constructor(generation) {
    this.#generation = generation;
  }

  subscribe(subscriber) {
    this.#subscribers.add(subscriber);
    return () => this.#subscribers.delete(subscriber);
  }

  replaceGeneration(generation) {
    this.#generation = generation;
  }

  publishAlignedSnapshot() {
    this.visibleToasts = this.#generation.visibleToasts;
    for (const subscriber of this.#subscribers) {
      subscriber();
    }
  }
}

export async function runStableToastAdapterFixture(ToastQueue) {
  const firstGeneration = new ToastQueue({ maxVisibleToasts: 2 });
  const adapter = new StableAdapterFixture(firstGeneration);
  const stableIdentity = adapter;
  const snapshots = [];
  adapter.subscribe(() => snapshots.push(adapter.visibleToasts));

  firstGeneration.add({ title: 'first' });
  assert.equal(
    adapter.visibleToasts.length,
    0,
    'Raw mutation must not publish through the adapter.',
  );
  assert.equal(firstGeneration.subscriptions.size, 0, 'Raw generations must remain unsubscribed.');
  adapter.publishAlignedSnapshot();
  assert.equal(snapshots.length, 1);
  assert.equal(snapshots[0], firstGeneration.visibleToasts);

  const secondGeneration = new ToastQueue({ maxVisibleToasts: 2 });
  secondGeneration.add({ title: 'rebuilt' });
  adapter.replaceGeneration(secondGeneration);
  adapter.publishAlignedSnapshot();

  assert.equal(adapter, stableIdentity, 'Replacing a raw generation must retain adapter identity.');
  assert.equal(snapshots.length, 2, 'Adapter subscribers must survive raw generation replacement.');
  assert.equal(snapshots[1], secondGeneration.visibleToasts);
  assert.equal(
    secondGeneration.subscriptions.size,
    0,
    'Replacement generations must remain unsubscribed.',
  );

  const closeKey = secondGeneration.add({ title: 'close me' });
  const beforeClose = secondGeneration.visibleToasts;
  const closeNotifications = [];
  adapter.subscribe(() => {
    closeNotifications.push({
      adapterSnapshot: adapter.visibleToasts,
      rawSnapshot: secondGeneration.visibleToasts,
    });
  });
  secondGeneration.close(closeKey);
  assert.notEqual(
    secondGeneration.visibleToasts,
    beforeClose,
    'Raw close must replace the visibleToasts snapshot.',
  );
  assert.equal(
    closeNotifications.length,
    0,
    'Raw close must remain silent until the stable adapter publishes.',
  );
  adapter.publishAlignedSnapshot();
  assert.equal(closeNotifications.length, 1);
  assert.equal(closeNotifications[0].adapterSnapshot, secondGeneration.visibleToasts);
  assert.equal(closeNotifications[0].rawSnapshot, secondGeneration.visibleToasts);

  secondGeneration.add({ title: 'clear one' });
  secondGeneration.add({ title: 'clear two' });
  adapter.publishAlignedSnapshot();
  const beforeClear = secondGeneration.visibleToasts;
  const notificationCountBeforeClear = closeNotifications.length;
  secondGeneration.clear();
  assert.notEqual(
    secondGeneration.visibleToasts,
    beforeClear,
    'Raw clear must replace the visibleToasts snapshot.',
  );
  assert.deepEqual(secondGeneration.visibleToasts, []);
  assert.equal(
    closeNotifications.length,
    notificationCountBeforeClear,
    'Raw clear must remain silent until the stable adapter publishes.',
  );
  adapter.publishAlignedSnapshot();
  assert.equal(closeNotifications.length, notificationCountBeforeClear + 1);
  assert.equal(closeNotifications.at(-1).adapterSnapshot, secondGeneration.visibleToasts);
  assert.equal(
    secondGeneration.subscriptions.size,
    0,
    'Close and clear must not introduce raw queue subscribers.',
  );
}
