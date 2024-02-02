import { CheckPermissions, useNotification } from '@strapi/helper-plugin';
import { Command, Blocks } from '@strapi/icons';
import React from 'react';
import { useIntl } from 'react-intl';
import { permissions } from '../../permissions';
import { api } from '../../api';
import { Button } from '@strapi/design-system';
import { useHistory } from 'react-router-dom';

const ImportPracticesButton = ({ slug }) => {
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const apiIDFromUrl = window.location.pathname.split('/').find((part) => part.startsWith('api::'));
  const history = useHistory();

  const allowedUID = ['api::practice-import.practice-import'];

  const importPractices = async () => {
    try {
      const res = await api.startPracticesImport();
      if (res.status === 'started') {
        history.push(`/content-manager/collection-types/api::practice-import.practice-import/${res.id}`);
        toggleNotification({
          type: 'success',
          message: { id: `Practices import started in the background. You can refresh this page to monitor the status. It may take a few minutes to complete.` },
        });
      } else {
        toggleNotification({
          type: 'warning',
          message: { id: 'Practices import did not start.' },
        });
      }
    } catch (err) {
      toggleNotification({
        type: 'warning',
        message: { id: err.toString() },
      });
      console.error('Error starting practices import', err);
    }
  }

  const decoratePractices = async () => {
    try {
      toggleNotification({
        type: 'info',
        message: { id: 'Practices decoration started. It may take a minute, please wait...' },
      });
      const res = await api.startPracticesDecoration();
      // if (res.publication_status === 'declined') {
      //   history.replace(`/content-manager/collection-types/api::project-change.project-change`);
      console.log(res);
      history.replace(`/content-manager/collection-types/api::practice-import.practice-import`);
        toggleNotification({
          type: 'success',
          message: { id: 'Practices decorated successfully.' },
        });
      // } else {
      //   toggleNotification({
      //     type: 'warning',
      //     message: { id: 'Practices not decorated' },
      //   });
      // }
    } catch (err) {
      toggleNotification({
        type: 'warning',
        message: { id: err.toString() },
      });
      console.error('Error decorating practices', err);
    }
  }

  if (!allowedUID.includes(apiIDFromUrl)) {
    return null;
  }

  // const isModified = !_.isEqual(modifiedData, initialData);
  return (
    <CheckPermissions permissions={permissions.importPractices} >
      <Button
        startIcon={<Command />}
        onClick={importPractices}
      >
        {formatMessage({
          id: 'link-to-ctb',
          defaultMessage: 'Start practices import',
        })}
      </Button >
      <Button
        startIcon={<Blocks />}
        onClick={decoratePractices}
      >
        {formatMessage({
          id: 'link-to-ctb',
          defaultMessage: 'Decorate practices',
        })}
      </Button >
    </CheckPermissions >
  );
};

export default ImportPracticesButton;
