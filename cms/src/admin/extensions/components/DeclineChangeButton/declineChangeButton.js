import { LinkButton, } from '@strapi/helper-plugin';
import { Cross } from '@strapi/icons';
import React from 'react';
import { useIntl } from 'react-intl';
import { getTrad } from '@strapi/plugin-i18n/admin/src/utils';
import { CheckPermissions } from '@strapi/helper-plugin';
import { permissions } from '../../permissions';

const DeclineChangeButton = ({ slug }) => {
  const { formatMessage } = useIntl();

  return (
    <CheckPermissions permissions={permissions.acceptChanges} >
      <LinkButton
        size="M"
        startIcon={<Cross />}
        style={{ width: '100%' }}
        to={`/google/${slug}`}
        variant="danger-light"
      >
        {formatMessage({
          id: getTrad('link-to-ctb'),
          defaultMessage: 'Decline changes',
        })}
      </LinkButton >
    </CheckPermissions >
  );
};

export default DeclineChangeButton;
