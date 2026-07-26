import { Interval } from '@tale-ui/utils/useInterval';

export interface TimestampScheduler {
  now: () => number;
  subscribe: (interval: number, callback: () => void) => () => void;
}

type Subscriber = () => void;

type SchedulerGroup = {
  timer: Interval;
  subscribers: Set<Subscriber>;
};

const groups = new Map<number, SchedulerGroup>();

const defaultTimestampScheduler: TimestampScheduler = {
  now: Date.now,
  subscribe(interval, callback) {
    let group = groups.get(interval);
    if (!group) {
      const timer = Interval.create();
      const subscribers = new Set<Subscriber>();
      group = { timer, subscribers };
      groups.set(interval, group);
      timer.start(interval, () => {
        for (const subscriber of [...subscribers]) {
          subscriber();
        }
      });
    }

    group.subscribers.add(callback);
    let subscribed = true;

    return () => {
      if (!subscribed) {
        return;
      }
      subscribed = false;
      group!.subscribers.delete(callback);
      if (group!.subscribers.size === 0) {
        group!.timer.clear();
        groups.delete(interval);
      }
    };
  },
};

let activeTimestampScheduler = defaultTimestampScheduler;

export function getTimestampScheduler() {
  return activeTimestampScheduler;
}

/**
 * Installs a deterministic clock for focused tests and maintained performance
 * fixtures. This is intentionally not re-exported from the public entry point.
 */
export function setTimestampSchedulerForTesting(scheduler: TimestampScheduler) {
  const previous = activeTimestampScheduler;
  activeTimestampScheduler = scheduler;
  return () => {
    activeTimestampScheduler = previous;
  };
}

export function getTimestampSchedulerGroupCountForTesting() {
  return groups.size;
}
