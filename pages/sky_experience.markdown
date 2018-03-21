---
title: Sky Experience
layout: default
permalink: /sky_experience/
---

# Experience of introducing mutation testing to a team

*Matt Kirk, a Lead Developer at BSkyB kindly provided the following writeup of their experience with PIT.*

## Manual mutation testing

After working as a developer on a green field project at Sky which actually had very good unit test coverage (circa 95%) and had been mostly been built in a TDD fashion, there were still some areas which were either not covered at all by unit tests, or the unit tests weren't testing anything.  

The reasons for this varied from different skill levels in the team, time pressures, etc. but the upshot was the same, reduced confidence.  

Before embarking on any changes I would manually mutate a few lines of code in a class, run the tests to see if anything failed.  This gave me an indication as to the quality of the tests I was faced with and sometimes that quality wasn't there.  This changed the way I approached the story I was about to work on - i.e. with the addition of extra tests up front for the existing code before making the changes.  This approach adds risk as my new retrospectively added tests may have missed something in their understanding, and time as I hadn't estimated the story with the knowledge that there was additional up front work to do before even starting.  

This came up in sprint retrospectives and along with encouraging the practice of TDD I also encouraged the team to try this mutation approach with the code before committing, i.e. break it and make sure a unit test catches the break.  This was a manual process which has it's obvious limitations; not exhaustive, time consuming, or simply not being done at all.  This led me to seek out a tool which did this for us, which led me to PIT.

## Increased confidence

I'm not going to discuss what PIT does or how it does it, there are other articles for that, but from my own personal experience of using PIT I've found it not only gives me confidence in the quality of both my own and others unit test quality, but has actually been a design aid in so much that as well as finding untested code, it can also find redundant code that when deleted still implements the intended functionality.  By deleting this code, I've actually reduced the 'liability' that it was adding to the system which no longer requires ongoing maintenance by myself or other developers and cannot be a hiding plus for bugs to exist or be introduced into going forward. 

I've now introduced PIT to several other teams within Sky with various uptake on it's use as it's still in it's early days, but here is a comment from one of the developers:

*"... if strictly following TDD then you should have full coverage (probably).  However in reality there will be always be paths through the code that aren't tested and PIT highlights these... however when writing code first for whatever reason then PIT highlights what still needs testing, particularly in private methods, and then PIT becomes a driver to writing tests to get to 100% coverage... It's an integral part of the development process and I can't see us going back to a time of not using it."*

Moving forward I'd like to see better IDE (Eclipse) integration and performance improvements although by it's very nature mutation testing is computationally intensive so this may be difficult to achieve.  This can add to increased build times across a large code base which is something that seems to put some developers off, but I will continue to champion it's use and suggest you give it a try.

