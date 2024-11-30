<script lang="ts">
	import type { PageData } from './$types';
	import LoginForm from '../../../../components/LoginForm.svelte';

	const props: { data: PageData } = $props();
	const { data } = props;
</script>

<p>Please login in order to checkout</p>
<LoginForm
	baseUrl={data.api.baseUrl}
	onlogin={() => {
		window.location.href = `${data.api.baseUrl}/api/checkout-session`;
	}}
/>
