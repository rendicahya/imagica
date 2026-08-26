CLAUDE.md — Imagica

Project Overview

Imagica is a frontend-only interactive web application for teaching and learning Digital Image Processing through direct experimentation.

The primary target users are undergraduate students learning Digital Image Processing.

Product tagline

«Explore Images. Experiment. Understand.»

Imagica is not simply an image editor or a collection of image-processing tools.

Its purpose is to help students understand image-processing concepts by allowing them to:

1. Upload or select an image.
2. Manipulate parameters.
3. Observe visual changes in real time.
4. Inspect changes at the pixel level.
5. See mathematical and algorithmic representations.
6. Explore concepts through experimentation.

The core idea is:

Concept
↓
Experiment
↓
Observe
↓
Explain
↓
Understand

Every feature should support this learning loop.

---

Core Product Philosophy

The central question behind every feature is:

«What is happening inside the image, and why?»

Do not design features as isolated image-processing tools.

A student should be able to connect:

Visual Result
↕
Pixel Values
↕
Mathematical Operation

For example:

Change Brightness
↓
Image Changes
↓
Histogram Changes
↓
Pixel Values Change
↓
Student Understands Why

Prefer educational clarity over technical complexity.

---

Technology Stack

Imagica must use:

- Svelte
- SvelteKit
- TypeScript
- Static Site Generation
- Canvas API
- Web Workers where appropriate
- GitHub Pages deployment

The application must remain:

- Frontend-only
- Fully static
- Backend-free
- Database-free
- Authentication-free
- Deployable to GitHub Pages

Do not introduce React or React-specific dependencies.

---

Svelte Guidelines

Use modern, idiomatic Svelte patterns.

Prefer:

- Svelte 5 patterns
- Runes where appropriate
- TypeScript
- Small focused components
- Explicit reactive data flow

Prefer:

User Input
↓
Reactive Parameter State
↓
Pure Image Processing Function
↓
Processed Image
↓
Reactive Visualization

Avoid:

- React-style patterns copied unnecessarily into Svelte
- Excessive global stores
- Complex state-management libraries unless clearly justified
- Unnecessary abstractions

Use Svelte because it makes the application simpler.

---

Svelte State Management

Use local reactive state for module-specific interactions.

Prefer:

- "$state"
- "$derived"
- "$effect"

when appropriate.

Example conceptual pattern:

let brightness = $state(0);

let processedImage = $derived(
originalImage
? applyBrightness(originalImage, brightness)
: null
);

Do not duplicate derived state.

Bad:

brightness
processedImage
histogram

when "processedImage" and "histogram" can be deterministically derived from the source image and processing parameters.

Prefer:

Source Image +
Parameters
↓
Processed Image
↓
Derived Visualization

---

Application Architecture

Use a structure similar to:

