<script lang="ts">
	import { resolve } from '$app/paths';

	const groups = [
		{
			href: '/fundamentals',
			title: 'Fundamentals',
			description: 'Pixel, resolusi, sampling, quantization.'
		},
		{ href: '/color', title: 'Color', description: 'RGB, HSV, CMYK, color space, grayscale.' },
		{
			href: '/enhancement',
			title: 'Enhancement',
			description: 'Point transformations, thresholding, histogram, equalization.'
		},
		{
			href: '/filtering',
			title: 'Filtering',
			description: 'Convolution, smoothing, sharpening, custom kernel.'
		},
		{
			href: '/edge-detection',
			title: 'Edge Detection',
			description: 'Roberts, Prewitt, Sobel, Laplacian, Canny.'
		},
		{
			href: '/frequency',
			title: 'Frequency Domain',
			description: 'Fourier transform dan filter frekuensi.'
		},
		{ href: '/restoration', title: 'Restoration', description: 'Noise dan filter restorasi.' },
		{
			href: '/compression',
			title: 'Compression',
			description: 'Kualitas JPEG dan artefak kompresi.'
		},
		{
			href: '/challenges',
			title: 'Challenges',
			description: 'Eksplorasi terbuka dengan metrik evaluasi.'
		}
	] as const;
</script>

<svelte:head>
	<title>Imagica</title>
</svelte:head>

<article>
	<h1>Imagica</h1>
	<p class="tagline">Explore Images. Experiment. Understand.</p>
	<p>
		Imagica adalah aplikasi interaktif untuk mempelajari Digital Image Processing melalui eksperimen
		langsung. Unggah gambar, ubah parameter, dan lihat bagaimana matematika di balik gambar bekerja
		secara real-time.
	</p>

	<ul class="grid">
		{#each groups as group (group.href)}
			<li>
				<a href={resolve(group.href)}>
					<h2>{group.title}</h2>
					<p>{group.description}</p>
				</a>
			</li>
		{/each}
	</ul>
</article>

<style>
	article {
		padding: 1.5rem;
		max-width: 64rem;
		margin: 0 auto;
	}

	.tagline {
		font-style: italic;
		color: var(--color-muted, #666);
	}

	.grid {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 1rem;
		padding: 0;
		margin-top: 2rem;
	}

	.grid a {
		display: block;
		padding: 1.25rem;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 0.75rem;
		text-decoration: none;
		color: inherit;
	}

	.grid a:hover {
		border-color: var(--color-accent, #6366f1);
	}

	.grid h2 {
		margin: 0 0 0.35rem;
		font-size: 1.05rem;
	}

	.grid p {
		margin: 0;
		color: var(--color-muted, #666);
		font-size: 0.875rem;
	}
</style>
