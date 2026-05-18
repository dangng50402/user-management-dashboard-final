export const queryKeys = {
    users: {
      all: () => ["users"] as const,
      detail: (id: number) => ["users", id] as const,
      posts: (id: number) => ["users", id, "posts"] as const,
      albums: (id: number) => ["users", id, "albums"] as const,
    },
  };