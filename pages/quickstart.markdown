---
title: Quickstart
layout: default
permalink: /quickstart/
---

# Quickstart

Out of the box Pitest can be launched from the command line, ant or maven. Third party
components provide integration with Gradle, Eclipse, IntelliJ and others (see the [links](/links "links") section for details).

The impatient can jump straight to the section for their chosen build tool - it may however be helpful to read the basic concepts section first. Mutation tests - like other quality measures - are associated with costs: The cost of execution time (CPU) for projects with Pitest are noticeably higher than without. Depending on the size of the project, the number of tests and the hardware you are using, mutation testing can take seconds, minutes or even hours. Aside from basic testing or ongoing reviews using the \*scm goals, it's always a good idea to run Pitest as part of your CI build.

## Getting started

[Maven quick start](/quickstart/maven "Maven quick start")

[Command line quick start](/quickstart/commandline "Command line quick start")

[Ant quick start](/quickstart/ant "Ant quick start")

[Gradle quick start (external link)](http://gradle-pitest-plugin.solidsoft.info/)

## More detail

[Basic concepts](/quickstart/basic_concepts "Basic concepts")

[Available mutation operations](/quickstart/mutators "Available mutation operations")

[Incremental analysis](/quickstart/incremental_analysis "Incremental analysis")

[Advanced](/quickstart/advanced "Advanced usage") 

