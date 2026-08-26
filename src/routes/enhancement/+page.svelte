<script lang="ts">
	import { resolve } from '$app/paths';

	const modules = [
		{
			href: '/enhancement/point-transformations',
			title: 'Point Transformations',
			description: 'Brightness, contrast, negative, gamma.'
		},
		{
			href: '/enhancement/custom-transfer-function',
			title: 'Custom Transfer Function',
			description: 'Gambar kurva pemetaan intensitas Anda sendiri.'
		},
		{
			href: '/enhancement/thresholding',
			title: 'Thresholding',
			description: 'Ubah gambar menjadi biner.'
		},
		{
			href: '/enhancement/histogram',
			title: 'Histogram Explorer',
			description: 'Distribusi intensitas pixel.'
		},
		{
			href: '/enhancement/equalization',
			title: 'Histogram Equalization',
			description: 'Ratakan distribusi untuk menaikkan kontras.'
		}
	] as const;
</script>

<svelte:head>
	<title>Enhancement — Imagica</title>
</svelte:head>

<article>
	<h1>Enhancement</h1>
	<p>
		Operasi titik (point operations) yang mengubah nilai tiap pixel berdasarkan fungsi transformasi.
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
