---
title: Command line quick start
description: Quickstart guide for mutation testing with PIT via the command line
tags: quickstart, guide
keywords: command line, mutation testing
layout: default
permalink: /quickstart/commandline/
---

# Command Line Quick Start

## Installation

Download the pitest-command-line and pitest jars and place them somewhere convenient.

## Getting started

It recommended that you use one of the provided build system plugins instead of the command-line tool. The build plugins are easier to use and you are much less likely to encounter configuration problems. 

Please only use the command-line tool if you have a really good reason to do so.

A mutation coverage report can be launched from the command line as follows

```
java -cp <your classpath including pit jar and dependencies> \
    org.pitest.mutationtest.commandline.MutationCoverageReport \
    --reportDir <outputdir> \
    --targetClasses com.your.package.tobemutated* \
    --targetTests com.your.package.*
    --sourceDirs <pathtosource>
```

The command-line jar, core pitest jar, pitest-entry and either JUnit or TestNG will need to be on the classpath. 

The command-line tool supports two methods of supplying the classpath to be mutated.

By default the launch classpath will be used. This can be convenient when launching from an IDE such as Eclipse as the IDE will create the
classpath string for you, it may however cause problems if you use plugins that require conflicting versions of libraries that your code also depends on.

Additional classPath elements can be supplied as a comma separated list, and the default use of the launch classpath suppressed with a flag.

When run a folder containing html mutation reports will be written in the supplied reportDir path.

## Configuration

### \--includeLaunchClasspath

Indicates if the PIT should try to mutate classes on the classpath with which it was launched. If not supplied this flag defaults to true. If set to false only classes found on the paths specified by the --classPath option will be considered.
 
### \--reportDir

Output directory for the reports

### \--targetClasses

The classes to be mutated. This is expressed as a comma separated list of globs.

For example

```
com.mycompany.*
```

or

```
com.mycompany.package.*, com.mycompany.packageB.Foo, com.partner.*
```

### \--targetTests

A comma separated list of globs can be supplied to this parameter to limit the tests available to be run. If this parameter is not supplied
then any test fixture that matched targetClasses may be used, it is however recommended that this parameter is always explicitly set.

