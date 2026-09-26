export const GLOBAL_ADMIN_ROLE = "global:admin";

export const getBrandRole = (brandUuid, permission) => `brand:${brandUuid}:${permission}`;

export const isGlobalAdmin = (roles = []) => roles.includes(GLOBAL_ADMIN_ROLE);

export const getBrandUuidsFromRoles = (roles = []) => Array.from(new Set(
    roles
        .map(role => /^brand:([^:]+):[^:]+$/.exec(role))
        .filter(Boolean)
        .map(match => match[1])
));

export const hasBrandPermission = (roles = [], brandUuid, permission) => (
    isGlobalAdmin(roles) ||
    roles.includes(getBrandRole(brandUuid, "admin")) ||
    roles.includes(getBrandRole(brandUuid, permission))
);

export const hasAnyBrandPermission = (roles = [], brandUuid, permissions = []) => (
    isGlobalAdmin(roles) ||
    roles.includes(getBrandRole(brandUuid, "admin")) ||
    permissions.some(permission => roles.includes(getBrandRole(brandUuid, permission)))
);