src/
│
├── routes/
│ │
│ ├── +page.svelte
│ │
│ ├── fundamentals/
│ │ ├── +page.svelte
│ │ ├── pixels/
│ │ │ └── +page.svelte
│ │ └── resolution/
│ │ └── +page.svelte
│ │
│ ├── color/
│ │ ├── +page.svelte
│ │ ├── rgb/
│ │ ├── cmyk/
│ │ ├── hsv/
│ │ └── color-space/
│ │
│ ├── enhancement/
│ │ ├── +page.svelte
│ │ ├── point-transformations/
│ │ ├── thresholding/
│ │ ├── histogram/
│ │ └── equalization/
│ │
│ ├── filtering/
│ │ ├── +page.svelte
│ │ ├── convolution/
│ │ ├── smoothing/
│ │ ├── sharpening/
│ │ └── custom-kernel/
│ │
│ ├── edge-detection/
│ │ └── +page.svelte
│ │
│ ├── frequency/
│ │ └── +page.svelte
│ │
│ ├── restoration/
│ │ └── +page.svelte
│ │
│ ├── compression/
│ │ └── +page.svelte
│ │
│ └── challenges/
│ └── +page.svelte
│
├── lib/
│ │
│ ├── components/
│ │ │
│ │ ├── image/
│ │ │ ├── ImageUploader.svelte
│ │ │ ├── ImageViewer.svelte
│ │ │ ├── PixelInspector.svelte
│ │ │ └── BeforeAfterViewer.svelte
│ │ │
│ │ ├── histogram/
│ │ │ └── HistogramViewer.svelte
│ │ │
│ │ ├── controls/
│ │ │ ├── ParameterSlider.svelte
│ │ │ ├── ParameterInput.svelte
│ │ │ ├── ParameterSelect.svelte
│ │ │ └── ControlPanel.svelte
│ │ │
│ │ ├── visualization/
│ │ │ ├── PixelGrid.svelte
│ │ │ ├── TransferFunction.svelte
│ │ │ ├── KernelVisualizer.svelte
│ │ │ └── FormulaViewer.svelte
│ │ │
│ │ ├── layout/
│ │ │
│ │ └── learning/
│ │ ├── ConceptIntroduction.svelte
│ │ ├── ExperimentWorkspace.svelte
│ │ └── ChallengePanel.svelte
│ │
│ ├── image-processing/
│ │ │
│ │ ├── core/
│ │ │ ├── image.ts
│ │ │ ├── pixel.ts
│ │ │ ├── color.ts
│ │ │ └── matrix.ts
│ │ │
│ │ ├── color/
│ │ │ ├── rgb.ts
│ │ │ ├── hsv.ts
│ │ │ ├── cmyk.ts
│ │ │ └── grayscale.ts
│ │ │
│ │ ├── enhancement/
│ │ │ ├── brightness.ts
│ │ │ ├── contrast.ts
│ │ │ ├── gamma.ts
│ │ │ ├── threshold.ts
│ │ │ ├── histogram.ts
│ │ │ └── equalization.ts
│ │ │
│ │ ├── filtering/
│ │ │ ├── convolution.ts
│ │ │ ├── kernels.ts
│ │ │ ├── smoothing.ts
│ │ │ └── sharpening.ts
│ │ │
│ │ ├── edge/
│ │ │ ├── sobel.ts
│ │ │ ├── prewitt.ts
│ │ │ ├── laplacian.ts
│ │ │ └── canny.ts
│ │ │
│ │ ├── frequency/
│ │ │ └── fourier.ts
│ │ │
│ │ └── metrics/
│ │ ├── mse.ts
│ │ ├── psnr.ts
│ │ └── ssim.ts
│ │
│ ├── workers/
│ │ ├── convolution.worker.ts
│ │ ├── histogram.worker.ts
│ │ └── frequency.worker.ts
│ │
│ ├── stores/
│ │ ├── image.svelte.ts
│ │ └── app.svelte.ts
│ │
│ └── types/
│ └── image.ts
│
└── app.html

This structure is a guideline, not a rigid requirement. Do not create empty folders or files before they are needed.

---

Separation of Responsibilities

Svelte Components

Svelte components are responsible for:

- User interaction
- Display
- Canvas integration
- Layout
- Parameter controls
- Educational visualization

Components must not contain complex image-processing algorithms.

---

Image Processing Modules

Image-processing modules are responsible for:

- Numerical computation
- Pixel transformation
- Color conversion
- Filtering
- Histogram calculation
- Image metrics

They must not:

- Manipulate the DOM
- Access Svelte component state directly
- Render to the UI
- Contain UI logic

Prefer pure functions.

Example:

process(
imageData,
parameters
): ImageData

Example:

applyBrightness(
imageData,
brightness
): ImageData

The Svelte component should call the algorithm and render the result.

---

Image Processing Rules

Preserve the Original Image

Never destructively modify the original uploaded image.

Maintain a conceptual pipeline:

Original Image
↓
Processing Parameters
↓
Processing Operation
↓
Processed Image

The original image must always remain recoverable.

Every processing module should provide a Reset action.

Reset should restore the experiment without requiring the user to upload the image again.

---

Avoid Accidental ImageData Mutation

Do not mutate shared "ImageData" objects unless mutation is explicitly intended and safely isolated.

Prefer:

Input ImageData
↓
Copy
↓
Process Copy
↓
Output ImageData

Do not allow a processing operation to corrupt the original source image.

---

Image Data Representation

When pixel-level operations are required, use browser-native:

ImageData

Expose image structure conceptually as:

Image
↓
Pixels
↓
Channels
↓
Numerical Values

When appropriate, users should be able to inspect:

Position:
(x, y)

RGB:
R = 124
G = 80
B = 32

Hex:
#7C5020

Grayscale:
93

---

