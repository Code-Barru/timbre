<script lang="ts">
	import type { Snippet } from 'svelte';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Plus from '@lucide/svelte/icons/plus';
	import Search from '@lucide/svelte/icons/search';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Volume2 from '@lucide/svelte/icons/volume-2';
	import {
		Alert,
		Avatar,
		Badge,
		Button,
		Card,
		Checkbox,
		Dialog,
		DropdownMenu,
		EmptyState,
		Field,
		Form,
		GradeButtons,
		IconButton,
		Input,
		Kbd,
		Loader,
		MenuItem,
		Pagination,
		Popover,
		Progress,
		ProgressRing,
		Radio,
		Select,
		Skeleton,
		Slider,
		Switch,
		Table,
		Tabs,
		Tag,
		Textarea,
		ThemeToggle,
		Tooltip,
		Word,
		toasts
	} from '$lib/components/ui';

	const variants = ['solid', 'soft', 'outline', 'ghost', 'link'] as const;
	const tones = ['brand', 'neutral', 'danger', 'warning', 'success'] as const;
	const sizes = ['xs', 'sm', 'md', 'lg'] as const;

	const brandRamp = [
		'bg-brand-50',
		'bg-brand-100',
		'bg-brand-200',
		'bg-brand-300',
		'bg-brand-400',
		'bg-brand-500',
		'bg-brand-600',
		'bg-brand-700',
		'bg-brand-800',
		'bg-brand-900',
		'bg-brand-950'
	];

	const neutralRamp = [
		'bg-neutral-0',
		'bg-neutral-50',
		'bg-neutral-100',
		'bg-neutral-200',
		'bg-neutral-300',
		'bg-neutral-400',
		'bg-neutral-500',
		'bg-neutral-600',
		'bg-neutral-700',
		'bg-neutral-800',
		'bg-neutral-900',
		'bg-neutral-950'
	];

	const dangerRamp = [
		'bg-danger-50',
		'bg-danger-100',
		'bg-danger-300',
		'bg-danger-500',
		'bg-danger-600',
		'bg-danger-700',
		'bg-danger-900'
	];

	const warningRamp = [
		'bg-warning-50',
		'bg-warning-100',
		'bg-warning-300',
		'bg-warning-500',
		'bg-warning-600',
		'bg-warning-700',
		'bg-warning-900'
	];

	const successRamp = [
		'bg-success-50',
		'bg-success-100',
		'bg-success-300',
		'bg-success-500',
		'bg-success-600',
		'bg-success-700',
		'bg-success-900'
	];

	const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
	const semanticSteps = ['50', '100', '300', '500', '600', '700', '900'];

	let text = $state('rozmawiać');
	let notes = $state('');
	let deck = $state<string | null>(null);
	let checked = $state(true);
	let indeterminate = $state(true);
	let level = $state<string | null>('b1');
	let daily = $state(true);
	let retention = $state(90);
	let page = $state(3);
	let tab = $state('cards');
	let dialogOpen = $state(false);
	let popoverOpen = $state(false);
	let menuOpen = $state(false);
	let lastGrade = $state<string>('none yet');
</script>

