import { Link } from './link';

export interface FirebaseLinks {
  userId: string;
  links: {
    [linkId: string]: Link;
  };
}
