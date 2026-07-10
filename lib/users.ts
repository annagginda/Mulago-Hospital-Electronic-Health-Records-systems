import { redis } from './redis';
import type { User } from '@/types';

export async function getUser(username: string): Promise<User | null> {
  const user = await redis.get<User>(`user:${username}`);
  return user;
}

export async function getAllUsers(): Promise<User[]> {
  const usernames = await redis.get<string[]>('users:index') || [];
  if (usernames.length === 0) return [];

  // Upstash mget has a limit, but for 15 users it's fine.
  // We can fetch them individually or use mget.
  // Actually redis.mget expects keys. Let's map to keys.
  const keys = usernames.map(u => `user:${u}`);
  const users = await redis.mget<User[]>(...keys);
  
  // Filter out nulls if any
  return users.filter((u): u is User => u !== null);
}
