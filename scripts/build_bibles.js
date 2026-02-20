#!/usr/bin/env node
// Simple script to download public-domain bible JSON files into public/offline/bibles
// Requires Node 18+ (global fetch). Run: node scripts/build_bibles.js

import fs from 'fs/promises';
import path from 'path';

const OUT_DIR = path.join(process.cwd(), 'public', 'offline', 'bibles');

const SOURCES = {
  kjv: 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json',
  asv: 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_asv.json'
};

const LOCAL_SRC_DIR = path.join(process.cwd(), 'src', 'data', 'EN-English');

async function ensureDir(dir){
  await fs.mkdir(dir, { recursive: true });
}

async function download(version, url){
  console.log(`Downloading ${version} from ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const text = await res.text();

  let parsed = null;
  try { parsed = JSON.parse(text); } catch (e) { parsed = null; }

  // Normalize different public bible JSON shapes into { books: [ { name, chapters: [ { chapter, verses: {"1": "..."} } ] } ] }
  const normalizeBible = (src) => {
    if (!src || typeof src !== 'object') return null;

    const normalizeVerses = (vers) => {
      if (!vers) return {};
      if (!Array.isArray(vers) && typeof vers === 'object') {
        return Object.fromEntries(Object.entries(vers).map(([k, v]) => [String(k), String(v)]));
      }
      if (Array.isArray(vers) && vers.every(v => typeof v === 'string')) {
        const out = {};
        vers.forEach((t, i) => { out[String(i + 1)] = String(t); });
        return out;
      }
      if (Array.isArray(vers) && vers.every(v => v && (v.verse || v.verse === 0 || v.verse === 1))) {
        return Object.fromEntries(vers.map(v => [String(v.verse), String(v.text || v.verseText || v.content || '')]));
      }
      return {};
    };

    // If already has books array, try to normalize chapters/verses
    if (Array.isArray(src.books)){
      const books = src.books.map(b => {
        const name = b.name || b.book || b.title || b.book_name || b.bookname || '';
        let chapters = [];

        if (Array.isArray(b.chapters)){
          chapters = b.chapters.map((c, idx) => {
            if (c && (c.chapter || c.chapter === 0 || c.chapter === 1)){
              return { chapter: Number(c.chapter), verses: normalizeVerses(c.verses || c.verse || c.texts || c.versesMap) };
            }
            if (Array.isArray(c)) return { chapter: idx + 1, verses: normalizeVerses(c) };
            return null;
          }).filter(Boolean);
        } else if (b.chapters && typeof b.chapters === 'object'){
          chapters = Object.entries(b.chapters).map(([ch, verses]) => ({ chapter: Number(ch), verses: normalizeVerses(verses) }));
        }

        return { name: String(name || ''), chapters };
      });
      return { books };
    }

    // If source itself is an array of books
    if (Array.isArray(src)){
      const books = src.map(b => {
        if (b && (b.name || b.book || b.title)){
          const name = b.name || b.book || b.title;
          let chapters = [];
          if (Array.isArray(b.chapters)) chapters = b.chapters.map((c, idx) => ({ chapter: c.chapter || idx + 1, verses: normalizeVerses(c.verses || c) }));
          return { name: String(name), chapters };
        }
        return null;
      }).filter(Boolean);
      if (books.length) return { books };
    }

    // If top-level is a map of bookName -> chapters
    const keys = Object.keys(src);
    const likelyBookKeys = keys.filter(k => typeof src[k] === 'object' && k.length < 40 && /[A-Za-z]/.test(k));
    if (likelyBookKeys.length > 5){
      const books = likelyBookKeys.map(k => {
        const val = src[k];
        if (Array.isArray(val)) return { name: k, chapters: val.map((c, i) => ({ chapter: c.chapter || i + 1, verses: normalizeVerses(c) })) };
        if (typeof val === 'object') return { name: k, chapters: Object.entries(val).map(([ch, verses]) => ({ chapter: Number(ch), verses: normalizeVerses(verses) })) };
        return { name: k, chapters: [] };
      });
      return { books };
    }

    return null;
  };

  let out = parsed;
  try {
    if (parsed) {
      const normalized = normalizeBible(parsed);
      if (normalized) out = normalized;
    }
  } catch (e) {
    console.error('Normalization failed, writing raw JSON:', e.message);
  }

  const outPath = path.join(OUT_DIR, `${version}.json`);
  await fs.writeFile(outPath, typeof out === 'string' || out === null ? String(out) : JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${outPath}`);
}

