/**
 * Role-based access control. Permissions are coarse-grained strings so they are
 * easy to reason about and to persist on the Role record.
 */

export type Permission =
  | "finance.read"
  | "finance.write"
  | "causes.read"
  | "causes.write"
  | "halacha.read"
  | "halacha.write"
  | "content.read"
  | "content.write"
  | "qr.read"
  | "qr.write"
  | "system.read"
  | "system.write";

export const ALL_PERMISSIONS: Permission[] = [
  "finance.read",
  "finance.write",
  "causes.read",
  "causes.write",
  "halacha.read",
  "halacha.write",
  "content.read",
  "content.write",
  "qr.read",
  "qr.write",
  "system.read",
  "system.write",
];

export interface RoleDef {
  code: string;
  nameHe: string;
  permissions: Permission[];
}

export const ROLES: RoleDef[] = [
  {
    code: "owner",
    nameHe: "בעלים",
    permissions: ALL_PERMISSIONS,
  },
  {
    code: "admin",
    nameHe: "מנהל",
    permissions: [
      "finance.read",
      "finance.write",
      "causes.read",
      "causes.write",
      "content.read",
      "content.write",
      "qr.read",
      "qr.write",
      "halacha.read",
      "system.read",
    ],
  },
  {
    code: "finance",
    nameHe: "כספים",
    permissions: ["finance.read", "finance.write", "causes.read"],
  },
  {
    code: "halacha",
    nameHe: "הלכה",
    permissions: ["halacha.read", "halacha.write", "content.read"],
  },
  {
    code: "viewer",
    nameHe: "צפייה",
    permissions: ["finance.read", "causes.read", "content.read", "qr.read", "halacha.read"],
  },
];

export function rolePermissions(code: string): Permission[] {
  return ROLES.find((r) => r.code === code)?.permissions ?? [];
}

export function can(permissions: Permission[], required: Permission): boolean {
  return permissions.includes(required);
}
