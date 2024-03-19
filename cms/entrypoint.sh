#!/bin/bash
set -e

case "${NODE_ENV}" in
    development)
        [[ -n $IMPORT_STRAPI_CONFIG ]] && [[ $IMPORT_STRAPI_CONFIG == "true" ]] && echo "Import config" && yarn config-sync import -y
        echo "Running Development Server"
        exec yarn dev
        ;;
    test)
        echo "Running Test"
        exec yarn test
        ;;
    production)
        [[ -n $IMPORT_STRAPI_CONFIG ]] && [[ $IMPORT_STRAPI_CONFIG == "true" ]] && echo "Import config" && yarn config-sync import -y
        echo "Running Production Server"
        exec yarn start
        ;;
    *)
        echo "Unknown NODE environment: \"${NODE_ENV}\""
esac