Canvas Guidelines

Use Canvas API for image rendering and pixel processing.

Preferred conceptual flow:

HTMLImageElement
↓
Canvas
↓
ImageData
↓
Image Processing Function
↓
Output ImageData
↓
Canvas

Keep Canvas access inside UI/rendering layers.

Keep image-processing algorithms independent of Canvas whenever possible.

Do not make algorithm modules depend on:

HTMLCanvasElement
CanvasRenderingContext2D

unless there is a strong performance reason.

---

Performance

Imagica should feel interactive.

Prefer immediate feedback for simple operations.

Examples:

- RGB color mixing
- Brightness
- Contrast
- Gamma
- Thresholding
- Pixel inspection

For expensive operations, avoid freezing the UI.

Use:

- Debouncing where appropriate
- Downscaled preview processing
- Web Workers
- OffscreenCanvas when beneficial

Potential Web Worker candidates:

- Large convolution
- Fourier transforms
- Complex filtering
- Large histogram calculations
- SSIM calculations

Do not use Web Workers for trivial operations.

---

Educational UX Principles

Show, Don't Only Tell

Whenever possible, visualize concepts.

Do not explain convolution only with text.

Show:

Image Neighborhood
×
Kernel
↓
Multiply
↓
Sum
↓
Output Pixel

Do not explain histograms only with definitions.

Show:

Image +
Histogram +
Selected Intensity Range +
Highlighted Pixels

---

Immediate Feedback

Parameter changes should update visualizations as quickly as possible.

Examples:

- Moving a brightness slider updates the image.
- Changing gamma updates the transformation curve.
- Moving a threshold updates the binary image.
- Editing a kernel updates the filtered result.
- Adjusting RGB values updates the displayed color.

---

Progressive Complexity

Each module should support progressive learning.

Level 1 — Explore

Simple controls.

Example:

Brightness
◀────────●────────▶

Level 2 — Understand

Show supporting visualizations.

Example:

Input Histogram
↓
Output Histogram

Level 3 — Deep Dive

Expose mathematical or algorithmic details.

Example:

g(x, y) = αf(x, y) + β

Do not overwhelm beginners with all complexity at once.

Advanced details should be progressively revealed.

---

Module Design Pattern

Each learning module should follow this general structure:

Module
│
├── Introduction
│ ├── What is this concept?
│ └── Why does it matter?
│
├── Playground
│ ├── Input
│ ├── Controls
│ └── Live Output
│
├── Visual Explanation
│ ├── Pixels
│ ├── Histogram
│ ├── Formula
│ └── Process Visualization
│
├── Experiment
│ └── Guided Tasks
│
└── Challenge
└── Open Exploration

Not every module must implement every section.

The important principle is:

«Students should be able to experiment before receiving the complete explanation.»

---

Shared Components

Do not rebuild common functionality inside every module.

Build reusable components when the functionality appears in multiple modules.

Important shared components include:

ImageUploader

Responsibilities:

- Upload image
- Drag and drop
- Example images
- Reset image

---

ImageViewer

Responsibilities:

- Display image
- Zoom
- Pan
- Fit image to screen
- Pixel-perfect mode
- Optional overlays

---

PixelInspector

Display:

Position
RGB
Hex
Grayscale
Channel Values

Should be reusable across multiple modules.

---

BeforeAfterViewer

Compare:

Original
Processed

Support:

- Side-by-side comparison
- Split slider comparison
- Difference image

---

HistogramViewer

Support:

- Grayscale histogram
- RGB histogram
- Interactive bins
- Threshold markers
- Hover information

---

ParameterSlider

Every slider must show its exact numerical value.

Do not use sliders that hide the current value.

Prefer:

Label
Slider
Numeric Value
Reset

---

FormulaViewer

Display mathematical formulas and optionally connect variables to interactive parameters.

Example:

g(x, y) = αf(x, y) + β

When the user changes "α", the corresponding parameter should be visually identifiable.

---

Planned Learning Modules

1. Image Fundamentals

Topics:

- Digital image representation
- Sampling
- Quantization
- Resolution
- Bit depth

Interaction:

Original Image
↓
Adjust Sampling
↓
Adjust Quantization
↓
Observe Result

---

2. Pixel Explorer

Users should be able to:

