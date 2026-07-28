import { Switch, type SwitchProps } from 'react-native';
import { Row } from './row';
import { Text } from './text';

export type SwitchFieldProps = SwitchProps & { label: string };

export function SwitchField({ label, ...props }: SwitchFieldProps) {
  return (
    <Row>
      <Text>{label}</Text>
      <Switch accessibilityLabel={label} {...props} />
    </Row>
  );
}
