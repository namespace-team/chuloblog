---
layout: post
title: Depth Mask
date: 2023-03-09
author: sandeshshrestha17
tags: post
tag: ml
permalink: posts/2023-03-09-depth-mask/
fullname: Sandesh Shrestha
---


A depth mask provides the depth information from an image. The pixel intensity
of the depth mask represents the object's distance from a viewpoint that can be
color-coded to visually represent close or far objects. 


To display the depth map, we scale its values to [0,255] where 255 (white) pixel
represents the farthest possible depth value and 0 (black) represents the
closest potential depth value.


Depth masks are often produced by stereo cameras and monocular cameras such as
Microsoft Kinect.

