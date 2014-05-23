---
title: Advanced usage
description: Advanced usage of PIT
tags: quickstart guide
keywords: mutation testing
layout: default
alias: quickstart/advanced
---

# Advanced Usage

## Plugins

PIT exposes a number of extension points that allow user defined functionality to be plugged in. Depending on the 
extension point the default behaviour will be either replaced or extended.

Plugins must be packaged into jar files and added to the classpath with which PIT is launched. If the plugin code has dependencies these must be either included in the jar or added to the classpath manually.

The launch classpath (aka the tool classpath) and the classpath of the system under test (aka the client classpath) are generally kept seperate so no conflict should occur if the system under test contains a conflicting version of a library used by a plugin. Some plugins must however be present while the tests are executed - these plugins should either contain no dependencies or should relocate them to internal packages to ensure that no conflict occurs. Extension points that carry this requirement can be easily identified as they extend the ClientClasspathPlugin interface.

To work correctly with the maven mojo plugins should include an implementation vendor and implementation title in the jar manifest that match the maven group id and artifact id of the plugin.

The extension points are described below. Be aware that it is relatively likely that the described interfaces will change as development continues.

### Mutation Result Listener (aka output format)

A mutation result listener receives the details of analysed mutations as they arrive. Most commonly result listeners export the results in a structured format but may be used for other purposes.

Multiple result listeners may be supplied. Each listener must provide a unique name, to enable a listener the user must include the name in the outputFormats config parameter.

To create a new listener implement the **org.pitest.mutationtest.MutationResultListenerFactory** interface.

### Mutation filter

A mutation filter is passed a complete list of all mutations generated for each class before the mutations are challenged by tests. It may remove mutations from this list based on any arbritary criteria.

Multiple filters may be supplied. All filters on the classpath will be applied unless they implement some mechanism to disable themselves.

To create a new mutation filter implement the **org.pitest.mutationtest.filter.MutationFilterFactory** interface.

### Test prioritiser

A test prioritiser assigns tests to be run against each mutation and decides the order in which they will be used to to challenge the mutant.

Only one test prioritiser may be supplied.

To create a new test prioritiser implement the **org.pitest.mutationtest.build.TestPrioritiserFactory** interface. 

### Mutation Engine

Additional mutation engines may be supplied. Allthough multiple mutation engine plugins may be supplied, only one may currently be used
within a single analysis.

The engine to use is indicated by the mutationEngine config parameter. If none is supplied the default "gregor" engine will be used.

Implementing a mutation engine is non trivial - for details of what is required see the org.pitest.mutationtest.engine.gregor.* packages.