{#snippet section(title: string, note: string, body: Snippet)}
	<section class="flex flex-col gap-5">
		<div
			class="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-subtle pb-2"
		>
			<h2 class="text-h2 text-fg">{title}</h2>
			<p class="text-sm text-fg-muted">{note}</p>
		</div>
		{@render body()}
	</section>
{/snippet}

{#snippet ramp(classes: string[], labels: string[])}
	<div class="flex overflow-hidden rounded-md border border-line-subtle">
		{#each classes as swatch, index (swatch)}
			<div class="flex-1">
				<div class={[swatch, 'h-12']}></div>
				<p class="bg-surface-raised py-1 text-center text-[0.625rem] text-fg-muted tabular-nums">
					{labels[index]}
				</p>
			</div>
		{/each}
	</div>
{/snippet}

<div class="mx-auto flex max-w-5xl flex-col gap-14 px-5 py-10">
	<header class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="text-eyebrow text-fg-muted uppercase">Design system</p>
			<h1 class="text-display-lg text-fg">Timbre</h1>
			<p class="mt-2 max-w-lg text-sm text-fg-secondary">
				Rubik carries the app. Charis SIL carries the language — every word, transcription, and
				example sentence a learner reads.
			</p>
		</div>
		<ThemeToggle />
	</header>

	{#snippet colorBody()}
		<div class="flex flex-col gap-6">
			<div class="space-y-2">
				<p class="text-eyebrow text-fg-muted uppercase">Brand</p>
				{@render ramp(brandRamp, steps)}
			</div>
			<div class="space-y-2">
				<p class="text-eyebrow text-fg-muted uppercase">Neutral</p>
				{@render ramp(neutralRamp, ['0', ...steps])}
			</div>
			<div class="grid gap-6 sm:grid-cols-3">
				<div class="space-y-2">
					<p class="text-eyebrow text-fg-muted uppercase">Danger</p>
					{@render ramp(dangerRamp, semanticSteps)}
				</div>
				<div class="space-y-2">
					<p class="text-eyebrow text-fg-muted uppercase">Warning</p>
					{@render ramp(warningRamp, semanticSteps)}
				</div>
				<div class="space-y-2">
					<p class="text-eyebrow text-fg-muted uppercase">Success</p>
					{@render ramp(successRamp, semanticSteps)}
				</div>
			</div>
			<div class="grid gap-3 sm:grid-cols-3">
				<div class="rounded-md border border-line-subtle bg-surface-base p-3 text-sm">
					surface-base
				</div>
				<div class="rounded-md border border-line-subtle bg-surface-raised p-3 text-sm">
					surface-raised
				</div>
				<div class="rounded-md border border-line-subtle bg-surface-sunken p-3 text-sm">
					surface-sunken
				</div>
			</div>
		</div>
	{/snippet}
	{@render section('Color', 'oklch, theme-aware via light-dark()', colorBody)}

	{#snippet typeBody()}
		<div class="grid gap-8 md:grid-cols-2">
			<div class="space-y-3">
				<p class="text-eyebrow text-fg-muted uppercase">Rubik — interface</p>
				<p class="text-display-lg">Study today</p>
				<p class="text-display">Study today</p>
				<p class="text-h1">Study today</p>
				<p class="text-h2">Study today</p>
				<p class="text-h3">Study today</p>
				<p class="text-base">Body copy at 16px. 42 cards are due across three decks.</p>
				<p class="text-sm text-fg-secondary">Secondary at 14px.</p>
				<p class="text-eyebrow text-fg-muted uppercase">Eyebrow label</p>
			</div>
			<div class="space-y-3">
				<p class="text-eyebrow text-fg-muted uppercase">Charis SIL — language</p>
				<Word
					word="rozmawiać"
					ipa="rɔzmaˈvjatɕ"
					sentence="Lubię rozmawiać po polsku."
					lang="pl"
					size="lg"
				/>
				<Word word="Ελλάδα" ipa="eˈlaða" lang="el" />
				<Word word="разговаривать" ipa="rəzɡɐˈvarʲɪvətʲ" lang="ru" />
				<p class="font-lang text-sm text-fg-secondary">
					ˈpʲɔlska ɕ ʑ ŋ ʒ θ ð ɣ ʁ ɨ ø œ ɯ ʔ ˈˌː — full IPA coverage, unsubset.
				</p>
			</div>
		</div>
	{/snippet}
	{@render section('Typography', 'Two families, one rule', typeBody)}

	{#snippet buttonBody()}
		<div class="flex flex-col gap-6">
			{#each variants as variant (variant)}
				<div class="flex flex-wrap items-center gap-3">
					<span class="w-16 text-xs text-fg-muted">{variant}</span>
					{#each tones as tone (tone)}
						<Button {variant} {tone}>Review</Button>
					{/each}
				</div>
			{/each}
			<div class="flex flex-wrap items-center gap-3">
				<span class="w-16 text-xs text-fg-muted">sizes</span>
				{#each sizes as size (size)}
					<Button {size}>Size {size}</Button>
				{/each}
			</div>
			<div class="flex flex-wrap items-center gap-3">
				<span class="w-16 text-xs text-fg-muted">states</span>
				<Button loading>Saving</Button>
				<Button disabled>Disabled</Button>
				<Button href="/">Link button</Button>
				<Button>
					{#snippet icon()}<Plus class="size-4" />{/snippet}
					Add note
				</Button>
				<IconButton label="Play audio" variant="soft" tone="brand">
					<Volume2 class="size-4.5" />
				</IconButton>
			</div>
		</div>
	{/snippet}
	{@render section('Buttons', 'variant × tone × size', buttonBody)}

	{#snippet displayBody()}
		<div class="flex flex-col gap-6">
			<div class="flex flex-wrap items-center gap-3">
				<span class="w-16 text-xs text-fg-muted">badges</span>
				{#each tones as tone (tone)}
					<Badge {tone}>{tone}</Badge>
				{/each}
				<Badge tone="success" variant="solid" dot>Due</Badge>
				<Badge tone="neutral" variant="outline" size="sm">sm</Badge>
			</div>
			<div class="flex flex-wrap items-center gap-3">
				<span class="w-16 text-xs text-fg-muted">tags</span>
				<Tag tone="brand">noun</Tag>
				<Tag tone="neutral" type="count" count={12}>Polish</Tag>
				<Tag tone="danger" type="removable" onremove={() => toasts.push({ title: 'Tag removed' })}>
					leech
				</Tag>
				<Tag type="toggle" tone="success">minimal pair</Tag>
			</div>
			<div class="flex flex-wrap items-center gap-4">
				<span class="w-16 text-xs text-fg-muted">misc</span>
				<Avatar name="Antoine Ousselin" />
				<Avatar name="Maria Kowalska" size="sm" shape="square" />
				<Kbd keys={['Ctrl', 'K']} separator="+" />
				<Kbd keys={['Space']} size="md" />
			</div>
			<div class="grid gap-3 sm:grid-cols-3">
				<Card accent header={cardHeader}>
					<p class="text-sm text-fg-secondary">Raised card with a brand hairline.</p>
				</Card>
				<Card variant="outline">
					<p class="text-sm text-fg-secondary">Outline card.</p>
				</Card>
				<Card variant="sunken">
					<p class="text-sm text-fg-secondary">Sunken card.</p>
				</Card>
			</div>
		</div>
	{/snippet}
	{#snippet cardHeader()}
		<p class="text-h3">Polish core 625</p>
	{/snippet}
	{@render section('Display', 'badges, tags, cards', displayBody)}

	{#snippet feedbackBody()}
		<div class="flex flex-col gap-6">
			<div class="flex flex-wrap items-center gap-6">
				<span class="w-16 text-xs text-fg-muted">loaders</span>
				<Loader size="sm" />
				<Loader />
				<Loader size="lg" class="text-brand-fg" />
			</div>
			<div class="flex flex-col gap-3">
				<Progress value={62} label="Deck progress" />
				<Progress indeterminate tone="success" label="Training parameters" />
			</div>
			<div class="flex flex-wrap items-center gap-6">
				<ProgressRing value={72} label="Retention">
					<span class="text-h3 tabular-nums">72%</span>
				</ProgressRing>
				<div class="min-w-56 flex-1">
					<Skeleton type="text" lines={3} />
				</div>
				<div class="min-w-56 flex-1">
					<Skeleton type="list" lines={2} />
				</div>
				<Skeleton type="circle" width="3rem" />
			</div>
			<div class="grid gap-3 sm:grid-cols-2">
				<Alert tone="brand" title="FSRS is still learning">
					Timbre needs about 400 reviews before per-deck parameters beat the defaults.
				</Alert>
				<Alert tone="danger" title="Import failed" dismissible>
					The file is not a valid Anki package.
				</Alert>
				<Alert tone="warning" title="Audio missing">Three cards have no pronunciation.</Alert>
				<Alert tone="success" title="Deck created">Polish core 625 is ready.</Alert>
			</div>
			<div class="flex flex-wrap gap-2">
				<Button
					variant="soft"
					onclick={() => toasts.push({ title: 'Note saved', description: 'rozmawiać · 4 cards' })}
				>
					Push toast
				</Button>
				<Button
					variant="soft"
					tone="danger"
					onclick={() =>
						toasts.push({
							tone: 'danger',
							title: 'Sync failed',
							description: 'Retry in a moment.'
						})}
				>
					Push danger toast
				</Button>
			</div>
		</div>
	{/snippet}
	{@render section('Feedback', 'loaders, skeletons, alerts, toasts', feedbackBody)}

	{#snippet formBody()}
		<div class="grid gap-6 md:grid-cols-2">
			<Form actions={formActions}>
				<Field label="Word" hint="The word as it appears in the target language." required>
					<Input bind:value={text} clearable placeholder="rozmawiać" />
				</Field>
				<Field label="Search">
					<Input placeholder="Search notes" prefix={searchIcon} size="sm" />
				</Field>
				<Field label="Deck" error="Pick a deck before saving.">
					<Select bind:value={deck} placeholder="Choose a deck">
						<option value="core">Polish core 625</option>
						<option value="verbs">Verbs of motion</option>
					</Select>
				</Field>
				<Field label="Personal connection" hint="A memory, not a translation.">
					<Textarea bind:value={notes} autoresize placeholder="Where you last heard it" />
				</Field>
			</Form>
			<div class="flex flex-col gap-5">
				<div class="flex flex-col gap-2">
					<Checkbox bind:checked>Bury siblings until tomorrow</Checkbox>
					<Checkbox bind:indeterminate checked={false}>Partially selected</Checkbox>
					<Checkbox disabled>Disabled</Checkbox>
				</div>
				<Field label="Level">
					<div class="flex flex-col gap-2 pt-1">
						<Radio bind:group={level} value="a1">A1 — beginner</Radio>
						<Radio bind:group={level} value="b1">B1 — intermediate</Radio>
						<Radio bind:group={level} value="c1">C1 — advanced</Radio>
					</div>
				</Field>
				<Switch bind:checked={daily}>Daily reminder</Switch>
				<Field label="Desired retention" hint="Higher retention means more reviews.">
					<Slider
						bind:value={retention}
						min={70}
						max={99}
						showValue
						formatValue={(value) => `${value}%`}
						marks={[
							{ value: 70, label: '70' },
							{ value: 85, label: '85' },
							{ value: 99, label: '99' }
						]}
					/>
				</Field>
			</div>
		</div>
	{/snippet}
	{#snippet formActions()}
		<Button variant="ghost" tone="neutral">Cancel</Button>
		<Button type="submit">Save note</Button>
	{/snippet}
	{#snippet searchIcon()}
		<Search class="size-4" />
	{/snippet}
	{@render section('Forms', 'Field owns the label, hint, error, and aria wiring', formBody)}

	{#snippet overlayBody()}
		<div class="flex flex-wrap items-center gap-3">
			<Tooltip text="Plays the Forvo recording">
				<Button variant="outline" tone="neutral">Hover me</Button>
			</Tooltip>
			<Popover
				bind:open={popoverOpen}
				triggerClass="inline-flex h-9.5 items-center rounded-md border border-line px-3.5 text-sm font-medium text-fg-secondary"
				trigger={popoverTrigger}
			>
				<div class="w-56 space-y-2">
					<p class="text-h3">Card templates</p>
					<p class="text-sm text-fg-secondary">
						One note generates four cards: picture, spelling, sound, and production.
					</p>
				</div>
			</Popover>
			<DropdownMenu
				bind:open={menuOpen}
				triggerClass="inline-flex h-9.5 items-center rounded-md border border-line px-3.5 text-sm font-medium text-fg-secondary"
				trigger={menuTrigger}
			>
				<MenuItem icon={pencilIcon} onselect={() => toasts.push({ title: 'Edit note' })}>
					Edit note
				</MenuItem>
				<MenuItem icon={bookIcon} onselect={() => toasts.push({ title: 'Move deck' })}>
					Move to deck
				</MenuItem>
				<MenuItem
					tone="danger"
					icon={trashIcon}
					onselect={() => toasts.push({ tone: 'danger', title: 'Note deleted' })}
				>
					Delete note
				</MenuItem>
			</DropdownMenu>
			<Button onclick={() => (dialogOpen = true)}>Open dialog</Button>
		</div>
		<Dialog
			bind:open={dialogOpen}
			title="Delete this note?"
			description="Its four cards and their review history go with it."
			footer={dialogFooter}
		>
			<p class="text-sm text-fg-secondary">
				Deleting a note removes every card it generated. Review history cannot be restored.
			</p>
		</Dialog>
	{/snippet}
	{#snippet popoverTrigger()}Popover{/snippet}
	{#snippet menuTrigger()}Menu{/snippet}
	{#snippet pencilIcon()}<Pencil class="size-4" />{/snippet}
	{#snippet bookIcon()}<BookOpen class="size-4" />{/snippet}
	{#snippet trashIcon()}<Trash2 class="size-4" />{/snippet}
	{#snippet dialogFooter()}
		<Button variant="ghost" tone="neutral" onclick={() => (dialogOpen = false)}>Keep note</Button>
		<Button tone="danger" onclick={() => (dialogOpen = false)}>Delete note</Button>
	{/snippet}
	{@render section('Overlays', 'hand-rolled positioning and dismissal', overlayBody)}

	{#snippet dataBody()}
		<div class="flex flex-col gap-6">
			<Tabs
				bind:value={tab}
				label="Deck views"
				tabs={[
					{ value: 'cards', label: 'Cards' },
					{ value: 'stats', label: 'Statistics' },
					{ value: 'settings', label: 'Settings', disabled: true }
				]}
			>
				{#if tab === 'cards'}
					<Table caption="Due today" head={tableHead}>
						<tr>
							<td class="font-lang">rozmawiać</td>
							<td class="font-lang text-fg-muted">rɔzmaˈvjatɕ</td>
							<td><Badge tone="warning" size="sm">Learning</Badge></td>
							<td class="tabular-nums">3d</td>
						</tr>
						<tr>
							<td class="font-lang">książka</td>
							<td class="font-lang text-fg-muted">ˈkɕɔ̃ʂka</td>
							<td><Badge tone="success" size="sm">Review</Badge></td>
							<td class="tabular-nums">21d</td>
						</tr>
						<tr>
							<td class="font-lang">wczoraj</td>
							<td class="font-lang text-fg-muted">ˈft͡ʂɔraj</td>
							<td><Badge tone="danger" size="sm">Relearning</Badge></td>
							<td class="tabular-nums">10m</td>
						</tr>
					</Table>
				{:else}
					<EmptyState
						title="No statistics yet"
						description="Complete a first review session to see retention and workload."
						icon={emptyIcon}
						action={emptyAction}
					/>
				{/if}
			</Tabs>
			<Pagination bind:page total={148} perPage={20} />
		</div>
	{/snippet}
	{#snippet tableHead()}
		<tr>
			<th>Word</th>
			<th>Pronunciation</th>
			<th>State</th>
			<th>Interval</th>
		</tr>
	{/snippet}
	{#snippet emptyIcon()}<BookOpen class="size-5" />{/snippet}
	{#snippet emptyAction()}<Button size="sm">Start reviewing</Button>{/snippet}
	{@render section('Data', 'tables, tabs, pagination', dataBody)}

	{#snippet srsBody()}
		<Card padding="lg" accent class="mx-auto max-w-xl">
			<div class="flex flex-col items-center gap-6">
				<div class="flex w-full items-center justify-between">
					<Badge tone="brand" variant="soft">Polish core 625</Badge>
					<span class="text-sm text-fg-muted tabular-nums">12 / 42</span>
				</div>
				<Word
					word="rozmawiać"
					ipa="rɔzmaˈvjatɕ"
					sentence="Lubię rozmawiać po polsku."
					lang="pl"
					size="lg"
					align="center"
				/>
				<IconButton label="Play pronunciation" variant="soft" tone="brand" size="lg" round>
					<Volume2 class="size-5" />
				</IconButton>
				<Progress value={29} label="Session progress" class="w-full" />
				<GradeButtons
					class="w-full"
					intervals={['10m', '1d', '4d', '9d']}
					ongrade={(grade) => {
						lastGrade = ['Again', 'Hard', 'Good', 'Easy'][grade - 1];
						toasts.push({ title: `Graded ${lastGrade}` });
					}}
				/>
				<p class="text-sm text-fg-muted">Last grade: {lastGrade}</p>
			</div>
		</Card>
	{/snippet}
	{@render section('Study', 'the kitchen sink — chrome and language side by side', srsBody)}
</div>
