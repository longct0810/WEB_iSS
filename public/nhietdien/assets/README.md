# Nhiet Dien preview artwork

Artwork comes from the user-supplied `preview-nhietdien.zip` (12 October 2026).

The `equipment/` directory contains equipment illustrations cropped without labels or measurements: coal, storage, milling, boiler, turbine, generator, transformer, transmission tower, pumps, condenser, cooling towers, ash handling, ship/conveyor/unloader, SCR, ESP, FGD and stack.

All seven schematic layouts are inline SVG in `views/nhietdien/partials/diagram.ejs`. Every caption and reading is SVG text, with bound numeric fields marked `data-value` and statuses marked `data-state`. Whole-schematic bitmap assets have been removed.

`factory-banner.webp` and `factory-logo.webp` are decorative shell artwork. They are the only remaining whole-header / logo crops.

Data binding and integration examples: `docs/nhietdien-diagram-data.md`.
