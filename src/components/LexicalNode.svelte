<script lang="ts" module>
	export type LexicalRoot = {
		root: {
			type: string;
			children: LexicalNode[];
			direction: ('ltr' | 'rtl') | null;
			format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
			indent: number;
			version: number;
		};
		[k: string]: unknown;
	};

	export type LexicalNode = {
		type: string;
		version: number;
		children?: LexicalNode[];
		[k: string]: unknown;
	};
</script>

<script lang="ts">
	import Self from './LexicalNode.svelte';
	const props: { node: LexicalNode } = $props();

	const getChildren = (node: LexicalNode): LexicalNode[] => {
		return node.children || [];
	};
</script>

{#snippet children(node: LexicalNode)}
	{#if getChildren(node)}
		{#each getChildren(node) as child}
			<Self node={child} />
		{/each}
	{/if}
{/snippet}

{#snippet type(node: LexicalNode)}
	{#if node.type === 'paragraph'}
		<p>{@render children(node)}</p>
	{:else if node.type === 'heading' && typeof node.tag === 'string'}
		<svelte:element this={node.tag}>
			{@render children(node)}
		</svelte:element>
	{:else if node.type === 'text'}
		{node.text}
	{:else}
		{@render children(node)}
	{/if}
{/snippet}

{#if props.node}
	{@render type(props.node)}
{/if}
