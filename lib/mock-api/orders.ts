import { mockOrders } from "@/lib/mock/orders";
export async function getOrders(userId?: string) { return userId ? mockOrders.filter((order) => order.userId === userId) : mockOrders; }
export async function getOrderById(id: string) { return mockOrders.find((order) => order.id === id); }
