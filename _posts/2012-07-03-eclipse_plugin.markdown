---
title: Eclipse plugin 
keywords: eclipse
tags: announcement
description: First cut of PIT eclipse plugin now available
layout: post
---

Phil Glover has made a excellent start at implementing an Eclipse plugin for PIT. It is still early days, but it is already both usable and useful.

<!-- more -->

The code is available at

[https://github.com/philglover/pitclipse](https://github.com/philglover/pitclipse)

And Phil has setup an update site at

[http://pitclipse.freehostingcloud.com/repository/](http://pitclipse.freehostingcloud.com/repository/) 

It lacks bells and whistles but hopefully will grow into something more polished and feature rich.

It currently supports:

* Running PIT against an individual unit test or suite
* Mutating the entire project/module containing the test
* Displaying result in a browser window within Eclipse
* Java unit tests only (JUnit & TestNG)

It does not yet support:

* Running PIT against multiple unit tests
* Mutating across all open projects in the workspace
* Integration between the html results & the source
* Eclipse versions prior to 3.7.2 

 
