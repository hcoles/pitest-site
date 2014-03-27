---
title: Incremental analysis
description: Incremental mutation analysis with PIT
tags: quickstart, guide
keywords: mutation testing
---

# Incremental anlaysis

PIT contains an experimental feature to enable its use on very large codebases - incremental analysis.

If this option is activated, PIT will track changes to the code and tests and store the results from previous runs. It will then use this information to avoid re-running analysis when the results can be logically inferred.

A number of optimisations are possible.

1) If an infinite loop was detected in the last run, and the class has not changed then it can be assumed that this mutation still results in an infinite loop.
2) If a mutation was killed in the last run and neither the class under test or the killing test has changed, then it can be assumed that this mutation is still killed.
3) If a mutation survived in the last run, no new tests cover it, and none of the covering tests have changed, then it must still survive.
4) *If a mutation was previously killed, but the class or killing test has changed then it is likely that the last killing test will still kill it and it should therefore be prioritised above others. (not yet implemented)*
5) *If a number of mutations for a class previously survived, but the class has changed then it is likely that these mutations will still survive. If they are enabled simultaneously and can not be killed as a single meta mutant then the mutations need not be analysed individually. (not yet implemented)*

With the exception of 4), all these optimisations introduce a degree of potential error into the analysis.

The main issue is that class behaviour is defined not only by its bytecode, but also by its dependencies (i.e the classes it interacts with and the graph of classes that they interact with). PIT will only consider the strongest of these dependencies - changes to super classes and outer classes, when deciding if a class's behaviour might have changed.

So the incremental feature is based on the assumption that it will be relatively rare for changes in the dependencies of a class to change the status of a mutation. Although this assumption seems reasonable, it is currently **unproven**.

Optimisation 5) carries the additonal risk that the mutations within the meta mutant might cancel each other out, leaving the behaviour of the class unchanged. Again it seems likely that this would be rare but this has not been quanitified.

Incremental analysis is currently controlled by two parameters

**historyInputLocation**

**historyOutputLocation**

or for maven

**historyInputFile**

**historyOutputFile**


These point to the locations from which to read and write mutation analysis results. This can be the same location. If diferent locations are used
you will need to implement some mechanism to swap the values between runs as PIT does itself does not currently provide a mechanism.



