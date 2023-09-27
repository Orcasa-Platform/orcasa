import { Button } from '@strapi/design-system';
import { Check } from '@strapi/icons';
import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CheckPermissions, useCMEditViewDataManager, useNotification, formatContentTypeData } from '@strapi/helper-plugin';
import { api } from '../../api';
import { useI18n } from '../../hooks/useI18n';

export const AcceptChangeButton = ({ slug }) => {
  const { replace } = useHistory();
  const { formatMessage } = useIntl();
  const { allLayoutData, initialData } = useCMEditViewDataManager();
  const toggleNotification = useNotification();
  const { uid } = allLayoutData.contentType;
  const { id, status } = initialData;
  const dispatch = useDispatch();
  const { i18n } = useI18n();

  const submitSucceeded = (data) => ({
    type: 'ContentManager/CrudReducer/SUBMIT_SUCCEEDED',
    data,
  });

  const cleanReceivedData = useCallback(
    (data) => {
      return formatContentTypeData(data, allLayoutData.contentType, allLayoutData.components);
    },
    [allLayoutData]
  );

  const acceptChanges = async () => {
    try {
      const data = await api.acceptChanges({
        id,
      });

      toggleNotification({
        type: 'success',
        message: i18n('accept-changes.success'),
      });

      dispatch(submitSucceeded(cleanReceivedData(data)));
      replace(`/content-manager/collectionType/api::project.project/${data.id}`);
    } catch (err) {
      console.error("Error accepting changes", err);
      toggleNotification({
        type: 'error',
        message: i18n('accept-changes.failure'),
      });
    }
  };

  if (slug !== uid || !id || status !== 'proposed') {
    return null;
  }

  return (
    <CheckPermissions>
      <Button
        startIcon={<Check />}
        style={{ width: '100%' }}
        variant="secondary"
        onClick={acceptChanges}
      >
        {formatMessage({
          id: 'link-to-ctb',
          defaultMessage: i18n('accept-changes.button'),
        })}
      </Button >
    </CheckPermissions >
  );
};
