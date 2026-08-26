<script lang="ts">
	import { resolve } from '$app/paths';

	const modules = [
		{
			href: '/filtering/convolution',
			title: 'Convolution Playground',
			description: 'Lihat cara kernel menghitung tiap pixel output.'
		},
		{
			href: '/filtering/smoothing',
			title: 'Smoothing',
			description: 'Box blur dan Gaussian blur.'
		},
		{
			href: '/filtering/sharpening',
			title: 'Sharpening',
			description: 'Pertegas tepi dan detail gambar.'
		},
		{
			href: '/filtering/custom-kernel',
			title: 'Custom Kernel Designer',
			description: 'Rancang kernel konvolusi sendiri.'
		}
	] as const;
</script>

<svelte:head>
	<title>Filtering — Imagica</title>
</svelte:head>

<article>
	<h1>Filtering</h1>
	<p>
		Operasi area (neighborhood operations) yang menghitung tiap pixel output dari sekumpulan pixel
		tetangganya.
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
