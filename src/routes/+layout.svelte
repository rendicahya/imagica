<script lang="ts">
	import '../app.css';
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

	function initialTheme(): 'light' | 'dark' {
		if (typeof localStorage === 'undefined') return 'light';
		const stored = localStorage.getItem('imagica-theme');
		if (stored === 'light' || stored === 'dark') return stored;
		return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	let theme = $state<'light' | 'dark'>(initialTheme());
	let isFullscreen = $state(false);

	$effect(() => {
		document.documentElement.dataset.theme = theme;
	});

	$effect(() => {
		function handleFullscreenChange() {
			isFullscreen = document.fullscreenElement !== null;
		}

		document.addEventListener('fullscreenchange', handleFullscreenChange);
		return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('imagica-theme', theme);
	}

	function toggleFullscreen() {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen().catch(() => {});
		}
	}
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

		<div class="topbar-actions">
			<button
				type="button"
				class="icon-button"
				onclick={toggleTheme}
				aria-label={theme === 'light' ? 'Aktifkan mode gelap' : 'Aktifkan mode terang'}
				title={theme === 'light' ? 'Mode gelap' : 'Mode terang'}
			>
				{#if theme === 'light'}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="4" />
						<path
							d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
						/>
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
					</svg>
				{/if}
			</button>

			<button
				type="button"
				class="icon-button"
				onclick={toggleFullscreen}
				aria-label={isFullscreen ? 'Keluar dari layar penuh' : 'Layar penuh'}
				title={isFullscreen ? 'Keluar dari layar penuh' : 'Layar penuh'}
			>
				{#if isFullscreen}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path
							d="M9 3v4a2 2 0 0 1-2 2H3M21 9h-4a2 2 0 0 1-2-2V3M3 15h4a2 2 0 0 1 2 2v4M15 21v-4a2 2 0 0 1 2-2h4"
						/>
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path
							d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4"
						/>
					</svg>
				{/if}
			</button>
		</div>
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
		flex: 1;
	}

	.topbar nav a {
		text-decoration: none;
		color: var(--color-muted, #666);
	}

	.topbar nav a:hover {
		color: var(--color-accent, #6366f1);
	}

	.topbar-actions {
		display: flex;
		gap: 0.5rem;
	}

	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		padding: 0;
	}

	.icon-button svg {
		width: 1.1rem;
		height: 1.1rem;
	}

	main {
		flex: 1;
	}
</style>
