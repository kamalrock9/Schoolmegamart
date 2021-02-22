react-native bundle \
  --dev false \
  --entry-file index.js \
  --platform android \
  --sourcemap-output android-release.bundle.map \
  --bundle-output android-release.bundle


bugsnag-source-maps upload-react-native \
  --api-key b08eb5a51c4c091fbb23888466fb6a24 \
  --app-version 0.0.8 \
  --app-version-code 8 \
  --platform android \
  --source-map android-release.bundle.map \
  --bundle android-release.bundle

rm android-release.bundle*