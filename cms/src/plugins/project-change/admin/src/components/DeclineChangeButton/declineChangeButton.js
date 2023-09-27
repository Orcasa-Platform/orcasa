import { Button } from '@strapi/design-system';
import { Cross } from '@strapi/icons';
import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CheckPermissions, useCMEditViewDataManager, useNotification, useQueryParams, formatContentTypeData } from '@strapi/helper-plugin';
import { api } from '../../api';
import { useI18n } from '../../hooks/useI18n';

export const DeclineChangeButton = ({ slug }) => {
  const { replace } = useHistory();
  const { formatMessage } = useIntl();
  const { allLayoutData, initialData } = useCMEditViewDataManager();
  const toggleNotification = useNotification();
  const { uid } = allLayoutData.contentType;
  const { id, status } = initialData;
  const [{ rawQuery }] = useQueryParams();
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


  const declineChanges = async () => {
    try {
      const data = await api.declineChanges({
        id, toggleNotification
      });

      toggleNotification({
        type: 'success',
        message: i18n('decline-changes.success'),
      });

      dispatch(submitSucceeded(cleanReceivedData(data)));
      replace(`/content-manager/collectionType/${slug}/${id}${rawQuery}`);
    } catch (err) {
      console.error("Error declining changes", err);
      toggleNotification({
        type: 'error',
        message: i18n('decline-changes.failure'),
      });
    }
  };

  if (slug !== uid || !id || status !== 'proposed') {
    return null;
  }

  return (
    <CheckPermissions >
      <Button
        startIcon={<Cross />}
        style={{ width: '100%' }}
        onClick={declineChanges}
        variant="danger-light"
      >
        {formatMessage({
          id: 'link-to-ctb',
          defaultMessage: i18n('decline-changes.success'),
        })}
      </Button >
    </CheckPermissions >
  );
};
