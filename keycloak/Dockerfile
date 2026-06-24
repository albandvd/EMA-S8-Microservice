FROM quay.io/keycloak/keycloak:26.6.3

ENV KC_BOOTSTRAP_ADMIN_USERNAME=admin
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=admin
ENV KC_HOSTNAME_STRICT=false
ENV KC_IMPORT=/opt/keycloak/data/import/realm.json

COPY kc-config /opt/keycloak/data/import/realm.json

EXPOSE 8080

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]
