---
layout: pages
title: Building blogs using Trello as your database
date: 2022-06-07
author: rabinshrestha3
tag: backend
fullname: Rabin Shrestha
---

Github has always been able to serve static contents through Jekyll using Github pages. Github pages has enabled millions of static pages to be published easily and for free. The only downside of it has been that Github supports limited number of Ruby gems. 

With the introduction of Github action, we can now run linux on Github and build jekyll sites or any other to create a blog. 

Using Trello as content management tool, we can integrate Trello with Jekyll to generate blog for free. Trello cards are easy to create as well as edit them as required.  

Example: Github workflow for creating blog with Github action. 
```
name: Build blogs from Trello Card

on:
  push:
    branches:
      - gh-pages
  schedule:
    - cron: "* */24 * * *"
  workflow_dispatch:

jobs:
  build-and-deploy:
    name: Build and commit on same branch
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source code
        uses: actions/checkout@v2

      - name: create .env file
        run: echo "${{ secrets.DOT_ENV }}" > .env

      - name: Setup ruby
        run: echo "::set-output name=RUBY_VERSION::$(cat .ruby-version)"
        id: rbenv

      - name: Use Ruby ${{ steps.rbenv.outputs.RUBY_VERSION }}
        uses: ruby/setup-ruby@v1

      - name: Use cache gems
        uses: actions/cache@v1
        with:
          path: vendor/bundle
          key: ${{ runner.os }}-gem-${{ hashFiles('**/Gemfile.lock') }}
          restore-keys: |
            ${{ runner.os }}-gem-
      - name: bundle install
        run: |
          gem install bundler
          bundle install --jobs 4 --retry 3 --path vendor/bundle

      - name: rm posts
        run: |
          cp ./scripts/rmposts.sh _posts/rmposts.sh
          chmod +x _posts/rmposts.sh
          cd _posts
          sh rmposts.sh
          rm rmposts.sh
          cd ..
      - name: Build posts
        run: |
          bundle exec jekyll build
      - uses: EndBug/add-and-commit@v9
        with:
          add: "*.md"
          author_name: autobot
          message: "auto commit"

```
        