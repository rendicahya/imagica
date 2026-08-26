# Imagica

**Explore Images. Experiment. Understand.**

Imagica is a frontend-only, interactive web application for teaching and learning Digital Image
Processing through direct experimentation. Upload an image (or pick a generated sample), tweak a
parameter, and watch the result — pixels, histogram, and math — update in real time.

Live at **https://rendicahya.github.io/imagica/**.

Imagica isn't an image editor or a toolbox of filters. Every module exists to answer one question:
_what is happening inside the image, and why?_

## Modules

- **Fundamentals** — Pixel Explorer, Resolution Explorer (sampling, quantization, interpolation)
- **Color** — RGB, HSV, CMYK mixers, Color Space Explorer (RGB/HSV/Lab/YCbCr), Grayscale Explorer
- **Enhancement** — Point Transformations, Custom Transfer Function, Thresholding, Histogram
  Explorer, Histogram Equalization
- **Filtering** — Convolution Playground, Smoothing, Sharpening, Custom Kernel Designer
- **Edge Detection** — Roberts, Prewitt, Sobel, Laplacian, Canny
- **Frequency Domain** — 2D DFT, spectrum visualization, low/high/band-pass filtering
- **Restoration** — Noise Explorer, Restoration Lab (MSE / PSNR / SSIM comparison)
- **Compression** — JPEG quality vs. file size vs. artifacts
- **Challenges** — open-ended tasks scored against a reference image

## Tech stack

Svelte 5 + SvelteKit, TypeScript, the Canvas API, and nothing else it can avoid — no backend, no
database, no auth. Image-processing algorithms are plain, pure functions
(`src/lib/image-processing/`) kept separate from the Svelte components that render them
(`src/lib/components/`), so the algorithms can be read, tested, and reused independently of the UI.

See [`CLAUDE.md`](./CLAUDE.md) for the full set of product and architecture conventions this
project follows.

## Developing

```sh
npm install
npm run dev -- --open
```

## Checking & formatting

```sh
npm run check   # svelte-check + TypeScript
npm run lint    # prettier --check + eslint
npm run format  # prettier --write
npm run test    # vitest
```

## Building

```sh
npm run build
npm run preview
```

The production build is fully static (via `@sveltejs/adapter-static`) and prerendered — every
route ships as plain HTML. Set `BASE_PATH` when building for a subdirectory deployment, e.g.
GitHub Pages:

```sh
BASE_PATH=/imagica npm run build
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it
to GitHub Pages automatically.
