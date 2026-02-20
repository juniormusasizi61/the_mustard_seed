Offline Bible files

Place JSON bible files in this folder so the app can serve them when offline.

Default sample files:
- `public/offline/bibles/kjv.json`
- `public/offline/bibles/asv.json`

To build/download full bibles automatically, run the Node script:

```
node scripts/build_bibles.js
```

The script will attempt to fetch known public-domain sources and write them into `public/offline/bibles/`.
