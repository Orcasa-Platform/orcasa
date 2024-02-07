import { CheckPermissions, useCMEditViewDataManager, useNotification } from '@strapi/helper-plugin';
import { Cross } from '@strapi/icons';
import React from 'react';
import { useIntl } from 'react-intl';
import { permissions } from '../../permissions';
import { api } from '../../api';
import { Button } from '@strapi/design-system';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';

const DeclineOrganizationChangeButton = ({ slug }) => {
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const { allLayoutData, modifiedData, initialData } = useCMEditViewDataManager();
  const { uid } = allLayoutData.contentType;
  const history = useHistory();

  const allowedUID = ['api::organization-change.organization-change'];

  const declineOrganizationChanges = async () => {
    try {
      const res = await api.declineOrganizationChanges({ id: modifiedData.id });
      if (res.publication_status === 'declined') {
        history.replace(`/content-manager/collection-types/api::organization-change.organization-change`);

        toggleNotification({
          type: 'success',
          message: { id: 'Organization change declined.' },
        });
      } else {
        toggleNotification({
          type: 'warning',
          message: { id: 'Organization change not declined.' },
        });
      }
    } catch (err) {
      toggleNotification({
        type: 'warning',
        message: { id: err.toString() },
      });
      console.error('Error declining organization changes', err);
    }
  }

  if (!allowedUID.includes(uid) || !initialData.id || modifiedData.publication_status !== 'proposed') {
    return null;
  }

  const isModified = !_.isEqual(modifiedData, initialData);
  return (
    <CheckPermissions permissions={permissions.declineOrganizationChanges} >
      <Button
        disabled={isModified}
        startIcon={<Cross />}
        style={{ width: '100%' }}
        variant="danger-light"
        onClick={declineOrganizationChanges}
      >
        {formatMessage({
          id: 'link-to-ctb',
          defaultMessage: isModified ? 'Cannot decline unsaved changes' : 'Decline changes',
        })}
      </Button >
    </CheckPermissions >
  );
};

export default DeclineOrganizationChangeButton;
