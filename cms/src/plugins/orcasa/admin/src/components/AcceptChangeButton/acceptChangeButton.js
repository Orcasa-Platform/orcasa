import { Button } from '@strapi/design-system';
import { Check } from '@strapi/icons';
import React from 'react';
import { useIntl } from 'react-intl';
import { CheckPermissions, useCMEditViewDataManager, useNotification } from '@strapi/helper-plugin';
import { api } from '../../api';
import { permissions } from '../../permissions';
import _ from 'lodash';
import { useHistory } from "react-router-dom";

const AcceptChangeButton = (props) => {
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const { allLayoutData, initialData, modifiedData } = useCMEditViewDataManager();
  const { uid } = allLayoutData.contentType;
  const history = useHistory();

  const acceptChanges = async () => {
    try {
      const res = await api.acceptProjectChanges({ id: modifiedData.id });
      if (res) {
        history.push(`/content-manager/collection-types/api::project.project/${res.id}`);
        toggleNotification({
          type: 'success',
          message: { id: 'Project change accepted.' },
        });
      } else {
        toggleNotification({
          type: 'warning',
          message: { id: 'Project change not accepted.' },
        });
      }
    } catch (err) {
      toggleNotification({
        type: 'warning',
        message: { id: err.toString() },
      });
      console.error('Error accepting project changes', err);
    }
  };

  const allowedUID = ['api::project-change.project-change'];
  if (!allowedUID.includes(uid) || !initialData.id || modifiedData.publication_status !== 'proposed') {
    return null;
  }

  const isModified = !_.isEqual(modifiedData, initialData);
  return (
    <CheckPermissions permissions={permissions.acceptProjectChanges} >
      <Button
        disabled={isModified}
        startIcon={<Check />}
        style={{ width: '100%' }}
        variant="secondary"
        onClick={acceptChanges}
      >
        {formatMessage({
          id: 'link-to-ctb',
          defaultMessage: isModified ? 'Cannot accept unsaved changes' : 'Accept changes',
        })}
      </Button >
    </CheckPermissions >
  );
};

export default AcceptChangeButton;
