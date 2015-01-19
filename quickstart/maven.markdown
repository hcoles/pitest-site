---
title: Quickstart for maven users
description: Quickstart guide for mutation testing with PIT and maven
tags: quickstart, guide
keywords: maven, mutation testing
layout: default
permalink: /quickstart/maven/
---

# Maven Quick Start

## Installation

PIT is available from [maven central](http://search.maven.org/#search|ga|1|a%3A%22pitest-maven%22) and
[jcenter](https://bintray.com/bintray/jcenter/org.pitest%3Apitest-maven/view) as of version 0.20.

## Getting started

Add the plugin to build/plugins in your pom.xml

<pre class="prettyprint lang-xml">
&lt;plugin&gt;
    &lt;groupId&gt;org.pitest&lt;/groupId&gt;
    &lt;artifactId&gt;pitest-maven&lt;/artifactId&gt;
    &lt;version&gt;LATEST&lt;/version&gt;
    &lt;configuration&gt;
        &lt;targetClasses&gt;
            &lt;param&gt;com.your.package.root.want.to.mutate*&lt;/param&gt;
        &lt;/targetClasses&gt;
        &lt;targetTests&gt;
            &lt;param&gt;com.your.package.root*&lt;/param&gt;
        &lt;/targetTests&gt;
    &lt;/configuration&gt;
&lt;/plugin&gt;
</pre>

**That's it, you're up and running.**

PIT provides two goals

### mutationCoverage goal

The mutation coverage goal analyses all classes in the codebase that match the target tests and target classes filters.

It can be run directly from the commandline

<pre class="prettyprint lang-bash">
mvn org.pitest:pitest-maven:mutationCoverage
</pre>

This will output an html report to **target/pit-reports/YYYYMMDDHHMI**.


### scmMutationCoverage goal

The scm mutation coverage goal analyses only classes that match the filters and the source file has a given status within the project source control system (by default ADDED or MODIFIED). This provides a quick way to check the coverage of changes prior to checking code in / pushing code to a repository.

<pre class="prettyprint lang-bash">
mvn org.pitest:pitest-maven:scmMutationCoverage -Dinclude=ADDED,UNKNOWN -DmutationThreshold=85
</pre>

To use this goal the maven [scm plugin](http://maven.apache.org/scm/maven-scm-plugin/usage.html) must be correctly configured for the project



This goal does not currently guarantee to analyse changes made to non public classes that are not inner classes.


## Other options

PIT tries to work sensibly out of the box, but also provides many configuration options.

The number of threads and list of mutation operators are both worth having a play with.

### reportsDirectory

Output directory for the reports

### targetClasses

The classes to be mutated. This is expressed as a list of globs.

For example

<pre class="prettyprint lang-xml">
&lt;targetClasses&gt;
    &lt;param&gt;com.mycompany.*&lt;/param&gt;
&lt;/targetClasses&gt;
</pre>

or

<pre class="prettyprint lang-xml">
&lt;targetClasses&gt;
    &lt;param&gt;com.mycompany.package.*&lt;/param&gt;
    &lt;param&gt;com.mycompany.packageB.Foo*&lt;/param&gt;
    &lt;param&gt;com.partner.*&lt;/param&gt;
&lt;/targetClasses&gt;
</pre>

### targetTests

A list of globs can be supplied to this parameter to limit the tests available to be run. If this parameter is not supplied
then any test fixture that matched inScopeClasses may be used.

This parameter can be used to point PIT to a top level suite or suites. Custom suites such as [ClassPathSuite](http://johanneslink.net/projects/cpsuite.jsp) 
are supported. Tests found via these suites can also be limited by the distance filter (see below).

### <del>inScopeClasses</del> (removed in 0.27)

<del>The inScopeClasses and targetClasses parameters look confusingly similar. Both are
lists of globs that will be matched against the names of classes on your classpath.</del>

<del>Only classes that match the inScopeClasses globs will be considered as runnable tests or mutable classes. If you
have a large classpath to scan this parameter can be used to limit the classes that are examined (and therefore loaded).</del>

<del>The targetClasses globs are then used to filter out a subset of these classes which will be considered
for mutation.</del>

<del>In practice inScopeClasses and targetClasses are often then same. If you don't specify them explicitly then PIT will construct a
glob from the project's group id of the form. group.id.*</del>

### maxDependencyDistance

PIT can optionally apply an additional filter to the supplied tests, such that only tests a certain distance from
a mutated class will be considered for running. e.g A test that directly calls a method on a mutated class has a distance of 1
, a test that calls a method on a class that uses the mutee as an implementation detail has a distance of 2 etc.

**This filter will not work for tests that utilise classes via interfaces, reflection or other methods where the dependencies between classes cannot be determined from the byte code.**

The distance filter is particularly useful when performing a targeted mutation test of a subset of classes within
a large project as it avoids the overheads of calculating the times and coverage of tests that cannot exercise the mutees.

### threads

The number of threads to use when mutation testing. By default a single thread will be used.

### mutateStaticInitializers

Whether or not to create mutations in static initializers. Defaults to false.

### mutators

List of mutation operators to apply.

for example

<pre class="prettyprint lang-xml">
&lt;configuration&gt;
    &lt;mutators&gt;
        &lt;mutator&gt;CONSTRUCTOR_CALLS&lt;/mutator&gt;
        &lt;mutator&gt;NON_VOID_METHOD_CALLS&lt;/mutator&gt;
    &lt;/mutators&gt;
&lt;/configuration&gt;
</pre>

For details of the available mutators and the default set applied see [mutation operators](/quickstart/mutators/).

### excludedMethods

List of globs to match against method names. Methods matching the
globs will be excluded from mutation.

### excludedClasses

List of globs to match against class names. Matching classes will be excluded
from mutation. Matching test classes will not be run (note if a suite includes an
excluded class, then it will "leak" back in).

### avoidCallsTo

List of packages and classes which are to be considered outside the scope of mutation. Any lines
of code containing calls to these classes will not be mutated.

If a list is not explicitly supplied then PIT will default to a list of common logging
packages as follows

* java.util.logging
* org.apache.log4j
* org.slf4j
* org.apache.commons.logging

So, the configuration section must look like:

<pre class="prettyprint lang-xml">
&lt;avoidCallsTo&gt;
    &lt;avoidCallsTo&gt;java.util.logging&lt;/avoidCallsTo&gt;
    &lt;avoidCallsTo&gt;org.apache.log4j&lt;/avoidCallsTo&gt;
    &lt;avoidCallsTo&gt;org.slf4j&lt;/avoidCallsTo&gt;
    &lt;avoidCallsTo&gt;org.apache.commons.logging&lt;/avoidCallsTo&gt;
&lt;/avoidCallsTo&gt;
</pre>


### verbose

Output verbose logging. Defaults to off/false.

### timeoutFactor

A factor to apply to the normal runtime of a test when considering if it is stuck in an infinite loop.

Defaults to 1.25

### timeoutConstant

Constant amount of additional time to allow a test to run for (after the application of the timeoutFactor) before
considering it to be stuck in an infinite loop.

Defaults to 3000

### maxMutationsPerClass

The maximum number of mutations to create per class. Use 0 or -ve number to set no limit.

### jvmArgs

List of arguments to use when PIT launches child processes. This is most commonly used to increase the amount of memory available
to the process, but may be used to pass any valid JVM argument.

For example when running on OpenJDK 7 the it is sometimes necessary to disable the split verifier.

<pre class="prettyprint lang-xml">
&lt;jvmArgs&gt;
    &lt;value&gt;-XX:-UseSplitVerifier&lt;/value&gt;
&lt;/jvmArgs&gt;
</pre>

### jvm

The path to tha java executable to be used to launch test with. If none is supplied defaults to the one pointed to by ```JAVA_HOME```.

### outputFormats

List of formats in which to write mutation results as the mutations are analysed. Supported formats are HTML, XML, CSV.

Defaults to HTML.

### failWhenNoMutations

Whether to throw error when no mutations found.

Defaults to true.

### excludedGroups

List of TestNG groups or JUnit Categories to exclude from mutation analysis.

### includedGroups

List of TestNG groups or JUnit Categories to include in mutation analysis.

### mutationUnitSize

Maximum number of mutations to include in a single analysis unit.

Defaults to 0 (unlimited)

### exportLineCoverage

Export line coverage data.

Defaults to false

### mutationEngine

Engine to use when generating mutations. Additional engines may be added via plugins.

Defaults to gregor

### additionalClasspathElements

List of additional classpath entries to use when looking for tests and mutable code.
These will be used in addition to the classpath with which PIT is launched.

### detectInlinedCode

Enabled by default since 0.29.

Indicates if PIT should attempt to detect the inlined code generated by the java compiler in order to implement
finally blocks. Each copy of the inlined code would normally be mutated separately, resulting in multiple
identical looking mutations. When inlined code detection is enabled PIT will attempt to spot inlined code and create
only a single mutation that mutates all affected instructions simultaneously.

The algorithm cannot easily distinguish between inlined copies of code, and genuine duplicate instructions
on the same line within a finally block.

In the case of any doubt PIT will act cautiously and assume that the code is not inlined.

This will be detected as two separate inlined instructions

<pre class="prettyprint lang-xml">
finally {
    int++;
    int++;
}
</pre>

But this will look confusing so PIT will assume no in-lining is taking place.

<pre class="prettyprint lang-xml">
finally {
    int++; int++;
}
</pre>

This sort of pattern might not be common with integer addition, but things like string concatenation are likely to produce multiple similar instructions on the same line.

Defaults to false.

### timestampedReports 

By default PIT will create a date and time stamped folder for its output each it is run. This can can make automation difficult, so the behaviour can be suppressed by setting timestampedReports to false.

Defaults to true.

### mutationThreshold

Mutation score threshold at which to fail build.

Please bear in mind that your build may contain equivalent mutations. Careful thought must therefore be given when selecting a threshold.

### coverageThreshold

Line coverage threshold at which to fail build.

### historyInputFile

Path to a file containing history information for [incremental analysis](/quickstart/incremental_analysis/).

### historyOutputFile

Path to write history information for [incremental analysis](/quickstart/incremental_analysis/). May be the same as historyInputFile.
