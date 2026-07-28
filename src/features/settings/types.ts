export interface Announcement {
  id: string;
  title: string;
  date: string;
  body: string;
  isRead: boolean;
  category: 'Update' | 'Feature' | 'Safety' | 'General';
}

export interface NotificationSettings {
  orders: boolean;
  messages: boolean;
  social: boolean;
  promotional: boolean;
}
