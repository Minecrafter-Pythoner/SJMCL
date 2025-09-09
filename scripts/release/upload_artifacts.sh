#!/usr/bin/env bash

set -euo pipefail

# Required environment variables:
# - SECRET_KEY
# - DEPLOY_API
# - DEPLOY_PROJECT

if [ -z "${SECRET_KEY:-}" ]; then
  echo "❌ DEPLOY_SECRET_KEY secret is not set"
  exit 1
fi

if [ -z "${DEPLOY_API:-}" ]; then
  echo "❌ DEPLOY_API secret is not set"
  exit 1
fi

if [ -z "${DEPLOY_PROJECT:-}" ]; then
  echo "❌ DEPLOY_PROJECT secret is not set"
  exit 1
fi

echo "✅ All required secrets are set"

cd release-artifacts
zip -r ../releases.zip *
cd ..

echo "📦 Created releases.zip with artifacts"

ARTIFACT_HASH=$(sha256sum releases.zip | awk '{ print $1 }')
DEPLOY_TIMESTAMP=$(date +%s)

# HMAC-SHA256: hash of "<timestamp><artifact_hash>" using SECRET_KEY
DEPLOY_HASH=$(echo -n "${DEPLOY_TIMESTAMP}${ARTIFACT_HASH}" | openssl dgst -sha256 -hmac "$SECRET_KEY" | cut -d' ' -f2)

echo "🔑 Generated deployment hash"
echo "📅 Timestamp: $DEPLOY_TIMESTAMP"

echo "🚀 Uploading to deployment server..."
set +e
STATUS_CODE=$(curl -X POST "$DEPLOY_API" \
                  -F "deploy_project=${DEPLOY_PROJECT}" \
                  -F "deploy_timestamp=${DEPLOY_TIMESTAMP}" \
                  -F "deploy_hash=${DEPLOY_HASH}" \
                  -F "deploy_artifact=@releases.zip" \
                  -s \
                  -o /dev/null \
                  -w "%{http_code}")
CURL_EXIT_CODE=$?
set -e

echo "📡 curl exit code: $CURL_EXIT_CODE, HTTP status: $STATUS_CODE"

if [ "$CURL_EXIT_CODE" -ne 0 ]; then
  echo "❌ curl failed with exit code $CURL_EXIT_CODE"
  exit 1
fi

if [ "$STATUS_CODE" -ne 204 ]; then
  echo "❌ Deployment failed with status code $STATUS_CODE"
  exit 1
else
  echo "✅ Deployment successful"
fi


