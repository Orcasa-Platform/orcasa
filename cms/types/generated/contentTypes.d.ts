import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    timezone: Attribute.String;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    isEntryValid: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 50;
        },
        number
      >;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAreaOfInterventionAreaOfIntervention
  extends Schema.CollectionType {
  collectionName: 'area_of_interventions';
  info: {
    singularName: 'area-of-intervention';
    pluralName: 'area-of-interventions';
    displayName: 'Area of intervention';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::area-of-intervention.area-of-intervention',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::area-of-intervention.area-of-intervention',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContinentContinent extends Schema.CollectionType {
  collectionName: 'continents';
  info: {
    singularName: 'continent';
    pluralName: 'continents';
    displayName: 'Continent';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::continent.continent',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::continent.continent',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCountryCountry extends Schema.CollectionType {
  collectionName: 'countries';
  info: {
    singularName: 'country';
    pluralName: 'countries';
    displayName: 'Country';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    capital: Attribute.String;
    code: Attribute.Integer;
    fips: Attribute.String;
    iso_2: Attribute.String;
    iso_3: Attribute.String;
    continent: Attribute.Relation<
      'api::country.country',
      'oneToOne',
      'api::continent.continent'
    >;
    region: Attribute.Relation<
      'api::country.country',
      'oneToOne',
      'api::region.region'
    >;
    projects: Attribute.Relation<
      'api::country.country',
      'manyToMany',
      'api::project.project'
    >;
    lat: Attribute.Float;
    long: Attribute.Float;
    practices: Attribute.Relation<
      'api::country.country',
      'manyToMany',
      'api::practice.practice'
    >;
    testimonies: Attribute.Relation<
      'api::country.country',
      'oneToMany',
      'api::testimony.testimony'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::country.country',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::country.country',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHomepageRecommendationHomepageRecommendation
  extends Schema.SingleType {
  collectionName: 'homepage_recommendations';
  info: {
    singularName: 'homepage-recommendation';
    pluralName: 'homepage-recommendations';
    displayName: 'Homepage Recommendation';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    description: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 250;
      }>;
    link_text: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    link_url: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::homepage-recommendation.homepage-recommendation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::homepage-recommendation.homepage-recommendation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLandUseTypeLandUseType extends Schema.CollectionType {
  collectionName: 'land_use_types';
  info: {
    singularName: 'land-use-type';
    pluralName: 'land-use-types';
    displayName: 'Land use type';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    practices_prior: Attribute.Relation<
      'api::land-use-type.land-use-type',
      'manyToMany',
      'api::practice.practice'
    >;
    practices: Attribute.Relation<
      'api::land-use-type.land-use-type',
      'manyToMany',
      'api::practice.practice'
    >;
    projects: Attribute.Relation<
      'api::land-use-type.land-use-type',
      'manyToMany',
      'api::project.project'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::land-use-type.land-use-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::land-use-type.land-use-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLayerLayer extends Schema.CollectionType {
  collectionName: 'layers';
  info: {
    singularName: 'layer';
    pluralName: 'layers';
    displayName: 'Layer';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    type: Attribute.Enumeration<['deckgl', 'mapbox', 'carto']> &
      Attribute.Required &
      Attribute.DefaultTo<'mapbox'>;
    config: Attribute.JSON & Attribute.Required;
    params_config: Attribute.JSON;
    legend_config: Attribute.JSON & Attribute.Required;
    interaction_config: Attribute.JSON;
    source: Attribute.String;
    source_url: Attribute.String;
    description: Attribute.Text;
    license: Attribute.String;
    citation: Attribute.Text;
    cautions: Attribute.Text;
    related_publications: Attribute.Text;
    resource_contact_name: Attribute.String;
    resource_contact_url: Attribute.String;
    metadata_contact_name: Attribute.String;
    metadata_contact_url: Attribute.String;
    highlighted_bounds: Attribute.JSON;
    ui_settings: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::layer.layer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::layer.layer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLayerGroupLayerGroup extends Schema.CollectionType {
  collectionName: 'layer_groups';
  info: {
    singularName: 'layer-group';
    pluralName: 'layer-groups';
    displayName: 'Layer group';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    layers: Attribute.Relation<
      'api::layer-group.layer-group',
      'oneToMany',
      'api::layer.layer'
    >;
    order: Attribute.Integer;
    description: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::layer-group.layer-group',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::layer-group.layer-group',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNetworkSuggestionNetworkSuggestion
  extends Schema.SingleType {
  collectionName: 'network_suggestions';
  info: {
    singularName: 'network-suggestion';
    pluralName: 'network-suggestions';
    displayName: 'Network Suggestion';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    new_suggestion_email_recipients: Attribute.Text &
      Attribute.CustomField<
        'plugin::string-array.input',
        {
          separator: 'comma';
        }
      >;
    edit_suggestion_email_recipients: Attribute.Text &
      Attribute.CustomField<
        'plugin::string-array.input',
        {
          separator: 'comma';
        }
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::network-suggestion.network-suggestion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::network-suggestion.network-suggestion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOrganizationOrganization extends Schema.CollectionType {
  collectionName: 'organizations';
  info: {
    singularName: 'organization';
    pluralName: 'organizations';
    displayName: 'Organization';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        maxLength: 150;
      }>;
    organization_type: Attribute.Relation<
      'api::organization.organization',
      'oneToOne',
      'api::organization-type.organization-type'
    > &
      Attribute.Required;
    organization_type_other: Attribute.String;
    main_organization_theme: Attribute.Relation<
      'api::organization.organization',
      'oneToOne',
      'api::organization-theme.organization-theme'
    > &
      Attribute.Required;
    secondary_organization_theme: Attribute.Relation<
      'api::organization.organization',
      'oneToOne',
      'api::organization-theme.organization-theme'
    >;
    short_description: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 350;
      }>;
    description: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'custom2';
        }
      >;
    country: Attribute.Relation<
      'api::organization.organization',
      'oneToOne',
      'api::country.country'
    > &
      Attribute.Required;
    url: Attribute.String & Attribute.Required;
    lead_projects: Attribute.Relation<
      'api::organization.organization',
      'oneToMany',
      'api::project.project'
    >;
    partner_projects: Attribute.Relation<
      'api::organization.organization',
      'manyToMany',
      'api::project.project'
    >;
    funded_projects: Attribute.Relation<
      'api::organization.organization',
      'manyToMany',
      'api::project.project'
    >;
    publication_status: Attribute.Enumeration<
      ['proposed', 'accepted', 'declined']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'accepted'>;
    user_email: Attribute.Email;
    practices: Attribute.Relation<
      'api::organization.organization',
      'manyToMany',
      'api::practice.practice'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::organization.organization',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::organization.organization',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOrganizationThemeOrganizationTheme
  extends Schema.CollectionType {
  collectionName: 'organization_themes';
  info: {
    singularName: 'organization-theme';
    pluralName: 'organization-themes';
    displayName: 'Organization theme';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    order: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::organization-theme.organization-theme',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::organization-theme.organization-theme',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOrganizationTypeOrganizationType
  extends Schema.CollectionType {
  collectionName: 'organization_types';
  info: {
    singularName: 'organization-type';
    pluralName: 'organization-types';
    displayName: 'Organization type';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    order: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::organization-type.organization-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::organization-type.organization-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPagePage extends Schema.CollectionType {
  collectionName: 'pages';
  info: {
    singularName: 'page';
    pluralName: 'pages';
    displayName: 'Page';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    default_basemap: Attribute.Enumeration<
      ['basemap-satellite', 'basemap-light']
    >;
    layer_groups: Attribute.Relation<
      'api::page.page',
      'oneToMany',
      'api::layer-group.layer-group'
    >;
    slug: Attribute.String;
    color: Attribute.String;
    external_url: Attribute.String;
    intro: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'custom';
        }
      >;
    default_labels: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    default_boundaries: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::page.page', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::page.page', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiPracticePractice extends Schema.CollectionType {
  collectionName: 'practices';
  info: {
    singularName: 'practice';
    pluralName: 'practices';
    displayName: 'Practice';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    source_name: Attribute.Enumeration<['WOCAT', 'FAO']> & Attribute.Required;
    source_id: Attribute.String & Attribute.Required;
    title: Attribute.Text;
    short_description: Attribute.Text;
    countries: Attribute.Relation<
      'api::practice.practice',
      'manyToMany',
      'api::country.country'
    >;
    detailed_description: Attribute.Text;
    project_fund: Attribute.Text;
    institution_funding: Attribute.Text;
    state_province: Attribute.Text;
    further_location: Attribute.Text;
    map_location: Attribute.Text;
    implem_date: Attribute.Text;
    publication_date: Attribute.Date;
    implem_decade: Attribute.Text;
    main_purposes: Attribute.Text;
    has_changed: Attribute.Boolean;
    land_use_has_changed: Attribute.Text &
      Attribute.CustomField<
        'plugin::string-array.input',
        {
          separator: 'semicolon';
        }
      >;
    degradation_assessed: Attribute.Text &
      Attribute.CustomField<
        'plugin::string-array.input',
        {
          separator: 'semicolon';
        }
      >;
    language: Attribute.Text &
      Attribute.CustomField<
        'plugin::string-array.input',
        {
          separator: 'semicolon';
        }
      >;
    land_use_types: Attribute.Relation<
      'api::practice.practice',
      'manyToMany',
      'api::land-use-type.land-use-type'
    >;
    sync: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    practice_url: Attribute.Text;
    land_use_priors: Attribute.Relation<
      'api::practice.practice',
      'manyToMany',
      'api::land-use-type.land-use-type'
    >;
    subinterventions: Attribute.Relation<
      'api::practice.practice',
      'manyToMany',
      'api::subintervention.subintervention'
    >;
    practice_intervention: Attribute.Enumeration<
      ['Management', 'Land Use Change', 'None']
    > &
      Attribute.Required;
    projects: Attribute.Relation<
      'api::practice.practice',
      'manyToMany',
      'api::project.project'
    >;
    organizations: Attribute.Relation<
      'api::practice.practice',
      'manyToMany',
      'api::organization.organization'
    >;
    reviewed: Attribute.Boolean & Attribute.DefaultTo<false>;
    review_comments: Attribute.Text & Attribute.Private;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::practice.practice',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::practice.practice',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPracticeImportPracticeImport extends Schema.CollectionType {
  collectionName: 'practice_imports';
  info: {
    singularName: 'practice-import';
    pluralName: 'practice-imports';
    displayName: 'Practice Import';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    start: Attribute.DateTime & Attribute.Required;
    finished: Attribute.DateTime;
    status: Attribute.Enumeration<['started', 'finished', 'error']>;
    output: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::practice-import.practice-import',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::practice-import.practice-import',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProjectProject extends Schema.CollectionType {
  collectionName: 'projects';
  info: {
    singularName: 'project';
    pluralName: 'projects';
    displayName: 'Project';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    project_type: Attribute.Relation<
      'api::project.project',
      'oneToOne',
      'api::project-type.project-type'
    > &
      Attribute.Required;
    start_date: Attribute.Date & Attribute.Required;
    end_date: Attribute.Date;
    short_description: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    country_of_coordination: Attribute.Relation<
      'api::project.project',
      'oneToOne',
      'api::country.country'
    > &
      Attribute.Required;
    region_of_interventions: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::region.region'
    >;
    country_of_interventions: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::country.country'
    >;
    website: Attribute.String & Attribute.Required;
    project_coordinator_email: Attribute.String;
    main_area_of_intervention: Attribute.Relation<
      'api::project.project',
      'oneToOne',
      'api::area-of-intervention.area-of-intervention'
    >;
    main_area_of_intervention_other: Attribute.String;
    secondary_area_of_intervention: Attribute.Relation<
      'api::project.project',
      'oneToOne',
      'api::area-of-intervention.area-of-intervention'
    >;
    third_area_of_intervention: Attribute.Relation<
      'api::project.project',
      'oneToOne',
      'api::area-of-intervention.area-of-intervention'
    >;
    sustainable_development_goals: Attribute.Relation<
      'api::project.project',
      'oneToMany',
      'api::sustainable-dev-goal.sustainable-dev-goal'
    >;
    lead_partner: Attribute.Relation<
      'api::project.project',
      'manyToOne',
      'api::organization.organization'
    > &
      Attribute.Required;
    partners: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::organization.organization'
    >;
    funders: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::organization.organization'
    >;
    publication_status: Attribute.Enumeration<
      ['proposed', 'accepted', 'declined']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'accepted'>;
    land_use_types: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::land-use-type.land-use-type'
    >;
    description: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'custom2';
        }
      >;
    practices: Attribute.Relation<
      'api::project.project',
      'manyToMany',
      'api::practice.practice'
    >;
    project_coordinator_website: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::project.project',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::project.project',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProjectTypeProjectType extends Schema.CollectionType {
  collectionName: 'project_types';
  info: {
    singularName: 'project-type';
    pluralName: 'project-types';
    displayName: 'Project Type';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    description: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::project-type.project-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::project-type.project-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRegionRegion extends Schema.CollectionType {
  collectionName: 'regions';
  info: {
    singularName: 'region';
    pluralName: 'regions';
    displayName: 'Region';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    projects: Attribute.Relation<
      'api::region.region',
      'manyToMany',
      'api::project.project'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::region.region',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::region.region',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStaticPageStaticPage extends Schema.CollectionType {
  collectionName: 'static_pages';
  info: {
    singularName: 'static-page';
    pluralName: 'static-pages';
    displayName: 'Static page';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.String & Attribute.Required & Attribute.Unique;
    content: Attribute.RichText & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::static-page.static-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::static-page.static-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSubinterventionSubintervention
  extends Schema.CollectionType {
  collectionName: 'subinterventions';
  info: {
    singularName: 'subintervention';
    pluralName: 'subinterventions';
    displayName: 'Land management practices';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.String & Attribute.Required & Attribute.Unique;
    practices: Attribute.Relation<
      'api::subintervention.subintervention',
      'manyToMany',
      'api::practice.practice'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::subintervention.subintervention',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::subintervention.subintervention',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSustainableDevGoalSustainableDevGoal
  extends Schema.CollectionType {
  collectionName: 'sustainable_dev_goals';
  info: {
    singularName: 'sustainable-dev-goal';
    pluralName: 'sustainable-dev-goals';
    displayName: 'Sustainable development goal';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    projects: Attribute.Relation<
      'api::sustainable-dev-goal.sustainable-dev-goal',
      'oneToMany',
      'api::project.project'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sustainable-dev-goal.sustainable-dev-goal',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sustainable-dev-goal.sustainable-dev-goal',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTestimonyTestimony extends Schema.CollectionType {
  collectionName: 'testimonies';
  info: {
    singularName: 'testimony';
    pluralName: 'testimonies';
    displayName: 'Testimony';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    country: Attribute.Relation<
      'api::testimony.testimony',
      'manyToOne',
      'api::country.country'
    > &
      Attribute.Required;
    content: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'testimonies';
          maxLengthCharacters: 550;
        }
      >;
    role: Attribute.String & Attribute.Required;
    icon: Attribute.Enumeration<
      ['microscope', 'scale', 'landmark', 'factory', 'heart handshake']
    > &
      Attribute.Required;
    order: Attribute.Integer & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::testimony.testimony',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::testimony.testimony',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::area-of-intervention.area-of-intervention': ApiAreaOfInterventionAreaOfIntervention;
      'api::continent.continent': ApiContinentContinent;
      'api::country.country': ApiCountryCountry;
      'api::homepage-recommendation.homepage-recommendation': ApiHomepageRecommendationHomepageRecommendation;
      'api::land-use-type.land-use-type': ApiLandUseTypeLandUseType;
      'api::layer.layer': ApiLayerLayer;
      'api::layer-group.layer-group': ApiLayerGroupLayerGroup;
      'api::network-suggestion.network-suggestion': ApiNetworkSuggestionNetworkSuggestion;
      'api::organization.organization': ApiOrganizationOrganization;
      'api::organization-theme.organization-theme': ApiOrganizationThemeOrganizationTheme;
      'api::organization-type.organization-type': ApiOrganizationTypeOrganizationType;
      'api::page.page': ApiPagePage;
      'api::practice.practice': ApiPracticePractice;
      'api::practice-import.practice-import': ApiPracticeImportPracticeImport;
      'api::project.project': ApiProjectProject;
      'api::project-type.project-type': ApiProjectTypeProjectType;
      'api::region.region': ApiRegionRegion;
      'api::static-page.static-page': ApiStaticPageStaticPage;
      'api::subintervention.subintervention': ApiSubinterventionSubintervention;
      'api::sustainable-dev-goal.sustainable-dev-goal': ApiSustainableDevGoalSustainableDevGoal;
      'api::testimony.testimony': ApiTestimonyTestimony;
    }
  }
}