- Upload an image
- Zoom deeply
- See individual enlarged pixels
- Hover over pixels
- Select pixels
- Inspect pixel values

Show:

(x, y)
RGB
Hex
Grayscale

Include:

- 4-neighborhood
- 8-neighborhood
- Pixel comparison

---

3. Resolution Explorer

Users can change:

- Width
- Height
- Scaling factor
- Interpolation method

Support:

- Nearest Neighbor
- Bilinear
- Bicubic

Allow side-by-side comparison.

---

4. RGB Color Mixer

Interactive controls:

Red
Green
Blue

Show:

- Resulting color
- RGB values
- Hex value
- Channel contribution

Conceptually:

R + G + B = Final Color

---

5. CMYK Color Mixer

Interactive controls:

Cyan
Magenta
Yellow
Black

Show how ink layers combine.

Clearly explain:

- Additive color
- Subtractive color

---

6. HSV Color Explorer

Interactive controls:

Hue
Saturation
Value

Visualize:

- Hue wheel
- Saturation
- Value

Support:

RGB ↔ HSV

---

7. Color Space Explorer

Allow users to inspect images across:

RGB
HSV
Lab
YCbCr

Show individual channels.

The goal is to demonstrate that the same image can have different numerical representations.

---

8. Grayscale Explorer

Support:

Average
Lightness
Luminosity
Custom Formula

Custom formula:

Gray = aR + bG + cB

Allow adjustment of:

a
b
c

---

9. Histogram Explorer

Show:

Image
Histogram
Pixel Distribution

Interactions:

- Hover over histogram bins
- Select intensity ranges
- Highlight corresponding pixels

Goal:

Students should understand the relationship between image pixels and histogram distribution.

---

10. Point Transformations

Support:

- Brightness
- Contrast
- Negative
- Gamma correction
- Custom transformation

Show:

Input Image
↓
Transformation Function
↓
Output Image

Always visualize the transfer function when appropriate.

---

11. Custom Transfer Function

Allow users to interactively create:

Input Intensity
↓
Custom Curve
↓
Output Intensity

The curve should directly control the image transformation.

---

12. Thresholding

Support:

- Global thresholding
- Adaptive thresholding

Show:

Image
Histogram
Threshold Marker
Binary Output

The threshold marker should move interactively.

---

13. Histogram Equalization

Visualize:

Image
↓
Histogram
↓
Probability Distribution
↓
CDF
↓
Intensity Mapping
↓
Equalized Image

Provide a step-by-step mode.

---

14. Convolution Playground

This is one of Imagica's core modules.

Show:

Image Neighborhood
×
Kernel
↓
Multiply
↓
Sum
↓
Output Pixel

Users should be able to:

- Select a pixel
- See its neighborhood
- Inspect the kernel
- Follow the convolution calculation
- Animate kernel movement

---

15. Custom Kernel Designer

Allow users to:

- Edit kernel values
- Change kernel size
- Apply kernels
- Create custom filters

Support:

3 × 3
5 × 5
7 × 7

Include presets:

- Blur
- Sharpen
- Edge detection
- Emboss
- Identity

---

16. Noise Explorer

Allow users to add:

- Gaussian noise
- Salt-and-pepper noise
- Speckle noise
- Gaussian blur
- Motion blur

Show:

Original
Degraded
Difference

---

17. Image Restoration Lab

Allow students to restore degraded images using:

- Mean filter
- Gaussian filter
- Median filter

Compare results using:

MSE
PSNR
SSIM

Encourage experimentation instead of immediately recommending the best solution.

---

18. Edge Detection Lab

Support:

- Roberts
- Prewitt
- Sobel
- Laplacian
- Canny

For gradient-based methods, visualize:

Gx
Gy
Gradient Magnitude

---

19. Frequency Domain Explorer

Visualize:

Spatial Domain
↓
Fourier Transform
↓
Frequency Spectrum
↓
Frequency Filter
↓
Inverse Transform
↓
Output Image

Allow users to manipulate masks directly on the frequency spectrum.

Support:

- Low-pass filtering
- High-pass filtering
- Band-pass filtering

---

20. Image Compression Explorer

Allow users to manipulate:

JPEG Quality

Show:

- Original image
- Compressed image
- File size
- Compression ratio
- Compression artifacts
- PSNR

Provide pixel-level zooming for artifacts.

---

Challenge Mode

