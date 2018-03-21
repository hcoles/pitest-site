---
title: Weak tests
layout: default
permalink: /weak_tests/
---

# Weak tests

It's easy to see how a test with no assertions can generate full branch coverage without meaningfully testing
the code it executes. It is also easy to understand how uses tests are written due to human error - eg programmers used to a mocking framework that does not distinguish between stubbing and verification forgetting to write verification steps when switching to one that does.

It can be less obvious how superficially good tests can fully execute code without fully testing it. The simple explanation is that the suite has **missing test cases**.

Some common types of missing test are shown below. This list is by no means exhaustive, but shows patterns of missed tests that I have seen across multiple code bases.

In most cases the tests that have been written are sufficient to generate 100% branch coverage, but the code can be mutated such that it's functionality is changed but all tests still pass.


## The untested side effect

```java
public static String foo(boolean b) {
  if ( b ) {
    performVitallyImportantBusinessFunction();
    return "OK";
  }

  return "FAIL";
}

@Test
public void shouldFailWhenGivenFalse() {
  assertEquals("FAIL", foo(false));
}

@Test
public void shouldBeOkWhenGivenTrue() {
  assertEquals("OK", foo(true));
}
```

*No check is ever made that performVitallyImportantBusinessFunction is called.*

## The missing boundary test

```java
public static String foo(int i) {
  if ( i >= 0 ) {
      return "foo";
  } else {
      return "bar";
  }
}

@Test
public void shouldReturnFooWhenGiven1() {
  assertEquals("foo", foo(1));
}

@Test
public void shouldReturnBarWhenGivenMinus1() {
  assertEquals("bar", foo(-1));
}
```

*The behaviour when i == 0 is never tested.*

## The myopic mockist

```java
public static String foo(Collaborator c, boolean b) {
  if ( b ) {
      return c.performAction();
  }

  return "FOO";
}

@Test
public void shouldPerformActionWhenGivenTrue() {
  foo(mockCollaborator,true);
  verify(mockCollaborator).performAction();
}

@Test
public void shouldNotPerformActionWhenGivenFalse() {
  foo(mockCollaborator,false);
  verify(never(),mockCollaborator).performAction();
}
```

*The return value of the function is never checked.*