This parameter can be used to point PIT to a top level suite or suites. Custom suites such as [ClassPathSuite](https://github.com/takari/takari-cpsuite)
are supported. Tests found via these suites can also be limited by the distance filter (see below).

### \--dependencyDistance

**Removed in 1.9.0**

~~PIT can optionally apply an additional filter to the supplied tests, such that only tests a certain distance from a mutated class will be considered for running. e.g A test that directly calls a method on a mutated class has a distance of 0, a test that calls a method on a class that uses the mutee as an implementation detail has a distance of 1 etc.~~

~~This filter will not work for tests that utilise classes via interfaces, reflection or other methods where the dependencies between classes cannot be determined from the byte code.~~

~~The distance filter is particularly useful when performing a targeted mutation test of a subset of classes within a large project as it avoids the overheads of calculating the times and coverage of tests that cannot exercise the mutees.~~

### \--threads
 
The number of threads to use when mutation testing.

### \--mutateStaticInits

**Support for mutating static initializers was removed in pitest 1.3.0**

~~Whether or not to create mutations in static initializers. Defaults to false.~~

### \--mutators

Comma separated list of mutation operators.

### \--excludedMethods

List of globs to match against method names. Methods matching the
globs will be excluded from mutation.

### \--excludedClasses

List of globs to match against class names. Matching classes will be excluded from mutation. 

Prior to release 1.3.0 tests matching this filter were also excluded from being run. From 1.3.0 onwards tests are excluded with the excludedTests parameter.

### \--excludedTests

List of globs to match against test class names. Matching tests will not be run (note if a test suite includes an excluded class, then it will "leak" back in).

### \--avoidCallsTo

List of packages and classes which are to be considered outside the scope of mutation. Any lines
of code containing calls to these classes will not be mutated.

If a list is not explicitly supplied then PIT will default to a list of common logging
packages as follows

* java.util.logging
* org.apache.log4j
* org.slf4j
* org.apache.commons.logging

If the feature `FLOGCALL` is disabled, this parameter is ignored and logging calls are also mutated.

### \--verbose

Output verbose logging. Defaults to off/false.

### \--timeoutFactor

A factor to apply to the normal runtime of a test when considering if it is stuck in an infinite loop.

Defaults to 1.25

### \--timeoutConst

Constant amount of additional time to allow a test to run for (after the application of the timeoutFactor) before
considering it to be stuck in an infinite loop.

Defaults to 4000


### \--maxMutationsPerClass

This parameter was removed in release 1.2.3 and has been replaced by the `CLASSLIMIT` feature.

This can be configured as follows

```bash
features="+CLASSLIMIT(limit[42])"
```

~~The maximum number of mutations to create per class. Use 0 or -ve number to set no limit.~~

### \--jvmArgs

Argument string to use when PIT launches child processes. This is most commonly used to increase the amount of memory available
to the process, but may be used to pass any valid JVM argument.

### \--jvmPath

The path to the java executable to be used to launch test with. If none is supplied defaults to the one pointed to by ```JAVA_HOME```.

### \--outputFormats

Comma separated list of formats in which to write mutation results as the mutations are analysed. Supported formats are HTML, XML, CSV.

Defaults to HTML.

### \--failWhenNoMutations

Whether to throw an error when no mutations found.

Defaults to true

### \--classPath

Comma separated list (yes comma separated - this is admittedly a bit weird for a classpath) of additional classpath entries to use when looking for tests and mutable code.

These will be used in addition to the classpath with which PIT is launched. 

### \--mutableCodePaths

List of classpaths which should be considered to contain mutable code. If your build maintains
separate output directories for tests and production classes this parameter should be set to your code output directory in order
to avoid mutating test helper classes etc.

If no mutableCodePath is supplied PIT will default to considering anything not defined within a jar or zip file as being a
candidate for mutation.

PIT will always attempt not to mutate test classes even if they are defined on a mutable path.

### \--testPlugin

**No longer required**. Test plugins are now selected automatically.

### \--includedGroups

Comma separated list of TestNG groups/JUnit categories to include in mutation analysis. Note that only class level categories are supported.

### \--excludedGroups

Comma separated list of TestNG groups/JUnit categories to exclude from mutation analysis. Note that only class level categories are supported.

### \--detectInlinedCode

Enabled by default since 0.29.

Flag to indicate if PIT should attempt to detect the inlined code generated by the java compiler in order to implement finally blocks. Each copy of the inlined code would normally be mutated separately, resulting in multiple identical looking mutations. When inlined code detection is enabled PIT will attempt to spot inlined code and create only a single mutation that mutates all affected instructions simultaneously.

The algorithm cannot easily distinguish between inlined copies of code, and genuine duplicate instructions on the same line within a finally block. 

In the case of any doubt PIT will act cautiously and assume that the code is not inlined.

This will be detected as two separate inlined instructions

```java
finally {
  int++;
  int++;
}
```

But this will look confusing so PIT will assume no in-lining is taking place.

```java
finally {
  int++; int++;
}
```

This sort of pattern might not be common with integer addition, but things like string concatenation are likely to produce multiple similar instructions on the same line.

### \--timestampedReports 

By default PIT will create a date and time stamped folder for its output each time it is run. This can can make automation difficult, so the behaviour can be suppressed by passing `--timestampedReports=false`.

### \--mutationThreshold

Mutation score threshold below which the build will fail. This is a percentage (0-100) that represents the fraction of killed mutations out of all mutations.

When `--thresholdPrecision` is set to a value greater than 0, decimal values are supported (e.g. `61.5`). With the default precision of 0, only integer values are used.

Please bear in mind that your build may contain equivalent mutations. Careful thought must therefore be given when selecting a threshold.

### \--coverageThreshold

Line coverage threshold below which the build will fail. This is a percentage (0-100) that represents the fraction of the project covered by the tests.

When `--thresholdPrecision` is set to a value greater than 0, decimal values are supported (e.g. `85.5`). With the default precision of 0, only integer values are used.

### \--testStrengthThreshold

Test strength score threshold below which the build will fail. This is a percentage (0-100) that represents the test strength (killed / (killed + survived), excluding mutants where no coverage information is available).

When `--thresholdPrecision` is set to a value greater than 0, decimal values are supported. With the default precision of 0, only integer values are used.

### The integer threshold blind spot

The `--coverageThreshold`, `--mutationThreshold`, and `--testStrengthThreshold` parameters default to integer percentages. This creates a blind spot where coverage can silently regress without triggering a build failure.

Consider a project with 10,000 lines and 6,147 covered (line coverage **61.47%**). With `--coverageThreshold=61`, the score rounds to 61 and the build passes. But small changes produce surprising results:

```
(i.)   Lose 97 covered lines (6,147 -> 6,050):
       actual = 60.50%  ->  rounds to 61%  ->  build PASSES
       A silent regression of nearly 100 lines.

(ii.)  Add 163 untested lines:
       actual = 60.50%  ->  rounds to 61%  ->  build PASSES
       163 lines with no tests, no problem.

(iii.) Add 164 untested lines:
       actual = 60.49%  ->  rounds to 60%  ->  build FAILS
       Just 1 line difference from the scenario above.

(iv.)  Add 50 covered lines (6,147 -> 6,197):
       actual = 61.97%  ->  rounds to 62%  ->  jumps a whole percent
       A single percentage point jump for 50 lines.
```

With integer thresholds, the blind spot is approximately **1 full percentage point**. In a project with 10,000 lines, that means up to ~100 lines of coverage can silently drift without the threshold noticing.

The `--thresholdPrecision` parameter solves this problem.

### \--thresholdPrecision

Number of decimal places to use when computing and comparing threshold values for `--mutationThreshold`, `--coverageThreshold`, and `--testStrengthThreshold`.

Defaults to 0 (integer percentages, fully backward compatible).

Setting this to a higher value enables finer-grained threshold enforcement. With `--thresholdPrecision=1`, the project above would report coverage as `61.4` instead of `61`, and a threshold of `61.5` would correctly catch a drop to `61.1`.

### \--historyInputLocation

Path to a file containing history information for incremental analysis.

### \--historyOutputLocation

Path to write history information for incremental analysis. May be the same as historyInputLocation.


## Examples

### Mutate all classes in package example.foo (and sub packages) in two threads potentially using any test on class path but do not mutate hashCode or equals methods

```
java -cp <your classpath> \
     org.pitest.mutationtest.commandline.MutationCoverageReport \
    --reportDir c:\\mutationReports \
    --targetClasses example.foo.* \
    --sourceDirs c:\\myProject\\src \
    --targetTests example.foo*
    --threads 2
    --excludedMethods hashCode,equals
```

### Mutate the classes example.foo.Specific and example.foo.Other using tests from the Suite example.ReflectionSuite that directly call the mutees

```
java -cp <your classpath> \
     org.pitest.mutationtest.commandline.MutationCoverageReport \
    --reportDir c:\\mutationReports \
    --targetClasses example.foo.Specfic, example.foo.Other \
    --targetTests example.ReflectionSuite
    --sourceDirs c:\\myProject\\src \
```    
