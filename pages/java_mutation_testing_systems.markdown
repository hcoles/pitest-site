---
title: Java Mutation Testing Systems
layout: default
permalink: /java_mutation_testing_systems/
---

# Mutation testing systems for Java compared

## Overview

Several mutation testing systems for Java exist, this page in an attempt to objectively
categorise and compare how they are implemented and their relative merits.

In most cases the information assembled below has been obtained from the web without any direct experience
of the tools so is incomplete and potentially inaccurate. **Corrections, additions and clarifications are welcomed.**

## The mutation testing systems

### &micro;Java

WebSite : [http://cs.gmu.edu/offutt/mujava/](http://cs.gmu.edu/~offutt/mujava/)

&micro;Java is the grandaddy of mutation testing systems for Java, predating even JUnit.
 
It is the result of a collaboration between two universities, Korea Advanced Institute of Science and Technology (KAIST) in S. Korea and George Mason University in the USA. 

As of 2015, the source code has been made available at https://cs.gmu.edu/~offutt/mujava/

According to the website :

>"We offer µJava on an "as-is" basis as a service to the community. We welcome comments and feedback, but do not guarantee support in the form of question answering, bug fixing, or improvements (in other words, we don't have money for support, just good intentions)."


### Jester

WebSite : [http://jester.sourceforge.net/](http://jester.sourceforge.net/)

Jester was the first open source mutation system for Java, but does not appear to be actively developed or supported.


### Simple Jester

WebSite : [http://jester.sourceforge.net/](http://jester.sourceforge.net/)

Simple Jester is a variant of the original Jester by the same author who describes it as easier to use, but slower <sup id="fnref1">[1](#fn1)</sup>.

It appears to no longer be actively developed or supported.

### Jumble

WebSite : [http://jumble.sourceforge.net/](http://jumble.sourceforge.net/)

Jumble was developed in 2003-2006 by a commercial company in New Zealand before being open sourced under the GPL licence. The licence was later
changed to Apache2 to enable the mutator to be used in earlier versions of PIT.

Although no releases have been made since 2009 some development activity seems to still be taking place and the authors respond to queries to the
mailing list.


### Javalanche

WebSite : [http://www.st.cs.uni-saarland.de/mutation/](http://www.st.cs.uni-saarland.de/mutation/)

Javalanche was developed by a team based at Saarland University in Germany.

According to their website

>"Javalanche is built for efficiency from the ground up, manipulating byte code directly and allowing mutation testing of programs that are several orders of magnitude larger than earlier research subjects. Javalanche addresses the problem of equivalent mutants by assessing the impact of mutations on dynamic invariants: The more invariants impacted by a mutation, the more likely it is to be useful for improving test suites."

Source code is available but no public issue tracking or mailing list is provided.

### PIT

WebSite : [http://pitest.org](http://pitest.org)

PIT was developed just for fun, originally as a parallel and distributed testing framework, before being gradually diverted
into being a mutation testing tool. 

Early versions of PIT used the Jumble mutation engine, but made improvements over Jumble in terms of performance,
usability and compatibility with third-party libraries (e.g mocking frameworks). Recent versions of PIT use its own mutation engine.

PIT aims to provide a high-performance, scalable user-friendly tool that makes mutation testing practical for real-world codebases. As of the 0.29 release PIT is also the first generally available incremental mutation testing system, with the option to amortize the cost of analysis by storing a history of results.

Source code is provided and support is available via mailing list and public issue tracking.
 
# Classifications

Mutation testing can be conceptually split into four phases

* Mutant generation - in which the classes are analysed and mutants created
* Test selection - in which tests are selected to run against the mutants
* Mutant insertion - in which mutants are loaded into a JVM
* Mutant detection - in which the selected tests are run against the loaded mutant

In practice, some of these phases may be concurrent or hard to distinguish from each other. In some systems only the generation phase is automated.

There are various strategies by which these phases might be implemented, some possibilities for each stage are discussed in the next section.

For bytecode-based systems the mutant detection phase will usually be the most computationally expensive, but its speed is likely to be largely determined by how well the test selection stage was performed.

For source code mutation systems the generation phase may also represent a significant proportion of the computational cost if a naive approach is followed.

## Mutant generation

### Source code

Source mutators create mutations by making changes to the Java source files and recompiling them. 

#### Pros

* A large range of mutations can be generated this way
* Mutations can closely mimic the types of errors a programmer might make
* The mutations made can be clearly described and understood

#### Cons

* Source-based mutators are generally harder to integrate into a build
* Generating mutations in this way is relatively slow
* Mutants must be written to disk, limiting the methods by which they can be inserted
* In theory a mutant class could be accidentally released

### Byte code

Byte code mutators create mutations by manipulating the compiled byte code. This will
usually be done using a third-party library such as ASM, Javassist or BCEL.

Of these libraries, BCEL is no longer actively developed or maintained.

#### Pros

* Generally much faster
* Generally easier to integrate into a build
* Can potentially create mutants without access to source files
* Same mutation operators can in theory work for other JVM languages <sup id="fnref2">[2](#fn2)</sup>

#### Cons

* More difficult to develop mutation operators this way
* Mutations are divorced from the source code and may not be representative of errors a programmer would make
* Can be hard to describe/explain the mutations that must work around intricacies of the JVM


## Test selection

There are many great possible ways in which test selection might be performed and optimised. The decisions
made at this stage will largely dictate the performance of the detection phase. 

Very broadly we can categorize the strategies as follows, but there may be significant differences between systems that have been
placed within the same category.


### Manual

It is left to the user to select the tests to be run against a mutant. These systems are not designed to be integrated into a build, but
instead, provide an interface by which a user can select an individual class to mutate and the tests to run.

#### Pros

* ?

#### Cons

* Manually intensive
* Can only be used to determine the coverage of individual classes

### Naive

Test selection is automatic, but little or no attempt is made to pick relevant tests for each mutant. Potentially the entire suite, or a large portion of the test suite, is run against each mutant.

#### Pros

* None

#### Cons

* Glacially slow for anything except the smallest projects.

### Convention based

Test selection is automatic, with tests selected from the suite based on a naming convention or other simple scheme such as annotations. Optimisations
may also be implemented to choose an optimal running order for the tests.

#### Pros

* Faster than a naive approach

#### Cons

* Will not give an accurate picture if mutants are covered by tests not picked up by the convention
* Performs badly for mutants that are not exercised by tests 

### Coverage based

Test selection is automatic. Tests are selected by first measuring their line, block or instruction coverage. Only those tests that exercise the line, block or instruction that contains the mutant will be run against it.

Optimisations may also be implemented to choose an optimal running order for the tests.

#### Pros

* Fast - only those tests that could kill the mutant will be run against it
* Performs particularly well for mutants that are not exercised by tests - none will be run
* Provides an accurate picture of the coverage of an entire suite

#### Cons

* Some overhead required to measure coverage <sup id="fnref3">[3](#fn3)</sup>.

## Mutant insertion

### Naive

Mutants are generated, the class files written to disk, and a new JVM is launched with the mutant on the classpath.

#### Pros

* Should reliably work with any JVM
* Mutants will be active during the construction of static state (singletons, static initializers etc)

#### Cons

* Slow - a new JVM has to be launched for each mutant

### Mutant schemata

A single class is generated that contains all mutants, each mutant is then enabled programmatically. Mutant schemata could be used as part of any scheme for mutant insertion, but makes more sense as a variant of a scheme in which class files are written to disk.

#### Pros

* Much faster than the plain naive scheme
* Should reliably work with any JVM

#### Cons

* Mutants will not be active during the construction of static state (singletons, static initializers etc)

### Non-delegating class loader

Mutants are held in memory and inserted into the JVM by creating a new classloader that does not delegate to its parent when loading
the mutant class.

#### Pros

* Faster than naive scheme
* Mutants will be active during the construction of static state (singletons, static initializers etc)
* Mutants cannot be accidentally released

#### Cons

* Breaking the delegation model can lead to classpath issues, particularly with code that uses XML APIs
* Can require large amounts of permgen space

### Delegating class loader

Mutants are held in memory and inserted into the JVM by creating a new classloader which has the boot classloader as a parent.

#### Pros

* Faster than naive scheme
* Fewer classpath problems than non-delegating classloader
* Mutants will be active during the construction of static state (singletons, static initializers etc)
* Mutants cannot be accidentally released

#### Cons

* Slower than non-delegating classloader as requires more classloading 
* Requires more permgen space than non-delegating loader

### Debugger hotswap

Mutants are held in memory and the debugger API is used to insert them into a running JVM.

*Note the expected performance of this approach is unclear. The debugger can degrade the overall performance
of a JVM significantly, but this approach does avoid having to launch a new JVM for each mutant.*

#### Pros

* Performance (?)
* Mutants cannot be accidentally released

#### Cons

* Performance (?)
* Mutants will not be active during the construction of static state (singletons, static initializers etc)
* Requires a JVM with support for this API

### Instrumentation API

Mutants are held in memory and inserted into a JVM using the instrumentation API.

#### Pros

* Faster than classloaders and debugger API

#### Cons

* Mutants will not be active during the construction of static state (singletons, static initializers etc)
* Requires a JVM with support for this API

## Mutant detection

### Naive

All selected tests are run.

#### Pros

* ?

#### Cons

* Slow

### Early exit (coarse)

The selected test classes are run until one of them kills a mutant.

#### Pros

* Potentially much faster than the naive approach

#### Cons

* All tests within a class are run to completion so slower than a more fine-grained approach

### Early exit (fine)

Test classes are split into individual test cases which are then run until one of them kills a mutant.

#### Pros

* Potentially faster than other approaches

#### Cons

* Some overhead required to split the test cases
* Splitting tests out of classes may cause issues with some JUnit extensions


## Output

The output of the tools can be broadly categorized as follows

* Plain text (**T**) - simple output containing the description of the mutation and results
* Prettified (**P**) - similar content to plain text but with visual formatting, usually HTML
* Annotated Source (**AS**) - original or mutated source file is annotated with results

These formats are largely for human consumption. The tools may also produce results in a structured format (**SF**) suitable to be read and manipulated
by other tools, eg XML, RDMS etc.


## Summary Of Mutation Testing Systems

### Classification and details

| System                          | Generation | Selection    | Insertion     | Detection   | Output | SF    | License | Mailing List                            |
|---------------------------------|------------|--------------|---------------|-------------|--------|-------|---------|-----------------------------------------|
| [Jester](#jester)               | Source     | Naive ?      | Naive ?       | Naive ?     | **AS** | N     | MIT     | N                                       |
| [Simple Jester](#simple-jester) | Source     | Naive ?      | Naive ?       | Naive ?     | **AS** | N     | MIT     | N                                       |
| [Jumble](#jumble)               | BCEL       | Convention   | NDClassloader | **EE Fine** | T      | N     | APCH2   | **Y** <sup id="fnref4">[4](#fn4)</sup>. |
| [PIT](#pit)                     | ASM        | **Coverage** | Instrument    | **EE Fine** | **AS** | **Y** | APCH2   | **Y** <sup id="fnref5">[5](#fn5)</sup>. |
| [µJava](#µjava)                 | Source ?   | Manual       | N/A           | N/A         | **AS** | N     | ?       | N                                       |
| [javaLanche](#javalanche)       | ASM        | **Coverage** | Schemata      | EE Fine ?   | P      | **Y** | LGPL    | N                                       |
{:.table}

### Java and Test framework support

| System                          | 1.4 | 1.5 | 1.6 | 1.7 | 1.8 | JUnit3 | JUnit4 | TestNG |
|---------------------------------|-----|-----|-----|-----|-----|--------|--------|--------|
| [Jester](#jester)               | N   |**Y**|**Y**| N   | N   |**Y**   |**Y**   | N      |
| [Simple Jester](#simple-jester) | N   |**Y**|**Y**| N   | N   |**Y**   |**Y**   | N      |
| [Jumble](#jumble)               |**Y**|**Y**|**Y**| ?   | ?   |**Y**   |**Y**   | N      |
| [PIT](#pit)                     | N   |**Y**|**Y**|**Y**|**Y**|**Y**   |**Y**   |**Y**   |
| [µJava](#µjava)                 |**Y**| N   | N   | N   | N   | N      | N      | N      |
| [javaLanche](#javalanche)       | N   |**Y**|**Y**| ?   | ?   |**Y**   |**Y**   | N      |
{:.table}

### Tool integration

* **Y**- supported out of the box
* N - no support
* ! - supported but with issues reported
* 3rd - supported via 3rd party component 
* ? - don't know

*note that with the exception of PIT little information is available on the compatibility of the various mutation testing systems and
mocking frameworks. Most mocking systems are implemented with dynamic proxies or custom class loaders, and will probably work across all the mutation testing systems. The exceptions are Powermock and JMockit where issues might be encountered.*

| System                          | Ant | Maven | Eclipse                              | Powermock | JMock | JMock2 | Mockito | JMockit                             | EasyMock                           |
|---------------------------------|-----|-------|--------------------------------------|-----------|-------|--------|---------|-------------------------------------|------------------------------------|
| [Jester](#jester)               | N   | N     | N                                    | ?         | ?     | ?      | ?       | ?                                   | ?                                  |   
| [Simple Jester](#simple-jester) | N   | N     | N                                    | ?         | ?     | ?      | ?       | ?                                   | ?                                  |
| [Jumble](#jumble)               |**Y**| N     | **Y**                                | ?         | **Y** | **Y**  | **Y**   | N <sup id="fnref6">[6](#fn6)</sup>. | ?                                  |
| [PIT](#pit)                     |**Y**|**Y**  | 3rd                                  | **Y**     | **Y** | **Y**  | **Y**   | **Y**                               | **Y**                              |
| [µJava](#µjava)                 | N   | N     | 3rd <sup id="fnref7">[7](#fn7)</sup> | ?         | ?     | ?      | ?       | ?                                   | ?                                  |
| [javaLanche](#javalanche)       | N   | N     | ?                                    | ?         | ?     | ?      | ?       | N <sup id="fnref8">[8](#fn8)</sup>. | ! <sup id="fnref9">[9](#fn9)</sup>.|
{:.table}

# Conclusions

Of the systems listed, the only three that seem suitable for any serious use in real projects are PIT, Jumble and Javalanche.

Jumble is the only one to offer support for versions of Java prior to 1.5. It is however slower and less sophisticated than the two coverage based systems and is unable to provide a view of the effectiveness of a whole test suite. Documentation is limited, but support is available via a mailing list.

Javalanche is less mature than Jumble, and currently does not integrate with any of the main build tools. It is unclear what support is available, and documentation is limited. It does however provide the unique feature of equivalent mutation detection. This comes with a high computational cost, but would be the least time consuming approach if you have a large number of surviving mutants and a requirement to categorize each one.

Although PIT is the most recent of the three projects it is actively developed and releases frequently, making it more mature than the other projects that seem to have had little attention after their initial release.

Support is available via a google group and documentation is the strongest of the three. PIT integrates with both the major build systems - it is the only project to provide a Maven plugin. PIT is the only option for TestNG users, and also the only system to have no known issues with any of the major mocking frameworks. It also offers the unique feature of incremental analysis.

<hr/>

1. [Ivan more on Simple Jester](http://ivan.truemesh.com/archives/000725.html) <a name="fn1" id="fn1"></a>
  [↩](#fnref1)
2. In practice the operators may however end up mutating mainly the compiler generated plumbing code for these languages <a name="fn2" id="fn2"></a>
  [↩](#fnref2)
3. In most circumstances this will be insignificant compared to the cost of mutation analysis, but could be significant if only a small number of mutants are being generated within a large project with a slow test suite. PIT’s dependency analysis feature addresses this scenario. <a name="fn3" id="fn3"></a>
  [↩](#fnref3)
4. [jumble mailing list](https://lists.sourceforge.net/lists/listinfo/jumble-users) <a name="fn4" id="fn4"></a>
  [↩](#fnref4)
5. [pit google group](http://groups.google.com/group/pitusers?pli=1) <a name="fn5" id="fn5"></a>
  [↩](#fnref5)
6. [jmockit bug report of issues with Jumble](http://code.google.com/p/jmockit/issues/detail?id=92) <a name="fn6" id="fn6"></a>
  [↩](#fnref6)
7. note that [muclipse](http://muclipse.sourceforge.net/) is no longer actively developed <a name="fn7" id="fn7"></a>
  [↩](#fnref7)
8. [user report of issues with JMockit and Javalanche](http://groups.google.com/group/pitusers/browse_thread/thread/ffcf8b5a7ff1bcc2) <a name="fn8" id="fn8"></a>
  [↩](#fnref8)
9. [report of issues with EasyMock and Javalanche](http://blog.octo.com/en/mutation-testing-a-step-further-to-the-perfection/)<a name="fn9" id="fn9"></a>
  [↩](#fnref9)
