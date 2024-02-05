import { CheckPermissions, useCMEditViewDataManager, useNotification } from '@strapi/helper-plugin';
import { Cross } from '@strapi/icons';
import React from 'react';
import { useIntl } from 'react-intl';
import { permissions } from '../../permissions';
import { api } from '../../api';
import { Button } from '@strapi/design-system';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';

const DeclineChangeButton = ({ slug }) => {
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const { allLayoutData, modifiedData, initialData } = useCMEditViewDataManager();
  const { uid } = allLayoutData.contentType;
  const history = useHistory();

  const allowedUID = ['api::project-change.project-change'];

  const declineChanges = async () => {
    try {
      const res = await api.declineProjectChanges({ id: modifiedData.id });
      if (res.publication_status === 'declined') {
        history.replace(`/content-manager/collection-types/api::project-change.project-change`);

        toggleNotification({
          type: 'success',
          message: { id: 'Project change declined.' },
        });
      } else {
        toggleNotification({
          type: 'warning',
          message: { id: 'Project change not declined.' },
        });
      }
    } catch (err) {
      toggleNotification({
        type: 'warning',
        message: { id: err.toString() },
      });
      console.error('Error declining project changes', err);
    }
  }

  if (!allowedUID.includes(uid) || !initialData.id || modifiedData.publication_status !== 'proposed') {
    return null;
  }

  const isModified = !_.isEqual(modifiedData, initialData);
  return (
    <CheckPermissions permissions={permissions.declineProjectChanges} >
      <Button
        disabled={isModified}
        startIcon={<Cross />}
        style={{ width: '100%' }}
        variant="danger-light"
        onClick={declineChanges}
      >
        {formatMessage({
          id: 'link-to-ctb',
          defaultMessage: isModified ? 'Cannot decline unsaved changes' : 'Decline changes',
        })}
      </Button >
    </CheckPermissions >
  );
};

export default DeclineChangeButton;
