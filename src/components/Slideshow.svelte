<script lang="ts">
	import type { Media } from '../utilities/api/types';
	import { css } from '../utilities/css';

	const props: {
		width?: string;
		height?: string;
		slides: Partial<Media>[];
	} = $props();

	const getSlideUrl = (url: string) => {
		return `http://localhost:3000/${url}`;
	};
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
				<img src={getSlideUrl(slide.url)} alt={slide.alt} />
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

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: center;
			}
		}
	}
</style>
