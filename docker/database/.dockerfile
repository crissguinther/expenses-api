FROM postgres:9.6
ENV POSTGRES_DB=postgres
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=root
EXPOSE 5432:5432
VOLUME [ "/var/lib/postgresql/data" ]