#!/bin/zsh
# Lighthouse mobile, N runs per route, sequential. Usage: lh3.sh <baseUrl> <outDir> [runs]
BASE=${1:-http://localhost:4173}; OUT=$2; RUNS=${3:-3}
LH="$(dirname $0)/node_modules/.bin/lighthouse"
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for i in $(seq 1 $RUNS); do
  mkdir -p "$OUT/run-$i"
  for r in / /about /protocol /indices /indices/blokc5 /security /token /governance /contact /legal/cookie-policy; do
    s=${r#/}; s=${s//\//_}; [[ -z $s ]] && s=home
    "$LH" "$BASE$r" --quiet --output=json --output-path="$OUT/run-$i/${s}_mobile.json" \
      --only-categories=performance,accessibility,best-practices,seo \
      --chrome-flags="--headless=new --no-first-run" >/dev/null 2>&1
    echo "run $i $r $?"
  done
done
