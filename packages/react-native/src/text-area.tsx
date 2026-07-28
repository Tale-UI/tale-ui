import { Input, type InputProps } from './input';

export function TextArea(props: InputProps) {
  return <Input multiline textAlignVertical="top" {...props} />;
}
