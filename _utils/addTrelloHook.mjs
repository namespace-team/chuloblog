// Get any environment variables we need
import * as dotenv from 'dotenv'
import markdownIt from 'markdown-it'

dotenv.config()

import fetch from 'node-fetch';
import yaml from 'yaml';
import fs from 'fs';
import slugify from 'slugify';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const fsPromises = fs.promises;

// var toMd = require('json-to-frontmatter-markdown2');
const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = join(__dirname, "../_posts")
const authorsDir = join(__dirname, "../authors")
const labelsDir = join(__dirname, "../labels")


const listID = process.env.TRELLO_LIST_ID
const token = process.env.TRELLO_TOKEN
const key = process.env.TRELLO_KEY
const board = process.env.TRELLO_BOARD_ID

const blogCards = await fetch(`https://api.trello.com/1/lists/${listID}/cards?key=${key}&token=${token}`);
const blog = await blogCards.json();

const membersRequest = await fetch(`https://api.trello.com/1/boards/${board}/members?key=${key}&token=${token}`);
const members = await membersRequest.json();

function toPost(article) {
  var frontMatter = {
    layout: 'post',
    title: article.name,
    date: article.dateLastActivity.split('T')[0],
    author: members[members.findIndex(user => user.id === article.idMembers[0])]['username'],
    tags: 'post',
    tag: article.labels[0].name,
    permalink: 'posts/' + article.dateLastActivity.split('T')[0] + '-' + slugify(article.name, { strict: true, lower: true }) + '/',
    fullname: members[members.findIndex(user => user.id === article.idMembers[0])]['fullName'],
  }
  var body = article.desc
  var wholeContent = `---\n${yaml.stringify(frontMatter)}---\n\n${yaml.stringify(body)}\n`
  wholeContent = wholeContent.replace(">-", "")
  wholeContent = wholeContent.replace(">+", "")
  wholeContent = wholeContent.replace("|-", "")
  wholeContent = wholeContent.replace(">\n", "")
  return wholeContent
}

function toAuthor(article) {
  var frontMatter = {
    layout: 'default',
    link: members[members.findIndex(user => user.id === article.idMembers[0])]['username'],
    permalink: 'authors/{{link}}'
  }
  var body = '{% include "partials/authorPost.njk" %}'
  var wholeContent = `---\n${yaml.stringify(frontMatter)}---\n\n${body}\n`
  return wholeContent
}

function toLabel(article) {
  var frontMatter = {
    layout: 'default',
    link: article.labels[0].name,
    permalink: 'labels/{{link}}'
  }
  var body = '{% include "partials/labelPost.njk" %}'
  var wholeContent = `---\n${yaml.stringify(frontMatter)}---\n\n${body}\n`
  return wholeContent
}


blog.forEach(article => {
  var basename = article.dateLastActivity.split('T')[0] + '-' + slugify(article.name, { strict: true, lower: true })
  var filePath = join(postsDir, `${basename}.md`)
  fs.writeFileSync(filePath, toPost(article))
});

blog.forEach(article => {
  var basename = members[members.findIndex(user => user.id === article.idMembers[0])]['username']
  var filePath = join(authorsDir, `${basename}.njk`)
  if (fs.existsSync(filePath)) {
    //file exists
  }
  else {
    fs.writeFileSync(filePath, toAuthor(article))
  }
});

blog.forEach(article => {
  var basename = article.labels[0].name
  var filePath = join(labelsDir, `${basename}.njk`)
  if (fs.existsSync(filePath)) {
    //file exists
  }
  else {
    fs.writeFileSync(filePath, toLabel(article))
  }
});
//
