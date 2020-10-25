FROM openjdk:15-jdk-alpine

USER root
# Add a jhipster user to run our application so that it doesn't need to run as root
WORKDIR /opt/artemis

ADD ../entrypoint.sh entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 8080

RUN chmod 775 entrypoint.sh
RUN apk update
RUN apk add graphviz
RUN apk add fontconfig

USER artemis
ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    JHIPSTER_SLEEP=0 \
    JAVA_OPTS=""
ADD *.war app.war
