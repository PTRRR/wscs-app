<script lang="ts">
	import LexicalReader from '../../../../components/LexicalReader.svelte';
	import Slideshow from '../../../../components/Slideshow.svelte';
	import { getApiObject } from '../../../../utilities/api/utils';
	import { filterNullish } from '../../../../utilities/iterables';
	import type { PageData } from './$types';

	const props: { data: PageData } = $props();
	const { article, api } = props.data;

	const slides = (article.slideshow?.map((slide) => getApiObject(slide)) || []).filter(
		filterNullish
	);
</script>

<svelte:head>
	<title>{article.title}</title>
</svelte:head>

<div class="article">
	<Slideshow baseUrl={api.baseUrl} {slides} height="60vh" />

	<article>
		<h1>{article.title}</h1>
		<div class="article__content">
			<LexicalReader content={article.content} />
		</div>
	</article>
</div>

<style lang="scss">
	.article {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		h1 {
			text-align: center;
			font-family: Lescargot, 'Courier New', Courier, monospace;
		}

		&__content {
			max-width: 40rem;
		}
	}
</style>
