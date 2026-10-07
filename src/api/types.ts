export type Currency = "USD" | "MMK";
export type Project = { id: string; title: string; description: string; minBudget: string | null; maxBudget: string | null; currency: Currency; deadline: string | null; status: string; createdAt: string; updatedAt: string; category: { id: string; name: string }; client: { id: string; name: string; avatarUrl: string | null }; skills: { id: string; name: string }[]; proposalsCount: number };
export type User = { id: string; email: string; name: string; role: "CLIENT" | "FREELANCER" | "ADMIN"; headline?: string | null; biography?: string | null; location?: string | null; avatarUrl?: string | null; hourlyRate?: string | null; hourlyCurrency?: Currency | null; availability?: string | null };
export type AuthResponse = { user: User; accessToken: string; refreshToken: string };
export type ApiErrorBody = { error?: { code?: string; message?: string } };
