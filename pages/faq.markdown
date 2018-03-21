---
title: FAQ
description: Frequently Asked Questions
layout: default
permalink: /faq/
---

# FAQ

## What does PIT stand for?

PIT began life as a spike to run JUnit tests in parallel, using separate classloaders
to isolate static state. Once this was working it turned out to be a much less interesting problem
than mutation testing which initially needed a lot of the same plumbing.

So PIT originally stood for Parallel Isolated Test. Now it stands for PIT.

## What are the requirements for running PIT?

PIT requires Java 5 or above and either JUnit or TestNG to be on the classpath.

JUnit 4.6 or above is supported (note JUnit 3 tests can be run using JUnit 4 so JUnit 3 tests are supported).

TestNG support in PIT is quite new. PIT is built and tested against TestNG 6.1.1, it may work with earlier and later versions but this has not yet been tested. 

Additionally PIT requires a JVM that supports XStream's enhanced mode.

## PIT is taking forever to run

Mutation testing is a computationally expensive process and can take quite some time depending
on the size of your codebase and the quality and speed of your test suite. PIT is fast compared
to other mutation testing systems, but that can still mean that things will take a while.

You may be able to speed things up by

* Using more threads. The optimum number will vary, but will generally be between 1 and the number of cpus on your machine.
* Limit the number of mutation per class. This will give you a less complete picture however.
* Use filters to target only those packages or classes that are currently of interest

One thing to watch out for that can slow PIT down are tests on the classpath that are not
normally run. Some teams have very slow exhaustive tests or performance tests that are not run by their build scripts.

As PIT examines the entire classpath it will try to run these so may not even start running
mutations for several hours. These tests can be excluded using the **excludeClasses** option.

## PIT found no classes to mutate / no tests to run. What am I doing wrong?

This is most likely down to one of three issues

* Incorrect classpath
* Incorrect filters
* Incorrect mutable code path

Make sure that your code and tests are properly referenced on the classpath, and check that
the filters are not excluding your code. If you have supplied a specific mutable code path, make sure it is correct.

Note that PIT is a bytecode mutator - it does not compile your code but instead modifies
the byte code in memory. Your code must be on the classpath - PIT only requires the location
of your source code in order to generate a human readable report.

## My tests normally run green but PIT says the suite isn't green

Most commonly this is because either :-

* PIT is picking up tests that are not included/are excluded in the normal test config
* Some test rely on an environment variable or other property set in the test config, but not set in the pitest config
* The tests have a hidden order dependency that is not revealed during the normal test run 

If you are using an unusual or custom JUnit runner this can also sometimes causes problems. To make things fast PIT does some tricky stuff to split your tests into small independent units. This works well with most JUnit runners but if you encounter one where it doesn't please post to the user group. 

## Will PIT work with my mocking framework?

PIT is tested against the major mocking frameworks as part of its build. 

PIT is currently the only mutation testing system known to work with all of JMock, EasyMock, Mockito, PowerMock and JMockit.

If your mocking framework of choice is not listed above the chances are still good that PIT will work with it. If it doesn't
let us know and we'll look at getting that fixed.

## My code has really poor test coverage, will mutation testing take forever?

No. Due to the way PIT picks which tests to run there is little or no execution
time cost for mutations on lines that have no test coverage.

## How does PIT choose which tests to run?

PIT chooses and prioritises tests based on three factors

* Line coverage
* Test execution speed
* Test naming convention 

Per test case line coverage information is first gathered and all tests that do not exercise
the mutated line of code are discarded. The remaining tests are then ordered by
increasing execution time - test cases that belong to a class that is identified
as a unit test for the mutated class are however weighted above other tests.

A class is considered to be the unit test for a particular class if it matches the standard JUnit naming convention of FooTest or TestFoo.

Unlike earlier systems PIT does **not** require that your tests follow this naming convention in order for it to work. Test names are
used only as part of a heuristic to optimise run order.

## I'm seeing a lot of timeouts, what's going on?

