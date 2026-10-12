export const OPEN_DOCS_SEARCH_EVENT = 'open-docs-search';

export function openDocsSearch() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_DOCS_SEARCH_EVENT));
  }
}
