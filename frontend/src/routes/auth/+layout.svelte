<script lang="ts">
	import { Card } from '$lib/components/ui/display';

	let { children } = $props();
</script>

<div class="grid min-h-screen place-items-center p-4">
	<Card padding="lg" class="w-full max-w-sm">
		{@render children()}
	</Card>
</div>