// Allow one-off installs via CLI: node scripts/build_bibles.js --url <url> --id <id>
async function cliInstall(){
  const args = process.argv.slice(2);
  const urlIndex = args.indexOf('--url');
  const idIndex = args.indexOf('--id');
  if (urlIndex !== -1 && idIndex !== -1) {
    const url = args[urlIndex + 1];
    const id = args[idIndex + 1];
    if (!url || !id) {
      console.error('Usage: node scripts/build_bibles.js --url <url> --id <id>');
      process.exit(1);
    }
    try {
      await ensureDir(OUT_DIR);
      console.log(`Installing ${id} from ${url}`);
      await download(id, url);
      console.log('Done.');
      process.exit(0);
    } catch (e) {
      console.error('Install failed:', e.message || e);
      process.exit(1);
    }
  }
}

// Check CLI args before main
cliInstall().catch(()=>{});

async function main(){
  await ensureDir(OUT_DIR);
  // First, process any local source JSON files checked into src/data/EN-English
  try{
    const localFiles = await fs.readdir(LOCAL_SRC_DIR).catch(()=>[]);
    for (const f of localFiles || []){
      if (!f.endsWith('.json')) continue;
      const full = path.join(LOCAL_SRC_DIR, f);
      try{
        const txt = await fs.readFile(full, 'utf8');
        let parsed = null;
        try{ parsed = JSON.parse(txt); } catch(e) { parsed = null; }
        // attempt normalization using same logic as download
        let out = parsed;
        if (parsed) {
          const normalized = (function normalizeBible(src){
            if (!src || typeof src !== 'object') return null;
            const normalizeVerses = (vers) => {
              if (!vers) return {};
              if (!Array.isArray(vers) && typeof vers === 'object') return Object.fromEntries(Object.entries(vers).map(([k,v])=>[String(k),String(v)]));
              if (Array.isArray(vers) && vers.every(v => typeof v === 'string')){ const o={}; vers.forEach((t,i)=>o[String(i+1)]=String(t)); return o; }
              if (Array.isArray(vers) && vers.every(v=>v && (v.verse||v.verse===0||v.verse===1))) return Object.fromEntries(vers.map(v=>[String(v.verse),String(v.text||v.verseText||v.content||'')]));
              return {};
            };
            if (Array.isArray(src.books)){
              const books = src.books.map(b=>{
                const name = b.name||b.book||b.title||''; let chapters=[];
                if (Array.isArray(b.chapters)) chapters = b.chapters.map((c,idx)=>{ if (c && (c.chapter||c.chapter===0||c.chapter===1)) return { chapter:Number(c.chapter), verses:normalizeVerses(c.verses||c.verse||c.texts||c.versesMap)}; if (Array.isArray(c)) return { chapter: idx+1, verses: normalizeVerses(c) }; return null }).filter(Boolean);
                else if (b.chapters && typeof b.chapters==='object') chapters = Object.entries(b.chapters).map(([ch,vers])=>({ chapter:Number(ch), verses:normalizeVerses(vers)}));
                return { name:String(name||''), chapters };
              });
              return { books };
            }
            if (Array.isArray(src)){
              const books = src.map(b=>{ if (b && (b.name||b.book||b.title)){ const name=b.name||b.book||b.title; let chapters=[]; if (Array.isArray(b.chapters)) chapters = b.chapters.map((c,idx)=>({ chapter: c.chapter||idx+1, verses: normalizeVerses(c.verses||c) })); return { name:String(name), chapters }; } return null }).filter(Boolean);
              if (books.length) return { books };
            }
            const keys = Object.keys(src); const likelyBookKeys = keys.filter(k=>typeof src[k]==='object' && k.length<40 && /[A-Za-z]/.test(k));
            if (likelyBookKeys.length>5){ const books = likelyBookKeys.map(k=>{ const val = src[k]; if (Array.isArray(val)) return { name: k, chapters: val.map((c,i)=>({ chapter: c.chapter||i+1, verses: normalizeVerses(c) })) }; if (typeof val==='object') return { name:k, chapters: Object.entries(val).map(([ch,vers])=>({ chapter: Number(ch), verses: normalizeVerses(vers) })) }; return { name:k, chapters: [] }; }); return { books }; }
            return null;
          })(parsed);
          if (normalized) out = normalized;
        }
        const base = path.basename(f, '.json').toLowerCase();
        const outPath = path.join(OUT_DIR, `${base}.json`);
        await fs.writeFile(outPath, typeof out === 'string' || out === null ? String(out) : JSON.stringify(out, null, 2), 'utf8');
        console.log(`Copied local ${full} -> ${outPath}`);
      }catch(err){ console.error(`Failed to process local file ${f}:`, err.message); }
    }
  }catch(e){ /* continue */ }

  for (const [ver, url] of Object.entries(SOURCES)){
    try{ await download(ver, url); }
    catch(err){ console.error(`Failed ${ver}:`, err.message); }
  }
}

main().catch(err=>{ console.error(err); process.exit(1); });
