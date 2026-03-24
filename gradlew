#!/usr/bin/env sh
# Gradle wrapper script for Unix
GRADLE_APP_HOME="$(cd "$(dirname "$0")" && pwd)"
DEFAULT_JVM_OPTS='"-Xmx64m" "-Xms64m"'
APP_NAME="Gradle"
APP_BASE_NAME=$(basename "$0")
GRADLE_WRAPPER_JAR="$GRADLE_APP_HOME/gradle/wrapper/gradle-wrapper.jar"
CLASSPATH=$GRADLE_WRAPPER_JAR
JAVACMD=${JAVA_HOME:+$JAVA_HOME/bin/}java
exec "$JAVACMD" $DEFAULT_JVM_OPTS $JAVA_OPTS $GRADLE_OPTS \
    "-Dorg.gradle.appname=$APP_BASE_NAME" \
    -classpath "$CLASSPATH" \
    org.gradle.wrapper.GradleWrapperMain \
    "$@"
