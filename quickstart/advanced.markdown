---
title: Advanced usage
description: Advanced usage of PIT
tags: quickstart guide
keywords: mutation testing
layout: default
permalink: /quickstart/advanced/
---

# Advanced Usage

## Plugins

PIT exposes a number of extension points that allow user defined functionality to be plugged in. Depending on the 
extension point the default behaviour will be either replaced or extended.

Plugins must be listed, using the qualified factory name, into a file located in `classpath:META-INF/services` named with the qualified name of the factory interface (e.g. `org.pitest.mutationtest.MutationResultListenerFactory`), packaged into jar files and added to the classpath with which PIT is launched. If the plugin code has dependencies these must be either included in the jar or added to the classpath manually.

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

This interface has now been replaced by **org.pitest.mutationtest.build.MutationInterceptor** and will be removed in release 1.2.3

### Mutation interceptor

A mutation incterceptor is passed a complete list of all mutation that will be generated to each class before the mutation are challenged byt tests. It is also passed a mutater that can be used to generated the mutants and a tree based representation of the unmutated class' bytecode.

An interceptor may modify the supplied mutants, filter mutants from the list or perform a side effect such as generate a report.

Interceptors should give an indication of the type of operation they will perform by implementing the `type` method. They may declare themselves as

* OTHER - some unspecified purpose
* MODIFY - Modify mutants in a way that is functionally significant (e.g mark as poisoning JVM)
* FILTER - Remove mutants from processing
* MODIFY_COSMETIC - Modify mutants in way that will not affect processing (e.g update descriptions)
* REPORT - Output mutant in their final state

The declared type of interceptor is used only to determine the order in which they are run. 

Interceptor also declare a feature that they provide - this allows interceptors to be enabled and disabled and passed parameters using pitest's simple featute language.

eg.

```
+FOO(max[42] allow[cats] allow[dogs])
```

Enables a feature called `FOO` and configures it with max = 42 and allow = [cats,dogs]

To create a new interceptor implement the `org.pitest.mutationtest.build.MutationInterceptorFactory` interface.


### Test prioritiser

A test prioritiser assigns tests to be run against each mutation and decides the order in which they will be used to to challenge the mutant.

Only one test prioritiser may be supplied.

To create a new test prioritiser implement the **org.pitest.mutationtest.build.TestPrioritiserFactory** interface. 

### Mutation Engine

The default mutation engine of Pit is called [Gregor](https://github.com/AntonKovalyov1/pit_project/tree/f52389ea0bbadb30daab5db0b55d7fc1a5414ae3/src/main/java/org/pitest/mutationtest/engine/gregor). 

Pit is designed to support the integration of other mutation engines. Although multiple mutation engine plugins may be supplied, only one may currently be used within a single analysis.

The mutationEngine config parameter specifies the engine to use. If none is supplied the default engine is used.

Implementing a mutation engine is non trivial - for details of what is required see the org.pitest.mutationtest.engine.gregor.* packages.

#### Activating extreme mutation (pit-descartes)
[pit-descartes](http://github.com/STAMP-project/pitest-descartes) is a mutation engine for Pit which implements extreme mutation operators.

Extreme Mutation testing, originally proposed by [Niedermayr and colleagues](https://arxiv.org/pdf/1611.07163.pdf), consists in completely removing the whole logic of each method that is covered by one test case at least. All
statements in a void method are removed. In other cases the body is replaced by a return
statement. 

The key rationales for this engine are as follow:
 * a method is a good level of abstraction to reason about the code and the test suite
 * extreme mutation generates much less mutants than the [default mutation operators of Pit](http://pitest.org/quickstart/mutators/)
 * extreme mutation is a good preliminary analysis to strengthen the test suite before running the fine-grained mutation operators
 
The goal of [pit-descartes](http://github.com/STAMP-project/pitest-descartes) is to bring an effective implementation of this kind of mutationoperator into the world of PIT.

pit-descartes is availabe in [Maven Central](http://search.maven.org), and source and
documentation are available in [Descartes github](http://github.com/STAMP-project/pitest-descartes).
