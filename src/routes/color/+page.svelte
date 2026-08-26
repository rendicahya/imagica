<script lang="ts">
	import { resolve } from '$app/paths';

	const modules = [
		{
			href: '/color/rgb',
			title: 'RGB Color Mixer',
			description: 'Campur cahaya merah, hijau, biru.'
		},
		{
			href: '/color/hsv',
			title: 'HSV Color Explorer',
			description: 'Hue, Saturation, Value pada roda warna.'
		},
		{
			href: '/color/cmyk',
			title: 'CMYK Color Mixer',
			description: 'Warna subtraktif ala percetakan.'
		},
		{
			href: '/color/color-space',
			title: 'Color Space Explorer',
			description: 'Bandingkan channel RGB, HSV, Lab, YCbCr.'
		},
		{
			href: '/color/grayscale',
			title: 'Grayscale Explorer',
			description: 'Beberapa cara mengubah warna jadi abu-abu.'
		}
	] as const;
</script>

<svelte:head>
	<title>Color — Imagica</title>
</svelte:head>

<article>
	<h1>Color</h1>
	<p>
		Bagaimana warna direpresentasikan secara numerik, dan bagaimana ruang warna berbeda saling
		berkaitan.
	</p>

	<ul class="grid">
		{#each modules as module (module.href)}
			<li>
				<a href={resolve(module.href)}>
					<h2>{module.title}</h2>
					<p>{module.description}</p>
				</a>
			</li>
		{/each}
	</ul>
</article>

<style>
	article {
		padding: 1.5rem;
		max-width: 60rem;
		margin: 0 auto;
	}

	.grid {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 1rem;
		padding: 0;
	}

	.grid a {
		display: block;
		padding: 1rem;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 0.5rem;
		text-decoration: none;
		color: inherit;
	}

	.grid a:hover {
		border-color: var(--color-accent, #6366f1);
	}

	.grid h2 {
		margin: 0 0 0.25rem;
		font-size: 1rem;
	}

	.grid p {
		margin: 0;
		color: var(--color-muted, #666);
		font-size: 0.875rem;
	}
</style>
