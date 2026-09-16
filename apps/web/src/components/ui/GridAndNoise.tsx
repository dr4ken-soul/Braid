/**
 * Page backdrop: technical grid plus administration noise grain.
 *
 * Exact classes come from FRONTEND_SPEC.md section 8. The grid uses CSS
 * gradients, the grain uses an inline CSS generated SVG turbulence tile.
 * Both layers are decorative and sit at z-10 under section content.
 */

const NOISE_SVG_BODY = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">',
  '<filter id="braid-noise-filter">',
  '<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>',
  '<feColorMatrix type="saturate" values="0"/>',
  '</filter>',
  '<rect width="256" height="256" filter="url(#braid-noise-filter)"/>',
  '</svg>',
].join('');

const NOISE_DATA_URI = `data:image/svg+xml,${encodeURIComponent(NOISE_SVG_BODY)}`;

export function GridAndNoise() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.16] [background-image:linear-gradient(to_right,rgba(240,238,231,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(240,238,231,0.08)_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.035]"
        style={{ backgroundImage: `url("${NOISE_DATA_URI}")` }}
      />
    </>
  );
}
