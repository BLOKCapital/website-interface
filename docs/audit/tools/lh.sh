#!/bin/zsh
# Lighthouse mobile + desktop for each route. Usage: lh.sh <baseUrl> <outDir>
BASE=${1:-http://localhost:4173}
OUT=$2
mkdir -p "$OUT"
LH="$(dirname $0)/node_modules/.bin/lighthouse"
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for r in / /about /protocol /indices /indices/blokc5 /security /token /governance /contact /legal/cookie-policy; do
  s=${r#/}; s=${s//\//_}; [[ -z $s ]] && s=home
  for preset in mobile desktop; do
    extra=()
    [[ $preset == desktop ]] && extra=(--preset=desktop)
    "$LH" "$BASE$r" $extra --quiet --output=json --output-path="$OUT/${s}_${preset}.json" \
      --only-categories=performance,accessibility,best-practices,seo \
      --chrome-flags="--headless=new --no-first-run" >/dev/null 2>&1
    echo "$preset $r $?"
  done
done