Some modules should provide challenges.

Example:

Challenge:
Remove the noise while preserving image details.

The student should:

1. Inspect the image.
2. Identify the problem.
3. Select an operation.
4. Adjust parameters.
5. Compare the result.

Do not immediately reveal the solution.

Possible evaluation metrics:

PSNR
SSIM
MSE

Challenges should reward experimentation rather than memorization.

---

Accessibility

Support:

- Keyboard navigation
- Visible focus states
- Accessible labels
- Sufficient contrast
- Numeric alternatives for sliders

Do not rely exclusively on color to communicate information.

For color-related modules, always display numerical values.

---

Responsive Design

Imagica should work on:

- Desktop
- Tablet
- Mobile

Complex laboratory modules should primarily be optimized for larger screens.

On smaller screens:

- Stack panels vertically
- Allow fullscreen image viewing
- Keep controls accessible
- Avoid tiny interactive targets

Do not remove important functionality simply because the screen is small.

---

Visual Design

Imagica should feel:

Scientific +
Modern +
Playful +
Experimental

Avoid making it feel like:

- A corporate dashboard
- A generic admin panel
- A conventional photo editor

The image and the learning interaction should be the visual focus.

Prefer:

- Clean layouts
- Generous whitespace
- Strong visual hierarchy
- Interactive visualizations
- Clear parameter grouping

---

Dependency Philosophy

Prefer browser-native APIs and small dependencies.

Before adding a dependency, ask:

1. Can this be implemented using browser-native APIs?
2. Does the dependency solve a meaningful problem?
3. Does it significantly increase bundle size?
4. Is it necessary for the learning experience?

Avoid dependencies for simple UI behavior.

Do not add a library merely because it is popular.

---

Code Quality

When implementing functionality:

1. Prefer reusable abstractions.
2. Keep algorithms separate from UI components.
3. Write pure functions for image transformations.
4. Keep algorithms readable.
5. Comment non-obvious mathematical operations.
6. Prefer clarity over cleverness.
7. Avoid premature optimization.
8. Avoid unnecessary abstraction.
9. Use meaningful TypeScript types.
10. Keep components focused.

The codebase should be understandable by an instructor or student who wants to learn from it.

---

Testing

Test image-processing algorithms independently from the UI.

Use small synthetic images whenever possible:

1 × 1 image
2 × 2 image
3 × 3 image
Single bright pixel
Uniform image
Gradient image

Verify:

Input
↓
Expected Transformation
↓
Expected Output

Synthetic images are often easier to reason about than large photographs.

---

GitHub Pages Deployment

Imagica must be deployable as a static website.

Requirements:

- Use a static SvelteKit adapter.
- Support GitHub Pages deployment.
- Support repository subdirectory deployment.
- Use correct relative asset paths.
- Do not depend on server-side runtime features.
- Do not expose secrets.
- Ensure the production build works correctly from a GitHub Pages base path.

Do not assume deployment at the domain root.

Conceptually:

https://username.github.io/imagica/

All configuration must support this deployment model.

---

Development Priorities

Phase 1 — MVP

Build these modules first:

1. Pixel Explorer
2. RGB/HSV Color Playground
3. Histogram Explorer
4. Image Enhancement Playground
5. Convolution Visualizer

These modules establish Imagica's core interaction model.

---

Phase 2

Add:

- Thresholding
- Histogram Equalization
- Noise Explorer
- Image Restoration
- Edge Detection
- Custom Kernel Designer

---

Phase 3

Add:

- Frequency Domain Explorer
- Image Compression Explorer
- Advanced Challenges
- Additional advanced image-processing modules

---

Definition of Done

A feature is not complete simply because the algorithm works.

A feature is complete when:

1. The user can interact with it.
2. The visual result is correct.
3. Parameter values are understandable.
4. The underlying concept is visible.
5. The relationship between input and output is clear.
6. The feature works without a backend.
7. The original image remains recoverable.
8. The experiment can be reset.
9. The UI remains responsive.
10. The implementation follows the project's architectural principles.

---

Final Rule

When choosing between:

A technically impressive feature

and:

A feature that makes the concept easier to understand

prefer the second.

Imagica exists to make Digital Image Processing understandable through experimentation.

The goal is not merely to let students process images.

The goal is to let them:

«See the mathematics inside an image.»
