<script lang="ts">
	import { joinPaths } from '../utilities/urls';

	const props: {
		baseUrl?: string;
		src: string;
		srcsets?: { src?: string | null }[];
		alt?: string | null;
	} = $props();

	const { baseUrl, srcsets, src, alt } = props;
	const getUrlMimeType = (url: string) => (url.includes('webp') ? 'image/webp' : 'image/jpeg');
	const getFullUrl = (url: string) => joinPaths(baseUrl || 'http://localhost:3000', url);

	let isLoaded = $state(false);
</script>

<picture class="picture" class:picture--loading={!isLoaded}>
	{#each srcsets || [] as srcset}
		{#if srcset.src}
			<source srcset={getFullUrl(srcset.src)} type={getUrlMimeType(srcset.src)} />
		{/if}
	{/each}
	<img src={getFullUrl(src)} {alt} onload={() => (isLoaded = true)} />
</picture>

<style lang="scss">
	.picture {
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
