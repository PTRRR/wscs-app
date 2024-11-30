<script lang="ts">
	import type { PageData } from './$types';
	import LoginForm from '../../../../components/LoginForm.svelte';
	import { useLocalCart, useUser } from '../../../../store';
	import { WSCS } from '../../../../utilities/api';

	const props: { data: PageData } = $props();
	const { data } = props;

	const api = new WSCS(data.api.baseUrl);
	const { cart } = useLocalCart();
	const { query: user } = useUser(data.api.baseUrl);
	let creatingCheckoutSession = $state(false);

	$effect(() => {
		if ($user.isSuccess && $user.data.user) {
			// Ensure to upload the cart before creating a checkout session
			creatingCheckoutSession = true;
			api.updateCart({ userId: $user.data.user.id, cart: $cart }).then(() => {
				window.location.href = `${data.api.baseUrl}/api/checkout-session`;
			});
		}
	});
</script>

{#if creatingCheckoutSession}
	<h1>Creating checkout session</h1>
{:else}
	<p>Please login in order to checkout</p>
	<LoginForm baseUrl={data.api.baseUrl} />
{/if}
