---
title: Test Aggregation Across Modules
layout: default
permalink: /aggregating_tests_across_modules/
---

# Test Aggregation Across Modules

It is not uncommon to organize code into a single build with multiple modules. But PIT Test is not aware of the interconnection of these different modules
at runtime, and therefore will not generate a single report across all of the submodules of your system.

## Writing a custom aggregation tool

The PIT Test tool comes with a module called pitest-aggregator. This package has a class called `org.pitest.aggregate.ReportAggregator.Builder`. 
This class can be used to programmatically build up an aggregation of reports to output a single report across the total system.

```java
ReportAggregator.Builder raBuilder = ReportAggregator.builder();

for (Module module : projectModules) {
    raBuilder.addMutationResultsFile(module.getMutationResultsFile())
             .addLineCoverageFile(module.getLineCoverageFile())
             .addSourceCodeDirectory(module.getSourceDirectory())
             .addCompiledCodeDirectory(module.getBinaryDirectory());
}
raBuilder.resultOutputStrategy(new DirectoryResultOutputStrategy( ... ));
raBuilder.build().aggregateReport();
```

As you'll notice from the code above, the report aggregation relies on both the Mutation Results and Line Coverage XML files being available. This means 
the individual module reports will have to also produce these files.
    
## Using the Maven Plugin

If you are already using maven, it is possible to use the `PitAggregationMojo` to produce an aggregated report. This Mojo was developed following the 
patterns used by the Surefire plugin's report aggregation tool. The aggregated report is put together in two steps.

### Building the Module Reports

First, you will need to add a report for each of the modules of interest. The following would be placed in the POM file for each of the modules you're
wish to aggregate.

```xml
<build>
  ...
  <plugins>
    <plugin>
      <groupId>org.pitest</groupId>
      <artifactId>pitest-maven</artifactId>
      <version>1.3.2</version>
      <configuration>
        <!-- all interesting configuration options -->
        ...
        <!-- options required for report aggregation -->
        <exportLineCoverage>true</exportLineCoverage>
        <outputFormats><value>XML</value></outputFormats>
      </configuration>
      <executions>
        <execution>
          <id>run-mutation-tests</id>
          <goals>
            <goal>mutationCoverage</goal>
          </goals>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

The above configuration will run the mutation tests and generate the Line Coverage and Mutation Results XML files for each of your projects.

### Aggregating the Reports

Then you will create another module for your report aggregation. In the POM file for this module, you will include the use of the `report-aggregate` goal. This module will also require you to list your individual report modules as dependencies.

```xml
...
<dependencies>
  <dependency>
    <groupId>${project.groupId}</groupId>
    <artifactId>module_1</artifactId>
    <version>${project.version}</version>
  </dependency>
  <dependency>
    <groupId>${project.groupId}</groupId>
    <artifactId>module_2</artifactId>
    <version>${project.version}</version>
  </dependency>
</dependencies>
<build>
  ...
  <plugins>
    <plugin>
      <groupId>org.pitest</groupId>
      <artifactId>pitest-maven</artifactId>
      <version>1.3.2</version>
      <executions>
        <execution>
          <id>put-it-together</id>
          <goals>
            <goal>report-aggregate</goal>
          </goals>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

In the target directory of this module you will the results of the aggregated report.

### Simple Example

Let's say there is a project with the following sub-modules in Maven:

    org.dsp:digital-signal-processing:0.9-SNAPSHOT
      |
      |________ window-calculator
      |
      |________ fft-calculator
      
PIT would be added to the two sub-modules (window-calculator and fft-calculator). In the configuration for `pitest-maven` for each of these sub-modules, the `exportLineCoverage` should be `true`, and the `outputFormat` should *at least include* `XML`.

Then an additional sub-module would be included (eg: `mutation-test-report`). So the new project structure looks like this:

    org.dsp:digital-signal-processing:0.9-SNAPSHOT
      |
      |________ window-calculator
      |
      |________ fft-calculator
      |
      |________ mutation-test-report

In this new sub-module, there would be some section of the pom file which looks like this:

```xml
<dependencies>
  <dependency>
    <groupId>org.dsp</groupId>
    <artifactId>window-calculator</artifactId>
    <version>0.9-SNAPSHOT</version>
  </dependency>
  <dependency>
    <groupId>org.dsp</groupId>
    <artifactId>fft-calculator</artifactId>
    <version>0.9-SNAPSHOT</version>
  </dependency>
</dependencies>
<build>
  <plugins>
    <plugin>
      <groupId>org.pitest</groupId>
      <artifactId>pitest-maven</artifactId>
      <version>1.3.2</version>
      <executions>
        <execution>
          <id>put-it-together</id>
          <goals>
            <goal>report-aggregate</goal>
          </goals>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```
