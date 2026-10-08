export interface MockUser { id: string; name: string; email: string; phone: string; role: "customer" | "organizer" }

export const mockUsers: MockUser[] = [
  { id: "user-001", name: "Linh Tran", email: "linh.tran@example.com", phone: "+84 912 345 678", role: "customer" },
  { id: "user-002", name: "Minh Nguyen", email: "minh.nguyen@example.com", phone: "+84 903 222 111", role: "organizer" },
  { id: "user-003", name: "An Pham", email: "an.pham@example.com", phone: "+84 988 410 122", role: "customer" },
  { id: "user-004", name: "Mai Le", email: "mai.le@example.com", phone: "+84 909 321 887", role: "customer" },
  { id: "user-005", name: "Khanh Vo", email: "khanh.vo@example.com", phone: "+84 934 882 109", role: "organizer" },
  { id: "user-006", name: "Vy Hoang", email: "vy.hoang@example.com", phone: "+84 916 700 381", role: "customer" },
  { id: "user-007", name: "Bao Phan", email: "bao.phan@example.com", phone: "+84 901 234 567", role: "customer" },
  { id: "user-008", name: "Thu Do", email: "thu.do@example.com", phone: "+84 987 654 321", role: "customer" },
  { id: "user-009", name: "Quang Bui", email: "quang.bui@example.com", phone: "+84 905 890 123", role: "customer" },
  { id: "user-010", name: "My Dang", email: "my.dang@example.com", phone: "+84 932 100 222", role: "customer" },
];
