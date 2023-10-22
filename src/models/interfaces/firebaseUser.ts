import { Link } from './link';

export interface FirebaseUserProfile {
  userId: string;
  links: {
    [linkId: string]: Link;
  };
}
