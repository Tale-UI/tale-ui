export type ControlledStateOptions<T> = Readonly<{
  value?: T;
  defaultValue: T;
}>;

export type ControlledState<T> = Readonly<{
  value: T;
  isControlled: boolean;
}>;

export const resolveControlledState = <T>({
  value,
  defaultValue,
}: ControlledStateOptions<T>): ControlledState<T> =>
  Object.freeze({
    value: value === undefined ? defaultValue : value,
    isControlled: value !== undefined,
  });

export type ToggleAction = Readonly<{ type: 'toggle' }> | Readonly<{ type: 'set'; value: boolean }>;

export const toggleReducer = (state: boolean, action: ToggleAction): boolean =>
  action.type === 'toggle' ? !state : action.value;

export type SelectionMode = 'single' | 'multiple';

export const updateSelection = (
  selection: ReadonlySet<string>,
  key: string,
  mode: SelectionMode,
): ReadonlySet<string> => {
  if (mode === 'single') {
    return new Set([key]);
  }
  const next = new Set(selection);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  return next;
};
