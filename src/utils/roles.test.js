import {
    getBrandUuidsFromRoles,
    hasAnyBrandPermission,
    hasBrandPermission,
    isGlobalAdmin,
} from "./roles";

describe("multitenant roles", () => {
    test("extracts and deduplicates brand UUIDs from scoped roles", () => {
        expect(getBrandUuidsFromRoles([
            "user:1",
            "member",
            "brand:a:member",
            "brand:a:chief",
            "brand:b:ticket_admin",
            "brand:broken",
        ])).toEqual(["a", "b"]);
    });

    test("recognises global and brand administrators", () => {
        expect(isGlobalAdmin(["global:admin"])).toBe(true);
        expect(hasBrandPermission(["global:admin"], "a", "ticket_admin")).toBe(true);
        expect(hasBrandPermission(["brand:a:admin"], "a", "ticket_admin")).toBe(true);
        expect(hasBrandPermission(["brand:a:admin"], "b", "ticket_admin")).toBe(false);
    });

    test("checks a list of scoped permissions", () => {
        expect(hasAnyBrandPermission(["brand:a:chief"], "a", ["chief", "crew_card_printer"])).toBe(true);
        expect(hasAnyBrandPermission(["brand:a:member"], "a", ["chief", "crew_card_printer"])).toBe(false);
    });
});
