import { Button } from '@strapi/design-system';
import { Check } from '@strapi/icons';
import React from 'react';
import { useIntl } from 'react-intl';
import { getTrad } from '@strapi/plugin-i18n/admin/src/utils';
import { CheckPermissions } from '@strapi/helper-plugin';
import { permissions } from '../../permissions';
import { api } from '../../api';
import { useSlug } from '../../hooks/useSlug';

const AcceptChangeButton = (props) => {
  const { formatMessage } = useIntl();
  const { slug } = useSlug();

  const acceptChanges = async () => {
    try {
      const res = await api.acceptChanges({
        slug,
      });
    } catch (err) {
      //TODO: error handling
    }
  };

  return (
    <CheckPermissions permissions={acceptChanges} >
      <Button
        startIcon={<Check />}
        style={{ width: '100%' }}
        variant="secondary"
        onClick={api.acceptChanges}
      >
        {formatMessage({
          id: getTrad('link-to-ctb'),
          defaultMessage: 'Accept changes',
        })}
      </Button >
    </CheckPermissions >
  );
};

export default AcceptChangeButton;
