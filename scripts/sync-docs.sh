#!/usr/bin/env bash
# Places the staged doc trees (downloads/<repo>/doc, see fetch-releases.sh) into
# the Docusaurus content directories and rewrites links that don't survive the
# move. EN content goes to docs-<instance>/, NL content to
# i18n/nl/docusaurus-plugin-content-docs-<instance>/current/.
set -euo pipefail

cd "$(dirname "$0")/.."
downloads="${1:-downloads}"

for repo in player server chart; do
  [[ -d "$downloads/$repo/doc" ]] || { echo "ERROR: $downloads/$repo/doc missing — run scripts/fetch-releases.sh first" >&2; exit 1; }
done

nl_root="i18n/nl"
nl_docs() { echo "$nl_root/docusaurus-plugin-content-docs-$1/current"; }

# --- 1. clean ---------------------------------------------------------------
for id in player server chart development; do
  rm -rf "docs-$id" "$(nl_docs "$id")"
  mkdir -p "docs-$id" "$(nl_docs "$id")"
done

# --- 2/3. place EN and NL content -------------------------------------------
# player instance <- player doc/user
cp "$downloads/player/doc/user/en/"*.md docs-player/
mkdir -p docs-player/images
cp "$downloads/player/doc/user/images/en/"* docs-player/images/ 2>/dev/null || true
cp "$downloads/player/doc/user/nl/"*.md "$(nl_docs player)/"
mkdir -p "$(nl_docs player)/images"
cp "$downloads/player/doc/user/images/nl/"* "$(nl_docs player)/images/" 2>/dev/null || true

# server instance <- server doc/admin
cp "$downloads/server/doc/admin/en/"*.md docs-server/
cp "$downloads/server/doc/admin/nl/"*.md "$(nl_docs server)/"

# chart instance <- chart doc/admin
cp "$downloads/chart/doc/admin/en/"*.md docs-chart/
cp "$downloads/chart/doc/admin/nl/"*.md "$(nl_docs chart)/"

# development instance <- player + server doc/architecture
for repo in player server; do
  mkdir -p "docs-development/$repo/diagrams" "$(nl_docs development)/$repo/diagrams"
  cp "$downloads/$repo/doc/architecture/en/"*.md "docs-development/$repo/"
  cp "$downloads/$repo/doc/architecture/nl/"*.md "$(nl_docs development)/$repo/"
  # diagrams are not language-split; copy the same set into both trees so the
  # relative links from EN and NL chapters both resolve
  cp "$downloads/$repo/doc/architecture/diagrams/"*.md "docs-development/$repo/diagrams/"
  cp "$downloads/$repo/doc/architecture/diagrams/"*.md "$(nl_docs development)/$repo/diagrams/"
done

# --- 4. generated scaffolding ------------------------------------------------
category() { printf '{"label": "%s", "position": %s%s}\n' "$1" "$2" "${3:+, \"collapsed\": true}"; }
for tree in docs-development "$(nl_docs development)"; do
  category Player 1 > "$tree/player/_category_.json"
  category Server 2 > "$tree/server/_category_.json"
  # category labels double as sidebar translation keys, so the two diagram
  # folders need distinct labels
  category "Player diagrams" 99 collapsed > "$tree/player/diagrams/_category_.json"
  category "Server diagrams" 99 collapsed > "$tree/server/diagrams/_category_.json"
done

# Dutch translations for the sidebar category labels (the sidebar structure
# comes from the EN tree; labels translate via current.json).
cat > "$nl_root/docusaurus-plugin-content-docs-development/current.json" <<'EOF'
{
  "sidebar.development.category.Player": {"message": "Player"},
  "sidebar.development.category.Server": {"message": "Server"},
  "sidebar.development.category.Player diagrams": {"message": "Player-diagrammen"},
  "sidebar.development.category.Server diagrams": {"message": "Server-diagrammen"}
}
EOF

# Section landing pages for the development instance (the other instances get
# `slug: /` injected into their first chapter below).
cat > docs-development/index.md <<'EOF'
---
slug: /
sidebar_position: 0
---

# Development documentation

Architecture documentation for contributors.

- [Player architecture](player/00-overview.md) — the Flutter app: layers, navigation, playback pipeline, GraphQL codegen.
- [Server architecture](server/00-overview.md) — the Spring Boot server: events, scanning, transcoding, search, API.
EOF
cat > "$(nl_docs development)/index.md" <<'EOF'
---
slug: /
sidebar_position: 0
---

# Ontwikkelaarsdocumentatie

Architectuurdocumentatie voor bijdragers.

- [Player-architectuur](player/00-overview.md) — de Flutter-app: lagen, navigatie, afspeelpipeline, GraphQL-codegen.
- [Server-architectuur](server/00-overview.md) — de Spring Boot-server: events, scannen, transcoderen, zoeken, API.
EOF

# Give the lowest-numbered chapter of each single-tree instance `slug: /` so
# /player, /server and /chart land on their first chapter.
inject_root_slug() {
  local dir="$1"
  local first
  first="$(find "$dir" -maxdepth 1 -name '[0-9]*-*.md' | sort | head -1)"
  [[ -n "$first" ]] || { echo "ERROR: no numbered chapter found in $dir" >&2; exit 1; }
  printf -- '---\nslug: /\n---\n\n%s' "$(cat "$first")" > "$first"
}
for id in player server chart; do
  inject_root_slug "docs-$id"
  inject_root_slug "$(nl_docs "$id")"
done

# --- 5. link rewrites --------------------------------------------------------
# The source trees keep chapters one level below images/ and diagrams/ and use
# ../-style links; after placement those directories are siblings. Cross-section
# links (admin -> architecture) cross a docs-plugin boundary and must become
# absolute URLs (NL needs the /nl prefix — absolute links are not localized
# automatically).
rewrite() { # rewrite <perl-substitution> <file...>
  local expr="$1"; shift
  [[ $# -eq 0 ]] || perl -pi -e "$expr" "$@"
}

# player user guide: ](../images/en/x.png) -> ](images/x.png)
rewrite 's{\]\(\.\./images/(en|nl)/}{](images/}g' docs-player/*.md "$(nl_docs player)/"*.md

# architecture chapters: ](../diagrams/x.md) -> ](diagrams/x.md)
for repo in player server; do
  rewrite 's{\]\(\.\./diagrams/}{](diagrams/}g' \
    "docs-development/$repo/"*.md "$(nl_docs development)/$repo/"*.md
done

# server admin -> architecture: ](../../architecture/en/NN-name.md#frag) -> ](/development/server/name#frag)
rewrite 's{\]\(\.\./\.\./architecture/en/\d+-([^)#]+)\.md(#[^)]*)?\)}{](/development/server/$1$2)}g' docs-server/*.md
rewrite 's{\]\(\.\./\.\./architecture/nl/\d+-([^)#]+)\.md(#[^)]*)?\)}{](/nl/development/server/$1$2)}g' "$(nl_docs server)/"*.md

# --- 6. validate -------------------------------------------------------------
fail=0
leftovers="$(grep -rnE '\]\(\.\./|\]\([^)]*(architecture|images|admin|user)/(en|nl)/' docs-player docs-server docs-chart docs-development "$nl_root"/docusaurus-plugin-content-docs-* --include='*.md' || true)"
if [[ -n "$leftovers" ]]; then
  echo "ERROR: unresolved relative/locale links after rewrite:" >&2
  echo "$leftovers" >&2
  fail=1
fi
exit $fail
