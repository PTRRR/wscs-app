<script lang="ts">
	import type { Article } from '../utilities/api/types';
	import { getApiObject } from '../utilities/api/utils';
	import LexicalReader from './LexicalReader.svelte';
	import Slideshow from './Slideshow.svelte';

	const props: {
		article: Article;
		baseUrl?: string;
	} = $props();

	const firstImage = getApiObject((props.article.slideshow || [])[0]);
</script>

<section class="article-home">
	{#if firstImage}
		<Slideshow baseUrl={props.baseUrl} slides={[firstImage]} width="100%" height="70vh" />
	{/if}
	<article class="article-home__content">
		<h1 class="article-home__title">
			{props.article.title}
		</h1>
		<div class="article-home__text">
			<LexicalReader content={props.article.content} maxLines={5} />
			<a href={`/articles/${props.article.slug}`}>Read more...</a>
		</div>
	</article>
</section>

<style lang="scss">
	.article-home {
		display: flex;
		flex-direction: column;

		&__content {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 1rem;
			height: 100%;
		}

		&__title {
			font-size: 1.5rem;
			font-family: Lescargot, 'Courier New', Courier, monospace;
		}

		&__text {
			max-width: 40rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
