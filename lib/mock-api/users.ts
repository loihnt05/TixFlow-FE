import { mockUsers, type MockUser } from "@/lib/mock/users";

const userStorageKey = "zipevent-user";
function notifyAuthChange() { window.dispatchEvent(new Event("zipevent-auth-change")); }
export async function login(email: string, _password: string): Promise<MockUser> {
  const user = mockUsers.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase()) ?? { ...mockUsers[0], email };
  localStorage.setItem(userStorageKey, JSON.stringify(user));
  notifyAuthChange();
  return user;
}
export async function register(name: string, email: string, phone: string): Promise<MockUser> {
  const user: MockUser = { id: `user-${Date.now()}`, name, email, phone, role: "customer" };
  localStorage.setItem(userStorageKey, JSON.stringify(user));
  notifyAuthChange();
  return user;
}
export async function logout(): Promise<void> { localStorage.removeItem(userStorageKey); notifyAuthChange(); }
export async function getCurrentUser(): Promise<MockUser | null> {
  const saved = localStorage.getItem(userStorageKey);
  return saved ? JSON.parse(saved) as MockUser : null;
}
