# Musings

Blog/toy site hosted at: https://musings-mr.net

## Note to self

To push to gcs bucket:

```aiignore
npm run build
cd dist
gcloud storage cp -r . gs://musings-mr.net
```