<script lang="ts">
	import { filterNullish } from '../utilities/iterables';
	import { joinPaths } from '../utilities/urls';

	type Srcset = {
		src?: string | null;
		minWidth?: number | null;
		maxWidth?: number | null;
	};

	const props: {
		baseUrl?: string;
		src: string;
		srcsets?: Srcset[];
		alt?: string | null;
		width?: number | null;
		height?: number | null;
		lazyload?: boolean;
	} = $props();

	const { baseUrl, srcsets, src, alt, width, height, lazyload } = props;

	const getUrlMimeType = (url: string) => (url.includes('webp') ? 'image/webp' : 'image/jpeg');
	const getFullUrl = (url: string) => joinPaths(baseUrl || 'http://localhost:3000', url);

	let isLoaded = $state(false);

	const getSourceMediaTag = (srcset: Srcset) =>
		[
			srcset.minWidth ? `(min-width: ${srcset.minWidth}px)` : undefined,
			srcset.maxWidth ? `(max-width: ${srcset.maxWidth}px)` : undefined
		]
			.filter(filterNullish)
			.join(' ');
</script>

<picture class="picture" class:picture--loading={!isLoaded}>
	{#each srcsets || [] as srcset}
		{#if srcset.src}
			<source
				srcset={getFullUrl(srcset.src)}
				type={getUrlMimeType(srcset.src)}
				media={getSourceMediaTag(srcset)}
			/>
		{/if}
	{/each}
	<img
		src={getFullUrl(src)}
		alt={alt || ''}
		{width}
		{height}
		onload={() => (isLoaded = true)}
		loading={lazyload ? 'lazy' : undefined}
	/>
</picture>

<style lang="scss">
	.picture {
		display: flex;

		&--loading {
			background-color: lightgray;
		}

		img {
			width: inherit;
			height: inherit;
			object-fit: inherit;
		}
	}
</style>
