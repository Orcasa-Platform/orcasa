import { Button } from '@strapi/design-system';
import { Check } from '@strapi/icons';
import React from 'react';
import { useIntl } from 'react-intl';
import { CheckPermissions, useCMEditViewDataManager, useNotification } from '@strapi/helper-plugin';
import { api } from '../../api';
import { permissions } from '../../permissions';
import _ from 'lodash';
import { useHistory } from "react-router-dom";

const AcceptOrganizationChangeButton = (props) => {
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const { allLayoutData, initialData, modifiedData } = useCMEditViewDataManager();
  const { uid } = allLayoutData.contentType;
  const history = useHistory();

  const acceptOrganizationChanges = async () => {
    try {
      const res = await api.acceptOrganizationChanges({ id: modifiedData.id });
      if (res) {
        history.push(`/content-manager/collection-types/api::organization.organization/${res.id}`);
        toggleNotification({
          type: 'success',
          message: { id: 'Organization change accepted.' },
        });
      } else {
        toggleNotification({
          type: 'warning',
          message: { id: 'Organization change not accepted.' },
        });
      }
    } catch (err) {
      toggleNotification({
        type: 'warning',
        message: { id: err.toString() },
      });
      console.error('Error accepting organization changes', err);
    }
  };

  const allowedUID = ['api::organization-change.organization-change'];
  if (!allowedUID.includes(uid) || !initialData.id || modifiedData.publication_status !== 'proposed') {
    return null;
  }

  const isModified = !_.isEqual(modifiedData, initialData);
  return (
    <CheckPermissions permissions={permissions.acceptOrganizationChanges} >
      <Button
        disabled={isModified}
        startIcon={<Check />}
        style={{ width: '100%' }}
        variant="secondary"
        onClick={acceptOrganizationChanges}
      >
        {formatMessage({
          id: 'link-to-ctb',
          defaultMessage: isModified ? 'Cannot accept unsaved changes' : 'Accept changes',
        })}
      </Button >
    </CheckPermissions >
  );
};

export default AcceptOrganizationChangeButton;
