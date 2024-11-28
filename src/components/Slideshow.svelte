<script lang="ts">
	import type { Media } from '../utilities/api/types';
	import { css } from '../utilities/css';
	import Image from './Image.svelte';

	const props: {
		width?: string;
		height?: string;
		slides: Partial<Media>[];
		baseUrl?: string;
	} = $props();

	const getBaseImage = (image: Partial<Media>) =>
		image.sizes?.largeWebp || image.sizes?.large || image.sizes?.webp || image;
</script>

<div
	class="slideshow"
	style={css({
		'--width': props.width || '100%',
		'--height': props.height || '100%'
	})}
>
	{#each props.slides as slide}
		{#if slide.url}
			<div class="slideshow__slide">
				<Image
					baseUrl={props.baseUrl}
					src={getBaseImage(slide).url || ''}
					width={getBaseImage(slide).width}
					height={getBaseImage(slide).height}
					alt={slide.alt}
					srcsets={[
						{ src: slide.sizes?.mediumWebp?.url, maxWidth: slide.sizes?.mediumWebp?.width },
						{ src: slide.sizes?.medium?.url, maxWidth: slide.sizes?.medium?.width },
						{ src: slide.sizes?.small?.url, maxWidth: slide.sizes?.small?.width },
						{ src: slide.sizes?.smallWebp?.url, maxWidth: slide.sizes?.smallWebp?.width },
						{ src: slide.sizes?.webp?.url }
					]}
				/>
			</div>
		{/if}
	{/each}
</div>

<style lang="scss">
	.slideshow {
		position: relative;
		width: var(--width);
		height: var(--height);
		overflow: hidden;

		&__slide {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			:global(picture) {
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: center;
			}
		}
	}
</style>
