---
layout: default
title: Baseurl in Jekyll
date: 2022-04-29
---

When using custom domain in github pages in repository other than `username.github.io`, we don't need to add `baseurl` in `_config.yml`. We can just set `url` and add a `CNAME` file with domain name in it. 

_config.yml

```
name: Chulo Solutions
description: Chulo Solutions everyday learning blog
url: https://til.chulo-solutions.com
```
       