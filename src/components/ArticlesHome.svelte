<script lang="ts">
	import type { Article } from '../utilities/api/types';
	import { getApiObject } from '../utilities/api/utils';

	const props: {
		article: Article;
	} = $props();

	const firstImage = getApiObject((props.article.slideshow || [])[0]);
</script>

<section class="article-home">
	<div class="article-home__cover">
		{#if firstImage}
			<img src={`http://localhost:3000/${firstImage.url}`} alt="" />
		{/if}
	</div>
	<article class="article-home__content">
		<div class="article-home__title">{props.article.title}</div>
		<div class="article-home__text">
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto, quas at similique
			veritatis quaerat aliquid possimus numquam laborum eos, enim fuga voluptatibus? Suscipit vitae
			vel nisi, maiores iusto nemo et!
		</div>
	</article>
</section>

<style lang="scss">
	.article-home {
		display: flex;
		flex-direction: column;

		&__cover {
			width: 100%;
			height: 70vh;
			background-color: lightgray;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: center;
			}
		}

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
