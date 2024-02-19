module.exports = ({ env }) => ({
  "string-array": {
    enabled: true,
  },
  orcasa: {
    enabled: true,
    resolve: "./src/plugins/orcasa",
  },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST"),
        port: env("SMTP_PORT"),
        secure: true,
        auth: {
          user: env("SMTP_USER"),
          pass: env("SMTP_PASSWORD"),
        },
      },
      settings: {
        defaultFrom: env("SMTP_FROM"),
        defaultReplyTo: env("SMTP_REPLY_TO"),
      },
    },
  },
  "config-sync": {
    enabled: true,
    config: {
      excludedConfig: [
        "core-store.plugin_users-permissions_grant",
        "core-store.plugin_upload_metrics",
        "core-store.strapi_content_types_schema",
        "core-store.ee_information",
        "core-store.plugin_users-permissions_email",
        "core-store.plugin_users-permissions_advanced",
      ],
    },
  },
  documentation: {
    config: {
      "x-strapi-config": {
        mutateDocumentation: (generatedDocumentationDraft) => {
          Object.keys(generatedDocumentationDraft.paths).forEach((path) => {
            // mutate `fields` to string array
            if (generatedDocumentationDraft.paths[path].get?.parameters) {
              const fields = generatedDocumentationDraft.paths[
                path
              ].get.parameters.find((param) => param.name === "fields");

              if (fields) {
                const fieldsIndex = generatedDocumentationDraft.paths[
                  path
                ].get.parameters.findIndex((param) => param.name === "fields");
                generatedDocumentationDraft.paths[path].get.parameters[
                  fieldsIndex
                ] = {
                  name: "fields",
                  in: "query",
                  description:
                    "Fields to return (ex: ['title','author','test'])",
                  deprecated: false,
                  required: false,
                  schema: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                };
              }
            }

            // mutate `populate` to one of string | object
            if (generatedDocumentationDraft.paths[path].get?.parameters) {
              const populate = generatedDocumentationDraft.paths[
                path
              ].get.parameters.find((param) => param.name === "populate");

              if (populate) {
                const populateIndex = generatedDocumentationDraft.paths[
                  path
                ].get.parameters.findIndex(
                  (param) => param.name === "populate"
                );
                generatedDocumentationDraft.paths[path].get.parameters[
                  populateIndex
                ] = {
                  name: "populate",
                  in: "query",
                  description: "Relations to return",
                  deprecated: false,
                  required: false,
                  schema: {
                    oneOf: [
                      {
                        type: "string",
                      },
                      {
                        type: "object",
                      },
                    ],
                  },
                };
              }
            }
            // check if it has {id} in the path
            if (path.includes("{id}")) {
              // add `populate` as params
              if (generatedDocumentationDraft.paths[path].get) {
                if (
                  !generatedDocumentationDraft.paths[path].get.parameters.find(
                    (param) => param.name === "populate"
                  )
                ) {
                  generatedDocumentationDraft.paths[path].get.parameters.push({
                    name: "populate",
                    in: "query",
                    description: "Relations to return",
                    deprecated: false,
                    required: false,
                    schema: {
                      type: "string",
                    },
                  });
                }
              }
            }
          });
        },
      },
    },
  },
});
