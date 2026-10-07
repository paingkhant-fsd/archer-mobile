import type { Project } from "../api/types";

const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export function formatBudget(project: Project) {
  const min = project.minBudget ? amount.format(Number(project.minBudget)) : null;
  const max = project.maxBudget ? amount.format(Number(project.maxBudget)) : null;
  if (min && max) return `${project.currency} ${min}–${max}`;
  if (min) return `${project.currency} ${min}+`;
  if (max) return `Up to ${project.currency} ${max}`;
  return `${project.currency} · Not specified`;
}

export function formatRelativeDate(value: string) {
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

export function formatDate(value: string | null) {
  if (!value) return "No deadline";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
