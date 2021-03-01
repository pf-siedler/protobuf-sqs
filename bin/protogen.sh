#!/usr/bin/env bash
set -eu

NODE_BIN=$(dirname $0)/../node_modules/.bin
PROTO_DIR=$(dirname $0)/../proto/*.proto
OUTPUT_DIR=$(dirname $0)/../generated

rm -f ${OUTPUT_DIR}/*.js ${OUTPUT_DIR}/*.ts
${NODE_BIN}/pbjs --target static-module --out ${OUTPUT_DIR}/index.js ${PROTO_DIR}
${NODE_BIN}/pbts --out ${OUTPUT_DIR}/index.d.ts ${OUTPUT_DIR}/index.js
