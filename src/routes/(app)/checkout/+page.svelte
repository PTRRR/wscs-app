<script lang="ts">
	import { useUser } from '../../../store';
	import type { PageData } from './$types';
	import LoginForm from '../../../components/LoginForm.svelte';
	import CheckoutForm from '../../../components/CheckoutForm.svelte';

	const props: { data: PageData } = $props();
	const { data } = props;

	const { query: user } = useUser(data.api.baseUrl);
</script>

<svelte:head>
	<title>Checkout</title>
</svelte:head>

<div class="checkout">
	<h1>Checkout</h1>

	{#if !$user.data?.user && $user.isFetched}
		<div class="checkout__login-form">
			<p>Please login in order to checkout</p>
			<LoginForm baseUrl={data.api.baseUrl} />
		</div>
	{:else if $user.isFetched && typeof $user.data?.user !== 'undefined'}
		<CheckoutForm
			baseUrl={data.api.baseUrl}
			user={$user.data.user}
			stripePublicKey={data.stripe.publicKey}
		/>
	{/if}
</div>

<style lang="scss">
	.checkout {
		padding: var(--main-padding);

		&__login-form {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}

		h1 {
			padding: 0;
			margin: 0;
		}
	}
</style>
