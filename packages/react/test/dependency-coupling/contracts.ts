import {
  Group,
  UNSTABLE_Toast,
  UNSTABLE_ToastQueue,
  UNSTABLE_ToastRegion,
  type GroupProps,
} from 'react-aria-components';
import { useMove, type MoveEvents, type MoveResult } from 'react-aria';

export const groupContract: (props: GroupProps) => unknown = Group;
export const toastContract = UNSTABLE_Toast;
export const toastRegionContract = UNSTABLE_ToastRegion;
export const toastQueueContract = UNSTABLE_ToastQueue;
export const useMoveContract: (props: MoveEvents) => MoveResult = useMove;
