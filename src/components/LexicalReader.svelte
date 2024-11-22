<script lang="ts">
	import LexicalNode from './LexicalNode.svelte';
	import type { LexicalRoot } from './LexicalNode.svelte';

	const props: { content?: LexicalRoot | null; maxLines?: number } = $props();
	import { css } from '../utilities/css';
</script>

<div
	class="lexical-reader"
	style={css({
		'--max-lines': props.maxLines || undefined
	})}
>
	{#if props.content?.root}
		{#if typeof props.maxLines === 'number'}
			<div class="lexical-reader__multiline-ellipsis">
				<LexicalNode node={props.content.root} />
			</div>
		{:else}
			<LexicalNode node={props.content.root} />
		{/if}
	{/if}
</div>

<style lang="scss">
	.lexical-reader {
		--line-height: 1.5em;
		line-height: var(--line-height);
	}
	.lexical-reader__multiline-ellipsis {
		display: -webkit-box;
		line-clamp: var(--max-lines);
		-webkit-line-clamp: var(--max-lines); /* Number of lines to show */
		-webkit-box-orient: vertical;
		overflow: hidden;

		/* Fallback for browsers that don't support -webkit-line-clamp */
		max-height: calc(var(--max-lines) * var(--line-height));
		position: relative;
	}

	/* Fallback ellipsis for non-supporting browsers */
	@supports not (-webkit-line-clamp: 3) {
		.lexical-reader__multiline-ellipsis::after {
			content: '...';
			position: absolute;
			right: 0;
			bottom: 0;
			background: white; /* Match your background color */
			padding-left: 4px;
		}
	}
</style>
