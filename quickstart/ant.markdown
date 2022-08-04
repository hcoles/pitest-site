---
title: Ant quick start
description: Quickstart guide for mutation testing with PIT via ant
tags: quickstart guide
keywords: ant, mutation testing
layout: default
permalink: /quickstart/ant/
---

# Ant Quick Start

## Installation

Download the latest PITest and pitest-ant jars and put them somewhere convenient.

## Getting started

First, define the PIT task within your build

```xml
<taskdef name="pitest" classname="org.pitest.ant.PitestTask" classpathref="pit.path" />
```

The referenced classpath should pitest.jar, pitest-ant.jar and pitest-entry.jar along with any plugins you wish to use. The test library (i.e JUnit or TestNG), xstream and xmlpull must also be referenced here as well as on your compilation classpath. The requirement for these additional jars will hopefully be removed in a future release.

Next, create a target

```xml
<target name="mutationCoverage">
    <pitest
        pitClasspath="pit.path"
        classPath="mutation.path"
        targetClasses="com.yourcodebase.*"
        targetTests="com.yourcodebase.*"
        reportDir="pathToWhereYouWantOutput"
        sourceDir="pathToYourSource"/>
</target>
```

Two separate classpaths need to be supplied - pitClasspath should contain the PITest jars and plugins (plus test library), and classPath should contain the classpath used when normally running your unit tests (including the test library).

The two classpaths are kept separate so no conflict should occur if you use a plugin that depends upon a conflicting version of a library used by your code.

## Ant specific configuration

The classPath parameter is used to supply PIT with the classpath to examine tests and code to mutate, and for all dependencies required to run the tests.

PIT will accept a path defined using any of the standard Ant mechanisms.

**Note - by default PIT will not mutate code within jar files or directories called test-classes or test-bin. If this is not the desired behaviour please refer to the general configuration options that PIT supports.**

## Other configuration

PIT supports a number of configuration options, their behaviour is identical to that described in [Command line quick start](/quickstart/commandline "Command line quick start"). The names of these options map to parameters on the ant task.

## Quick-start example

To help people evaluate PIT an example project using ant is provided at [pit ant example](https://github.com/hcoles/pitest-ant-example)

To try it out check out the source

```bash
git clone https://github.com/hcoles/pitest-ant-example.git
```

then run the pit target

```bash
ant pit
```

Mutation testing should complete in 10 to 20 seconds (most of which is PIT waiting to decide if it has encountered an infinite loop), then the results should be
written in HTML to the pitReports folder.
