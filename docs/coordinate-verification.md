# Coordinate verification

MyGeomatics v0.3 provides a public workspace for finding and reviewing coordinate candidates without publishing unverified organisation locations.

## Review workflow

1. Select one of the Malaysian organisation or branch records from the directory.
2. Run a manual address search or enter decimal-degree coordinates.
3. Inspect the candidate on the embedded map.
4. Cross-check the same point in OpenStreetMap and at least one independent visual reference such as Google Maps satellite view or Google Earth.
5. Confirm the building or entrance, branch identity, city and state.
6. Open the pre-filled GitHub proposal and include evidence a maintainer can reproduce.
7. A maintainer reviews the proposal before updating the canonical workbook and publishing the coordinate.

Search results, manually entered values and GitHub proposals are candidates. None are automatically written to the public directory.

## Data layers

- **Research coverage** is a hotspot calculated from directory counts by Malaysian state. Each point is an approximate state display anchor, not an organisation coordinate.
- **Verified locations** accepts only records that pass the project's coordinate publication rules. Until records are reviewed, the layer remains empty by design.

## Source and service rules

- OpenStreetMap tiles retain visible contributor attribution and are requested interactively. The application does not prefetch or bulk-download tiles.
- Nominatim searches are initiated by a user, restricted to Malaysia, delayed to no more than one request per second in the interface and cached for the browser session. There is no autocomplete or bulk geocoding.
- Google Maps and Google Earth are external cross-check links. MyGeomatics does not copy or embed Google imagery and does not treat imagery alone as proof of an organisation's current occupancy.

## Privacy and operational limits

The workspace does not continuously track people or organisations. Browser geolocation is optional and used only when the user presses the map's Locate control. Public coordinate searches are sent to the selected external service according to its privacy policy. A production backend, private review queue and organisation accounts remain outside this MVP.
