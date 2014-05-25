---
title: Roadmap
layout: default
permalink: /roadmap/
---

# Roadmap

Well, not so much as roadmap as a set of hazy directions received from an untrustworthy
stranger and hastly scribbled down on the back of an envelope.

Generally speaking defect fixes will be given priority above things in the lists below. Releases will be pushed out following any major defect fixes, or
when a reasonable number of interesting new features have been implemented.

## Coming soon

1. ~~Write results and coverage info to a relational database or other structured format~~
2. Prioritise tests that killed mutations in previous runs (depends on 1)
3. ~~Split mutation analysis into seperate analyse and report steps (depends on 1)~~ Not entirely neccessary as it turns out
4. ~~Use hashing of classes combined with stored history to avoid re-running analysis we already know the results of (aka incremental mutation testing)~~ **included in 0.29 release**
5. ~~Alternate output formats~~ **xml and csv support included in 0.24 release**
6. Further integration with source control

## Coming at some point

1. ~~Ant task (probably dependent on point 3 above)~~ Ant supported since 0.26 
2. ~~Sonar plugin - see [issue 8](http://code.google.com/p/pitestrunner/issues/detail?id=8)~~ Sonar plugin contributed by Alexandre Victoor see [sonar plugin](http://docs.codehaus.org/display/SONAR/Pitest)
3. ~~An eclipse plugin~~ Development begun by Phil Glover see [pitclipse](https://github.com/philglover/pitclipse)
4. Webapp or GUI for browsing results and marking equivalent mutants (dependent on 1 of coming soon) [&asymp; help?](/how_to_help/)
5. New / improved mutation operators based on [mutation of java objects](http://www.cs.colostate.edu/~bieman/Pubs/AlexanderBiemanGhoshJiISSRE02.pdf) [&asymp; help?](/how_to_help/)
6. ~~Confirm PIT works with all major mocking frameworks (already done as part of build for Mockito, JMock and Powermock)~~ **0.24 release added support for JMockit meaning all the major frameworks are now covered**
7. ~~Detect and avoid assert statements~~ **released in 0.27**
8. Improved maven multi-project support - see [issue 6](http://code.google.com/p/pitestrunner/issues/detail?id=6) [&asymp; help?](/how_to_help/)
9. Other mutation operators - ~~switch statements~~, enums, parameter swapping, removal of super calls . . . other things [&asymp; help?](/how_to_help/)
10. Better documentation [&asymp; help?](/how_to_help/)
11. Pretty graphs and things in the html report (dependant on 3 and cleaning up the current mess that generates the html report) [&asymp; help?](/how_to_help/)
12. TestNG support. ~~It would be preferable not to rush into adding this until a decision has been made on distributed testing.~~ **Distrubuted testing code removed in 0.24 release. TestNG added in 0.25**

## Maybe

1. Distributed testing. *Early versions of PIT had working support for this using hazelcast. It had some minor issues, but was made inaccessible in favour of getting the basics
right. ~~The code is still there, but has not been maintained as other things have moved on. It adds a great deal of complexity to the codebase and a decision
will need to be made at some point on whether it should be ressurected or removed entirely in order to simplify things.~~ Original distributed code has been removed, when distribution is looked at again will probably be implemented via different strategy.*

2. Some form of equivalent mutation detection. *Not sure what approach would be taken, but there's plenty of accademic reasearch in this area to draw on. Perhaps something fine grained
that takes into account the type of the mutation operator.*

3. Mutation operators for concurrency based on [mutation operators for concurrent java](http://www.cs.queensu.ca/~cordy/Papers/BCD_ConcOps_Mutation06.pdf) [&asymp; help?](/how_to_help/)

4. Annotations to mark code not to be mutated. *Possibly quite useful, but conceptutally polluting your production code with a testing concern is wrong.*

5. More intelligent block based coverage. *The line coverage implementation currently used by PIT is fairly basic, and could be improved in terms of both performance and the information it gathers. A block based approach would potentially allow PIT to target tests more
narrowly in some circumstances and also report partial line coverage. One obvious way to achieve this would be to use
a third party implementation such as JaCoCo (it would help if JaCoCo was available from maven central).*

## Shameful things

There are a number of things within the code base that while functional and defect free are embarassing, dirty or just plain wrong. These need to be polished, refactored, or re-written alongside the other work.

