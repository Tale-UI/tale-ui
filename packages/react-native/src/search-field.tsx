import { Input, type InputProps } from './input';

export function SearchField(props: InputProps) {
  return (
    <Input accessibilityRole="search" enterKeyHint="search" returnKeyType="search" {...props} />
  );
}
