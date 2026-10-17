# Replacing a photo

Every photo on the site is a stand-in. To swap one for your own:

1. Pick the file you want to replace in `CREDITS.md` (it lists where each one appears).
2. Save your photo as a JPG with the exact same filename, for example `hero-high-wing-single-engine-dusk-ramp.jpg`.
3. Keep roughly the same shape (aspect ratio). A wide photo replaces a wide photo, a square-ish one replaces a square-ish one.
4. Also replace the matching `.webp` files with the same names (`-1600.webp`, `-800.webp`, and `-2400.webp` for the hero). Any image tool can export WebP at those widths. If you skip this step, browsers keep showing the old WebP version.
5. Update the alt text in the HTML if the new photo shows something different. Search the HTML files for the filename to find it.

No code changes are needed beyond that.

The Exterior wash, Wash & wax and Interior detail photos change with the aircraft class picker. Each of those cards lists its four photos in `data-photo-<class>` attributes, with matching `data-alt-<class>` text, in `index.html` and `services.html`. To use a different photo for a class, change the filename in that attribute.

Sizes used: the hero JPG is 2400 px wide, every other JPG is 1600 px wide.

The slot for a portrait of William is on `about.html`, marked with a `PORTRAIT SLOT` comment. It currently uses `cockpit-instrument-panel-single-engine.jpg`.

Logo files are cut from the original `aerocrest-logo.png`. The `-reversed` versions (white) are what the header and footer use on navy. Don't redraw them.
