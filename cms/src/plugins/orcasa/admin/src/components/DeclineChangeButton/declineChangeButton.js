import { LinkButton, } from '@strapi/helper-plugin';
import { Cross } from '@strapi/icons';
import React from 'react';
import { useIntl } from 'react-intl';
import { CheckPermissions, useCMEditViewDataManager } from '@strapi/helper-plugin';
import { permissions } from '../../permissions';

const DeclineChangeButton = ({ slug }) => {
  const { formatMessage } = useIntl();
  const { allLayoutData, modifiedData } = useCMEditViewDataManager();
  const { uid } = allLayoutData.contentType;

  const allowedUID = ['api::project-change.project-change'];
  if (!allowedUID.includes(uid)) {
    return null;
  }

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
          id: 'link-to-ctb',
          defaultMessage: 'Decline changes',
        })}
      </LinkButton >
    </CheckPermissions >
  );
};

export default DeclineChangeButton;
