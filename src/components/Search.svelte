<script lang="ts">
    import { onMount } from 'svelte'
    import SearchIcon from './SearchIcon.svelte'
    import PostSearchPreview from './PostSearchPreview.svelte'

    type SearchDoc = {
        slug: string
        category: string
        title?: string
        description?: string
        tags?: string[]
        body?: string
        searchText?: string
    }

    let searchInput: HTMLInputElement
    let searchableDocs: SearchDoc[] = []
    let searchIndex

    let searchQuery = ''
    let searchResults: SearchDoc[] = []

    const normalize = (value: unknown) => String(value ?? '').toLowerCase()

    const buildSearchText = (doc: SearchDoc) => normalize([
        doc.title,
        doc.description,
        doc.tags?.join(' '),
        doc.body,
        doc.slug,
    ].join(' '))

    onMount(async() => {
        const lunr = (await import('lunr')).default
        const resp = await fetch('/search-index.json')
        searchableDocs = (await resp.json()).map((doc: SearchDoc) => ({
            ...doc,
            searchText: buildSearchText(doc),
        }))
            // Initialize indexing
        searchIndex = lunr(function(){
            // the match key...
            this.ref('slug')

            // indexable properties
            this.field('title')
            this.field('description')
            this.field('tags')

            // Omit, if you don't want to search on `body`
            this.field('body')

            // Index every document
            searchableDocs.forEach(doc => {
                this.add(doc)
            }, this)
        })
        searchInput.focus()
    })

    $: {
        const query = searchQuery.trim().toLowerCase()
        if(query && searchIndex && searchableDocs.length) {
            const resultBySlug = new Map<string, SearchDoc>()

            try {
                searchIndex.search(query).forEach((match) => {
                    const doc = searchableDocs.find((item) => item.slug === match.ref)
                    if(doc) resultBySlug.set(doc.slug, doc)
                })
            } catch {
                // Fallback below still supports punctuation-heavy or CJK queries.
            }

            searchableDocs
                .filter((doc) => doc.searchText?.includes(query))
                .forEach((doc) => resultBySlug.set(doc.slug, doc))

            searchResults = [...resultBySlug.values()]
        } else {
            searchResults = []
        }
    }
</script>
<div class="search">
    <div class="search__ctrl">
        <label for="search"><SearchIcon found={searchResults.length > 0} /></label>
        <input type="text" name="search" bind:this={searchInput} placeholder="What are you looking for?" bind:value={searchQuery} />
    </div>
    <div class="search__results">
        {#if searchResults.length}
            {#each searchResults as post, i }
                <PostSearchPreview post={post} isLast={ i === searchResults.length - 1 } />
            {/each}
        {:else}
            <div class="search__results--none">
                {#if searchQuery.length}
                    No matching items found!
                {:else}
                    Search something and let me find it for you! :-)
                {/if}
            </div>
        {/if}
    </div>
    <div class="note"><small>click anywhere outside to close</small></div>
</div>
<style>
    .search {
        @apply w-full relative bg-theme-primary  p-8  rounded-md shadow-lg;
    }
    input {
        @apply w-full px-4 py-2 pl-10 text-xl font-semibold text-gray-600 border-0 shadow-inner rounded-md bg-gray-100 placeholder-theme-dark-secondary;
    }
    .search__ctrl {
        @apply pb-4 relative;
    }
    .search__ctrl label {
        @apply text-theme-primary absolute top-2 left-2;
    }
    .search__results {
        @apply w-96 h-64 py-4 overflow-y-auto;
    }
    .search__results--none {
        @apply  text-center text-theme-dark-primary;
    }
    .note {
        @apply w-full text-center text-white;
    }
</style>
