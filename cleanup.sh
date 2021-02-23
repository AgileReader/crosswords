#!/usr/bin/env bash

set -e

source vars.sh

function cleanGeneratedData() {
    rm -rf "${1}output/00index.json"
    rm -rf "${1}output/corpus.json"
    rm -rf "${1}output/masked/*.json"
    rm -rf "${1}mask/iteration/*.json"
    rm -rf "${1}mask/mask*.json"
}

cleanGeneratedData ${LIBRARY_PATH}
