import { User } from "../users/user.model";

export interface Advertisement {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  openingHours: string;
  closingHours: string;
  location: string;
  admindBy: User;
}
