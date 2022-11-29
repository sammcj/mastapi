import * as upload from './upload';
import * as backup from './backup';
import generator from 'megalodon';
const fs = require('fs');
const prompt = require('prompt');

const datestamp = new Date().toISOString().split('T')[0];
const defaultInstanceUrl: string =
  (process.env.MASTODON_INSTANCE_URL as string) || 'https://aus.social';
const defaultBackupDir: string =
  (process.env.MASTODON_BACKUP_DIR as string) || `${fs.realpathSync('.')}/backups/${datestamp}`;
const defaultAccessToken: string = process.env.MASTODON_ACCESS_TOKEN as string;

// Function to show the default values for operation, instanceUrl and accessToken and offer the user the option to change them
function run() {
  prompt.start();
  prompt.get(
    [
      {
        name: 'operation',
        description: 'Operation to perform? (backup/restore)',
        default: 'backup',
      },
      {
        name: 'instanceUrl',
        description: 'Instance URL',
        default: defaultInstanceUrl,
      },
      {
        name: 'accessToken',
        description: 'Access token',
        default: defaultAccessToken,
      },
    ],
    async function (err: any, result: any) {
      if (err) {
        console.error(err);
        return;
      } else {
        if (result.operation === 'backup') {
          const client = generator('mastodon', result.instanceUrl, result.accessToken);
          prompt.get(
            [
              {
                name: 'backupDir',
                description: 'Backup directory',
                default: defaultBackupDir,
              },
            ],
            async function (err: any, result: any) {
              if (err) {
                console.error(err);
                return;
              } else {
                backup.backup_filters(result.backupDir, client);
              }
            },
          );
        } else if (result.operation === 'restore') {
          const client = generator('mastodon', result.instanceUrl, result.accessToken);
          prompt.get(
            [
              {
                name: 'inputFilters',
                description: 'Path to filters file',
                default: `${defaultBackupDir}/filters.json`,
              },
            ],
            async function (err: any, result: any) {
              if (err) {
                console.error(err);
                return;
              } else {
                upload.upload_filters(result.inputFilters, client);
              }
            },
          );
        } else {
          console.error('Invalid option');
          return;
        }
      }
    },
  );
}

run();
