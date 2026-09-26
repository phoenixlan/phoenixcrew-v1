# Multitenancy API gaps

Phoenix Crew is prepared for PhoenixJS 4.0 and brand-prefixed application URLs. The following upstream gaps are intentionally documented rather than worked around in this client:

- There is no API operation for listing every event belonging to one event brand. The client currently calls `getEvents()` and filters on `event_brand_uuid`.
- Several list operations remain global. They should eventually expose an event-brand filter so authorization and filtering happen server-side.
- Some crew-related responses do not include `event_brand_uuid`. Cross-brand links can only be produced when the related event can be matched to an accessible brand.
- Some API ACLs do not yet consistently match the `global:admin` and `brand:<uuid>:<permission>` JWT role model.
- PhoenixJS 4 removed the ticket transfer-log operation without a replacement. The ticket page therefore only shows events available directly on the ticket object.
- Permission changes in JWTs are not reflected until the access token is refreshed. A server/client strategy for eagerly refreshing permissions is still pending.

## Unreleased dependency

`package.json` temporarily remains on the published `@phoenixlan/phoenix.js` `^3.5.3` release so Docker Compose installs continue to work. Until 4.0.0 is published, multitenancy builds must use the locally built `../phoenixjs` package (for example through `yarn link`). Update both `package.json` and the Yarn lock entry after publication.
