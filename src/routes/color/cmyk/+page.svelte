<script lang="ts">
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import { cmykToRgb } from '$lib/image-processing/color/cmyk';
	import { toHex } from '$lib/image-processing/core/pixel';

	let c = $state(38);
	let m = $state(60);
	let y = $state(0);
	let k = $state(22);

	let rgb = $derived(cmykToRgb(c, m, y, k));
</script>

<svelte:head>
	<title>CMYK Color Mixer — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>CMYK Color Mixer</h1>
		<p>
			Layar mencampur cahaya secara <strong>aditif</strong> (RGB): menambah cahaya membuat warna
			makin terang menuju putih. Tinta mencampur warna secara <strong>subtraktif</strong> (CMYK): menambah
			tinta menyerap lebih banyak cahaya menuju hitam.
		</p>
	</header>

	<section class="workspace">
		<div class="controls">
			<ParameterSlider label="Cyan" bind:value={c} min={0} max={100} defaultValue={38} unit="%" />
			<ParameterSlider
				label="Magenta"
				bind:value={m}
				min={0}
				max={100}
				defaultValue={60}
				unit="%"
			/>
			<ParameterSlider label="Yellow" bind:value={y} min={0} max={100} defaultValue={0} unit="%" />
			<ParameterSlider
				label="Key (Black)"
				bind:value={k}
				min={0}
				max={100}
				defaultValue={22}
				unit="%"
			/>
		</div>

		<div class="preview">
			<div class="swatch" style:background-color="rgb({rgb.r} {rgb.g} {rgb.b})"></div>
			<dl>
				<dt>RGB hasil</dt>
				<dd>R={rgb.r} G={rgb.g} B={rgb.b}</dd>
				<dt>Hex</dt>
				<dd>{toHex(rgb.r, rgb.g, rgb.b)}</dd>
			</dl>
		</div>
	</section>
</article>

<style>
	article {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem;
		max-width: 48rem;
		margin: 0 auto;
	}

	.workspace {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.controls {
		flex: 1;
		min-width: 16rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.swatch {
		width: 8rem;
		height: 8rem;
		border-radius: 0.75rem;
		border: 1px solid var(--color-border, #ccc);
	}

	dl {
		display: grid;
		grid-template-columns: auto auto;
		column-gap: 0.75rem;
		font-variant-numeric: tabular-nums;
		margin: 0;
	}

	dt {
		color: var(--color-muted, #666);
	}

	dd {
		margin: 0;
	}
</style>
