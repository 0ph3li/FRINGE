# FRINGE — images

Every photo slot reads its file from this folder (`data-img`). Drop a file in with the exact name and it shows up. In the console, `fringe.missing()` lists the ones still waiting.

Originals are kept untouched in `_raw/`. What was done to them:
- product cut-outs (`p-*`, `s-*`): transparent margins trimmed, 3% padding, resized (1200 px for the poster, 900 px for the shelf) and converted to WebP. About 11 MB went down to 0.7 MB
- `s-spray`: the real brand's logo on the label was painted out and replaced with FRINGE / HAIR CARE
- `hero.jpg`: whites lifted to pure #fff, so the photo can be multiplied over the logo without a visible box

## home — `HOME/`

| file | where |
|---|---|
| `hero.jpg` | hero: the model sits on top of the word (pure white background, multiplied) |
| `r-scalp.jpg`, `r-treatment.jpg`, `r-lengths.jpg` | rituals i–iii (`r-lengths` also in the boutique's "can't decide") |
| `s-comb.webp` | rituals iv (brushing) uses the comb cut-out |
| `p-shampoo.webp`, `p-mask.webp`, `p-oil.webp` | the poster, one per product |
| `face.jpg`, `face-mask.jpg`, `face-oil.jpg` | the poster, left: they change with the product |
| `swatch.jpg`, `swatch-mask.webp`, `swatch-oil.webp` | the poster, right: they change with the product (mask and oil are cut out, so no grey square behind them) |
| `method.jpg` | the method spread (halftone reveal) |
| `band-hair.jpg`, `band-end.jpg` | storefront bands, and the two editorial tiles in the boutique |
| `s-shampoo`, `s-mask`, `s-serum`, `s-three`, `s-oil`, `s-spray`, `s-comb`, `s-clips` (`.webp`) | the boutique cards and quick views, the quiz routine |

## boutique — `BOUTIQUE/`

Cut out from the photos in `_raw/BOUTIQUE/` (white, checkerboard and beige backgrounds removed with a flood fill from the border, Pillow only). On `curl-harmony` the other brand's name was replaced with FRINGE.

| file | product | from |
|---|---|---|
| `curl-theory.webp` | Curl Theory, curl shampoo | `01.png` |
| `curl-harmony.webp` | Curl Harmony, curl conditioner | `02.png` |
| `sweetheart-comb.webp` | Sweetheart Comb | `03(portablehairbush).jpg` |
| `green-room.webp` | The Green Room, scalp ritual set | `04.png` |
| `strength-repair.webp` | Strength Repair, mask for fine hair | `05.png` |
| `angel-clips.webp` | Angel Clips | `06.jpg` |
| `head-rush.webp` | Head Rush, scalp massager | `07.jpg` |
| `blonde-duo.webp` | Blonde Duo, purple shampoo + conditioner | `08.png` |
| `beauty-sleep.webp` | Beauty Sleep, satin bonnet | `09.jpg` |
| `glass-veil.webp` | Glass Veil, anti-frizz spray | `10.png` |

The home's storefront rows use these (so they don't repeat the three products of the poster).

## salon — `SALON/`

| file | where |
|---|---|
| `hero.jpg` | salon hero, big photo (the salon interior) |
| `hero-small.jpg` | salon hero, small photo |
| `the-cut.jpg`, `the-fringe.jpg`, `the-color.jpg`, `bleach.jpg`, `toner-refresher.jpg`, `deep-treat.jpg`, `curls.jpg`, `blow-dry.jpg` | the menu: the photo that follows the cursor on each line |
| `nadia.jpg`, `kiki.jpg`, `mo.jpg` | the chairs |
| `end.jpg` | visit |