Timeouts when running mutation tests are caused by one of two things

1 A mutation that causes an infinite loop

2 PIT thinking an infinite loop has occurred but being wrong

In order to detect infinite loops PIT measures the normal execution time of each test
without any mutations present. When the test is run in the presence of a mutation
PIT checks that the test doesn't run for any longer than

normal time * x + y

Unfortunately the real world is more complex than this. 

Test times can vary due to the order in which the tests are run. The first test in a class may have
a execution time much higher than the others as the JVM will need to load the classes
required for that test. This can be particularly pronounced in code that uses XML binding
frameworks such as jaxb where classloading may take several seconds.

When PIT runs the tests against a mutation the order of the tests will be different. Tests that
previously took milliseconds may now take seconds as they now carry the overhead of classloading. 
PIT may therefore incorrectly flag the mutation as causing an infinite loop.

An fix for this issue may be developed in a future version of PIT. In the meantime
if you encounter a large number of timeouts, try increasing y in the equations above
to a large value with **--timeoutConst** (**timeoutConstant** in maven).


## I'm using OpenJDK 7 and keep getting java.lang.Verify errors

Java 7 introduced stricter requirements for verifying stack frames, which caused issues in
earlier versions of PIT. It is believed that there were all resolved in 0.29.

If you see a verify error, please raise a defect. The issue can be worked around
by passing -XX:-UseSplitVerifier to the child jvm processes that PIT launches using the **jvmArgs** option. 

## How does PIT compare the mutation testing system X

See [mutation testing systems compared](/java_mutation_testing_systems)

## I have mutations that are not killed but should be

Are the mutations in finally blocks? Do you seem to have two or more identical mutations, some killed and some not?

If so this is due to the way in which the java compiler handles finally blocks. Basically the compiler creates
a copy of the contents of the finally block for each possible exit point. PIT creates separate mutations for each of
the copied blocks. Most test suites are only able to kill one of these mutations.

As of 0.28 PIT contains experimental support for detecting inlined code that is now active by default.

## Can I activate more mutators without relisting all the default ones?

Yes. You can specify both individual mutators and groups of them using the same syntax.

Two groups are currently defined

* DEFAULTS
* ALL

To use the defaults, plus some others

<pre class="prettyprint lang-bash">
DEFAULTS, EXPERIMENTAL_MEMBER_VARIABLE
</pre>
 
by the command line

or

<pre class="prettyprint lang-xml">
&lt;mutators&gt;
  &lt;mutator&gt;DEFAULTS&lt;/mutator&gt;
  &lt;mutator&gt;EXPERIMENTAL_MEMBER_VARIABLE&lt;/mutator&gt;
&lt;/mutators&gt;
</pre>

in your pom.xml

## I have a problem, where can I get help?

Try asking a question at

[http://groups.google.com/group/pitusers](http://groups.google.com/group/pitusers)

I'm also relatively friendly, and can be contacted at

henry@pitest.org

## Could I accidentally release mutated code if I use PIT?

No. The mutations that PIT generates are held in memory and never written to disk. 

## Where are snapshot releases uploaded to?

[https://oss.sonatype.org/content/repositories/snapshots/org/pitest/](https://oss.sonatype.org/content/repositories/snapshots/org/pitest/)

## Does PIT work with Sonar?

Alexandre Victoor maintains a Sonar plugin. [PIT Sonar plugin](http://docs.codehaus.org/display/SONAR/Pitest)

## How do I use PIT with Gradle?

See [PIT Gradle plugin](http://gradle-pitest-plugin.solidsoft.info/)

## Is there any IDE integration?

Phil Glover maintains an Eclipse plugin. [Pitclipse](https://github.com/philglover/pitclipse)

Michal Jedynak maintains an IntelliJ plugin. [PIT intellij plugin](http://plugins.intellij.net/plugin/?idea&pluginId=7119)

It is also possible to launch PIT from most other IDEs as a Java application.

## I'd like to help out, what can I do?

See [how to help](/how_to_help)

