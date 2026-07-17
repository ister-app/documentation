#!/usr/bin/env bash
# Stages the documentation trees of player, server and chart under downloads/<repo>/doc.
#
# Default: downloads the docs zip attached to the latest GitHub release of each
# ister-app repo (requires gh auth; GH_TOKEN in CI).
# --local: copies ../player/doc, ../server/doc and ../chart/doc instead, so the
# site can be developed without hitting GitHub releases.
set -euo pipefail

cd "$(dirname "$0")/.."
downloads="downloads"
mode="${1:-release}"

rm -rf "$downloads"
mkdir -p "$downloads"

repos=(player server chart)
patterns=('player-docs-*.zip' 'server-docs-*.zip' 'ister-chart-docs-*.zip')

if [[ "$mode" == "--local" ]]; then
  for repo in "${repos[@]}"; do
    src="../$repo/doc"
    [[ -d "$src" ]] || { echo "ERROR: $src not found (clone the $repo repo next to this one)" >&2; exit 1; }
    mkdir -p "$downloads/$repo"
    cp -r "$src" "$downloads/$repo/doc"
    echo "staged $src -> $downloads/$repo/doc"
  done
  # The chart values-reference table is generated inside the release zip only;
  # local mode ships the committed chapter with empty VALUES markers. Fine for dev.
  exit 0
fi

for i in "${!repos[@]}"; do
  repo="${repos[$i]}"
  pattern="${patterns[$i]}"
  zipdir="$downloads/zips/$repo"
  mkdir -p "$zipdir"
  echo "=== downloading $pattern from latest release of ister-app/$repo"
  gh release download -R "ister-app/$repo" --pattern "$pattern" -D "$zipdir" --clobber
  zip="$(find "$zipdir" -name '*.zip' | head -1)"
  [[ -n "$zip" ]] || { echo "ERROR: no asset matching $pattern in latest ister-app/$repo release" >&2; exit 1; }
  mkdir -p "$downloads/$repo"
  unzip -q "$zip" -d "$downloads/$repo"
  [[ -d "$downloads/$repo/doc" ]] || { echo "ERROR: $zip does not contain a doc/ root" >&2; exit 1; }
  echo "unpacked $(basename "$zip") -> $downloads/$repo/doc"
done
