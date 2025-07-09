#!/bin/bash

jq_pathify() {
  local key="$1"
  local jq_path=""
  IFS='.' read -ra parts <<< "$key"
  for part in "${parts[@]}"; do
    if [[ "$part" =~ ^[a-zA-Z0-9_]+$ ]]; then
      jq_path+=".${part}"
    else
      jq_path+="[\"$part\"]"
    fi
  done
  echo "$jq_path"
}

json_file=$1
tkeys_file=$(mktemp)
grep --exclude-dir={node_modules,dist} -orPh "\Wt\([\"']\K[\w.-]+(?=[\"'])" ./dashboard | sort | uniq > $tkeys_file

missingkc=0
while IFS= read -r key; do
	# jq_query=".$key"
	jq_query=$(jq_pathify $key)
	if [[ "$jq_query" != .* ]]; then
  		jq_query=".$jq_query"
	fi
	jq -e "$jq_query // empty" "$json_file" > /dev/null || { echo "translation lacks $key"; ((missingkc++)); }
done < $tkeys_file


extrakeys=$(jq -r 'paths(scalars) | join(".")' $json_file | grep -vxFf $tkeys_file)

while IFS= read -r line; do
  echo "found extra key $line"
done <<< "$extrakeys"

extrakc=$(wc -l <<< $extrakeys)


if [[ $extrakc -gt 0 || $missingkc -gt 0 ]]; then
  echo "Check failed. missing keys: $missingkc, extra keys: $extrakc"
  exit 1
else
  echo "Check passed. No extra/missing keys."
fi