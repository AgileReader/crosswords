#!/usr/bin/env bash

set -e

_runCi() {
    npm test

    npx prettier --write bin/
    npx prettier --write src/

    npx eslint bin/
    npx eslint src/
}

_runCi
