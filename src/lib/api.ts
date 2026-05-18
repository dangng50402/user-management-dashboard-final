import { Album, CreateUserInput, Post, UpdateUserInput, User } from "@/types/user";

const BASE_URL = "https://jsonplaceholder.typicode.com";

async function fetcher<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export const userApi = {
  // GET /users
  getAll: (): Promise<User[]> =>
    fetcher<User[]>("/users"),

  // GET /users/:id
  getById: (id: number): Promise<User> =>
    fetcher<User>(`/users/${id}`),

  // GET /users/:id/posts
  getPosts: (id: number): Promise<Post[]> =>
    fetcher<Post[]>(`/users/${id}/posts`),

  // GET /users/:id/albums
  getAlbums: (id: number): Promise<Album[]> =>
    fetcher<Album[]>(`/users/${id}/albums`),

  // POST /users — JSONPlaceholder fake: luôn trả về id=11, không lưu thật
  create: (payload: CreateUserInput): Promise<User> =>
    fetcher<User>("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // PATCH /users/:id
  update: (id: number, payload: Omit<UpdateUserInput, "id">): Promise<User> =>
    fetcher<User>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  // DELETE /users/:id — JSONPlaceholder: luôn trả về 200 {}
  delete: (id: number): Promise<Record<string, never>> =>
    fetcher<Record<string, never>>(`/users/${id}`, { method: "DELETE" }),
};