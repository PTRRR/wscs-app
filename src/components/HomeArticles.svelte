<script lang="ts">
	import type { Article, FeaturedArticle } from '../utilities/api/types';
	import { getApiObject } from '../utilities/api/utils';
	import { filterNullish } from '../utilities/iterables';
	import LexicalReader from './LexicalReader.svelte';
	import ReadMoreButton from './ReadMoreButton.svelte';
	import Slideshow from './Slideshow.svelte';

	const props: {
		articles: FeaturedArticle['rows'];
		baseUrl?: string;
	} = $props();

	const getArticleFirstImage = (article?: Article | null) =>
		getApiObject((article?.slideshow || [])[0]);

	const getArticleFirsttextBlock = (article?: Article | null) =>
		(article?.content?.filter((it) => it.blockType === 'Text') || [])[0];

	const formattedRows = $derived.by(() => {
		return (
			props.articles?.map((it) =>
				(it.articles?.map(getApiObject).filter(filterNullish) || []).map((it) => ({
					...it,
					article: {
						...(getApiObject(it.article) || {}),
						firstImage: getArticleFirstImage(getApiObject(it.article)),
						firstTextBock: getArticleFirsttextBlock(getApiObject(it.article))
					}
				}))
			) || []
		);
	});
</script>

<section class="articles-home">
	{#each formattedRows as row}
		<div class="articles-home__row">
			{#each row || [] as { article }}
				<article class="articles-home__article" class:articles-home--full={row.length === 1}>
					{#if article.firstImage}
						<Slideshow baseUrl={props.baseUrl} slides={[article.firstImage]} />
					{/if}

					<h1 class="articles-home__title">
						{article.title}
					</h1>

					{#if article.firstTextBock}
						<div class="articles-home__text">
							<LexicalReader content={article.firstTextBock.content} maxLines={4} />
							<ReadMoreButton href={`/articles/${article.slug}`} />
						</div>
					{/if}
				</article>
			{/each}
		</div>
	{/each}
</section>

<style lang="scss">
	.articles-home {
		$root: &;
		display: flex;
		flex-direction: column;

		&__row {
			display: flex;
			justify-content: center;
			align-items: center;
			border-bottom: solid 1px var(--light-gray);
			padding: 2rem 0;
			gap: 2rem;
		}

		&__row:first-child {
			padding-top: 0;
		}

		&__article {
			display: flex;
			flex-direction: column;
			width: 50vh;
			/* max-width: 50vh; */

			:global(.slideshow) {
				height: 60vh;
			}
		}

		&--full {
			width: 100%;
			text-align: center;
			justify-content: center;
			align-items: center;

			#{$root}__text {
				align-items: center;
				padding: 0 var(--main-padding);
			}

			:global(.slideshow) {
				height: 70vh;
				width: 100%;
			}
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

		@media screen and (max-width: 1000px) {
			&__row {
				flex-direction: column;
				padding-top: 0;
			}

			&__article {
				text-align: center;
				justify-content: center;
				align-items: center;
				width: 100%;

				#{$root}__text {
					align-items: center;
					padding: 0 var(--main-padding);
				}

				:global(.slideshow) {
					height: 50vh;
				}
			}
		}
	}
</style>
