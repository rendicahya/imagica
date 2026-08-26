<script lang="ts">
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import { hsvToRgb } from '$lib/image-processing/color/hsv';
	import { toHex } from '$lib/image-processing/core/pixel';

	let h = $state(260);
	let s = $state(60);
	let v = $state(78);

	let rgb = $derived(hsvToRgb(h, s, v));

	// Conic gradient markers, one every 30 degrees, tracing the pure-hue ring at full S/V.
	const wheelStops = Array.from({ length: 13 }, (_, i) => {
		const deg = i * 30;
		const { r, g, b } = hsvToRgb(deg, 100, 100);
		return `rgb(${r} ${g} ${b}) ${deg}deg`;
	}).join(', ');
</script>

<svelte:head>
	<title>HSV Color Explorer — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>HSV Color Explorer</h1>
		<p>
			Hue menentukan jenis warna, Saturation menentukan kemurniannya, dan Value menentukan
			kecerahannya.
		</p>
	</header>

	<section class="workspace">
		<div class="wheel-wrap">
			<div class="wheel" style:background="conic-gradient(from 0deg, {wheelStops})">
				<div
					class="marker"
					style:left="{50 + (s / 100) * 45 * Math.cos((h * Math.PI) / 180)}%"
					style:top="{50 + (s / 100) * 45 * Math.sin((h * Math.PI) / 180)}%"
				></div>
			</div>
		</div>

		<div class="controls">
			<ParameterSlider label="Hue" bind:value={h} min={0} max={360} defaultValue={260} unit="°" />
			<ParameterSlider
				label="Saturation"
				bind:value={s}
				min={0}
				max={100}
				defaultValue={60}
				unit="%"
			/>
			<ParameterSlider label="Value" bind:value={v} min={0} max={100} defaultValue={78} unit="%" />

			<div class="preview">
				<div class="swatch" style:background-color="rgb({rgb.r} {rgb.g} {rgb.b})"></div>
				<dl>
					<dt>RGB</dt>
					<dd>R={rgb.r} G={rgb.g} B={rgb.b}</dd>
					<dt>Hex</dt>
					<dd>{toHex(rgb.r, rgb.g, rgb.b)}</dd>
				</dl>
			</div>
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

	.wheel-wrap {
		flex-shrink: 0;
	}

	.wheel {
		position: relative;
		width: 14rem;
		height: 14rem;
		border-radius: 50%;
		border: 1px solid var(--color-border, #ccc);
	}

	.marker {
		position: absolute;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		border: 2px solid white;
		box-shadow: 0 0 0 1px black;
		transform: translate(-50%, -50%);
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
		align-items: center;
		gap: 1rem;
	}

	.swatch {
		width: 5rem;
		height: 5rem;
		border-radius: 0.75rem;
		border: 1px solid var(--color-border, #ccc);
		flex-shrink: 0;
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
