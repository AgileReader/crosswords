#!/usr/bin/env bash

set -e

function runCi() {
    gitlint

    if [ "$#" == 0 ]; then
      exit
    fi

    npm test

    if [ "$1" == 1 ]; then
      exit
    fi

    npx prettier --write bin/
    npx prettier --write src/

    if [ "$1" == 2 ]; then
      exit
    fi

    npx eslint bin/
    npx eslint src/
}

runCi $@
