# The Mustard Seed — AI Bible Study

A small React + Vite application for Bible reading and AI-assisted study using a Retrieval-Augmented Generation (RAG) pipeline. The frontend provides a conversational UI to ask scripture and theology questions, save AI-generated insights, and browse scriptures. A companion RAG backend (Chroma + embeddings + LLM) is recommended for production use.

## Table of Contents
- [Features](#features)
- [Repository Layout](#repository-layout)
- [Quick Start — Frontend](#quick-start---frontend)
- [Environment Variables (frontend)](#environment-variables-frontend)
- [RAG Backend Overview](#rag-backend-overview)
- [Backend Quick Start (example)](#backend-quick-start-example)
- [Ingesting Content](#ingesting-content)
- [Prompting & Retrieval Notes](#prompting--retrieval-notes)
- [Deployment](#deployment)
- [Testing & Troubleshooting](#testing--troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features
- Modern React + Vite frontend with conversational chat UI.
- Save assistant insights to persistent notes (localStorage).
- ReadBible UI for browsing scripture and chapters.
- Profile and Saved pages.
- Pluggable RAG backend via `VITE_RAG_URL` (supports Google GenAI / OpenAI / custom LLM).

## Repository Layout
- the_mustard_seed/ — frontend app (run from here)
  - src/pages/Chat.jsx — chat UI that posts to the RAG backend ([the_mustard_seed/src/pages/Chat.jsx](the_mustard_seed/src/pages/Chat.jsx#L1))
  - src/hooks/useSavedNotes.js — localStorage-backed saved notes
  - src/components/… — layout, styles, and page components
- server/ — optional backend scaffold (not included by default in this repo)

## Quick Start — Frontend
1. Open a terminal and change to the frontend folder:

cd the_mustard_seed

npm install

npm run dev


```bash