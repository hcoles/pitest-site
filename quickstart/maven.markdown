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
[jcenter](https://bintray.com/hcoles/maven/org.pitest%3Apitest-maven/view) since version 0.20.

## Getting started

Add the plugin to build/plugins in your pom.xml

<pre class="prettyprint lang-xml">
&lt;plugin&gt;
    &lt;groupId&gt;org.pitest&lt;/groupId&gt;
    &lt;artifactId&gt;pitest-maven&lt;/artifactId&gt;
    &lt;version&gt;LATEST&lt;/version&gt;
 &lt;/plugin&gt;
</pre>

**That's it, you're up and running.**

By default pitest will mutate all code in your project. You can limit which code is mutated and which tests are run using `targetClasses` and `targetTests`.

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

If no `targetClasses` are provided in versions before 1.11.12-SNAPSHOT pitest assumes that your classes live in a package matching your projects group id. In versions after 1.11.12 pitest will scan your project to determine which classes are present.

PIT provides two goals

### mutationCoverage goal

The mutation coverage goal analyses all classes in the codebase that match the target tests and target classes filters.

It can be run directly from the commandline

<pre class="prettyprint lang-bash">
mvn org.pitest:pitest-maven:mutationCoverage
</pre>

This will output an html report to **target/pit-reports/YYYYMMDDHHMI**.

To speed-up repeated analysis of the same codebase set the `withHistory` parameter to true.

<pre class="prettyprint lang-bash">
mvn -DwithHistory org.pitest:pitest-maven:mutationCoverage
</pre>

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

If no targetClasses are supplied pitest will automatically determine what to mutate. 

Before 1.11.12 pitest assumed that all code lives in a package matching the maven group id. After 1.11.12 the classes to mutate are determined by scanning the maven output directory.

### targetTests

A list of globs can be supplied to this parameter to limit the tests available to be run.

This parameter can be used to point PIT to a top level suite or suites. Custom suites such as [ClassPathSuite](http://johanneslink.net/projects/cpsuite.jsp) 
are supported. Tests found via these suites can also be limited by the distance filter (see below).

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

List of globs to match against class names. Matching classes will be excluded from mutation. 

Prior to 1.3.0 matching test classes were also not run. From 1.3.0 onwards tests are excluded with the excludedTests parameter

### excludedTestClasses

List of globs to match against test class names. Matching tests will not be run (note if a suite includes an
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

Defaults to 0 (unlimited)

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

### testPlugin

The test framework to use. Support values are

* junit (default) - runs junit 3 and 4 tests
* testng - runs TestNG tests

Support for other test frameoworks such as junit5 can be added via plugins.

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

### withHistory

Sets the history input and output files to point a project specific file within the temp directory.

This is a convenient way of using history files to speed up local analysis.

### skip

You can skip the launch by adding the parameter ``skip`` on ``configuration`` section:

<pre class="prettyprint lang-xml">
&lt;configuration&gt;
    &lt;skip&gt;true&lt;/skip&gt;
&lt;/configuration&gt;
</pre>

It's very useful on maven module: when you need to skip an entire module, you can add this setting on the declaration of the plugin to ignore it.

## Reporting Goal
### Introduction
Starting with version 1.1.6, the pit maven plugin has a maven report goal.  This goal should only be invoked as part of the maven site lifecycle.  To execute this goal, the ``mutationCoverage`` goal must have already been executed to produce an HTML report (i.e. the ``outputFormat`` parameter must have HTML in it if the parameter is specified.  The report goal then copies the latest HTML report to the site directory.  If multiple reports exist (as in the case where ``timestampedReports`` is set to true), then only the report with the latest create time is used.

To generate the pit site report, set up the pitest-maven plugin in the project's pom as explained in the Getting Started section above and the ``<reporting>`` section as explained below.  Then, execute both the ``mutationCoverage`` goal and the site lifecycle.  For example:
<pre class="prettyprint lang-xml">
mvn clean org.pitest:pitest-maven:mutationCoverage site
</pre>

### POM Configuration
The following configuration is the minimum required to generate the pit site report:
<pre class="prettyprint lang-xml">
&lt;reporting&gt;
    &lt;plugins&gt;
        &lt;plugin&gt;
            &lt;groupId&gt;org.pitest&lt;/groupId&gt;
            &lt;artifactId&gt;pitest-maven&lt;/artifactId&gt;
            &lt;version&gt;LATEST&lt;/version&gt;
            &lt;reportSets&gt;
                &lt;reportSet&gt;
                    &lt;reports&gt;
                        &lt;report&gt;report&lt;/report&gt;
                    &lt;/reports&gt;
                &lt;/reportSet&gt;
            &lt;/reportSets&gt;
        &lt;/plugin&gt;
    &lt;/plugins&gt;
&lt;/reporting&gt;
</pre>

#### Additional Parameters
Additional parameters exist to customize the generation of the report.  They are:

##### skip
* Boolean indicating if the report generation should be skipped.
* Default is ``false``
* User Property is ``${pit.report.skip}``

##### reportsDirectory
* Indicates where the ``mutationCoverage`` goal wrote the pit HTML reports.  This parameter does not need to be set unless the ``reportsDirectory`` parameter was set during the execution of the ``mutationCoverage`` goal.  The value in this parameter must be an absolute path to the directory where the pit HTML report is located.
* Default is ``${project.build.directory}/pit-reports``
* User property is ``${reportsDirectory}``

##### sourceDataFormats
* List of strings specifying what data files should be read for the generation of the site report.  Currently, the only supported value is "HTML" thus this parameter should not be used.  Future versions of the pitest-maven plugin may implement other source data formats (i.e. XML or CSV).
* Default is "HTML"
* User property is ``${pit.report.sourceDataFormats}``

##### siteReportName
* String that determines the name of the pit report that displays in the "Project Reports" section of the generated maven site.
* Default is "PIT Test Report"
* User property is ``${pit.report.name}``

##### siteReportDescription
* String that determines the "Description" of the pit report in the "Project Reports" section of the generated maven site.
* Default is "Report of the pit test coverage"
* User property is ``${pit.report.description}``

##### siteReportDirectory
* String that determines the name of the sub-directory under the directory where the maven site is written (usually target/site). 
* Default value is "pit-reports" which means the pit report will be written to ``target/site/pit-reports``
* User property is ``${pit.report.outputdir}``

##### Example Showing All Options
<pre class="prettyprint lang-xml">
&lt;reporting&gt;
    &lt;plugins&gt;
        &lt;plugin&gt;
            &lt;groupId&gt;org.pitest&lt;/groupId&gt;
            &lt;artifactId&gt;pitest-maven&lt;/artifactId&gt;
            &lt;version&gt;LATEST&lt;/version&gt;
            &lt;configuration&gt;
                &lt;skip&gt;false&lt;/skip&gt;
                &lt;reportsDirectory&gt;${project.build.directory}/pit-custom-output-dir&lt;/reportsDirectory&gt;
                &lt;sourceDataFormats&gt;
                    &lt;sourceDataFormat&gt;HTML&lt;/sourceDataFormat&gt;
                &lt;/sourceDataFormats&gt;
                &lt;siteReportName&gt;my-pit-report-name&lt;/siteReportName&gt;
                &lt;siteReportDescription&gt;my pit report custom description&lt;/siteReportDescription&gt;
                &lt;siteReportDirectory&gt;pit-custom-site-directory&lt;/siteReportDirectory&gt;
            &lt;/configuration&gt;
            &lt;reportSets&gt;
                &lt;reportSet&gt;
                    &lt;reports&gt;
                        &lt;report&gt;report&lt;/report&gt;
                    &lt;/reports&gt;
                &lt;/reportSet&gt;
            &lt;/reportSets&gt;
        &lt;/plugin&gt;
    &lt;/plugins&gt;
&lt;/reporting&gt;
</pre>
