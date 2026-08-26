<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';

	let { children } = $props();

	const nav = [
		{ href: '/fundamentals', label: 'Fundamentals' },
		{ href: '/color', label: 'Color' },
		{ href: '/enhancement', label: 'Enhancement' },
		{ href: '/filtering', label: 'Filtering' },
		{ href: '/edge-detection', label: 'Edge Detection' },
		{ href: '/frequency', label: 'Frequency' },
		{ href: '/restoration', label: 'Restoration' },
		{ href: '/compression', label: 'Compression' },
		{ href: '/challenges', label: 'Challenges' }
	] as const;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	<header class="topbar">
		<a class="brand" href={resolve('/')}>Imagica</a>
		<nav>
			{#each nav as item (item.href)}
				<a href={resolve(item.href)}>{item.label}</a>
			{/each}
		</nav>
	</header>

	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.topbar {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 0.75rem 1.5rem;
		border-bottom: 1px solid var(--color-border, #e5e5e5);
		flex-wrap: wrap;
	}

	.brand {
		font-weight: 700;
		text-decoration: none;
		color: inherit;
		font-size: 1.1rem;
	}

	.topbar nav {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: 0.875rem;
	}

	.topbar nav a {
		text-decoration: none;
		color: var(--color-muted, #666);
	}

	.topbar nav a:hover {
		color: var(--color-accent, #6366f1);
	}

	main {
		flex: 1;
	}
</style>
