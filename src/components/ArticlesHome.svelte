<script lang="ts">
	import type { Article } from '../utilities/api/types';
	import { getApiObject } from '../utilities/api/utils';
	import LexicalReader from './LexicalReader.svelte';
	import Slideshow from './Slideshow.svelte';

	const props: {
		article: Article;
	} = $props();

	const firstImage = getApiObject((props.article.slideshow || [])[0]);
</script>

<section class="article-home">
	{#if firstImage}
		<Slideshow slides={[firstImage]} width="100%" height="70vh" />
	{/if}
	<article class="article-home__content">
		<div class="article-home__title">
			<a href={`/articles/${props.article.id}`}>{props.article.title}</a>
		</div>
		<div class="article-home__text">
			<LexicalReader content={props.article.content} maxLines={5} />
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
		}

		&__text {
			max-width: 40rem;
		}
	}
</style>
