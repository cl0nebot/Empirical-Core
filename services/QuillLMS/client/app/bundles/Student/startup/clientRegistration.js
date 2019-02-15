import ReactOnRails from 'react-on-rails';
import JoinClassApp from './JoinClassAppClient';
import AccountSettingsApp from './AccountSettingsAppClient';
import StudentProfileRouter from './StudentProfileRouter';

ReactOnRails.register({
  JoinClassApp,
  AccountSettingsApp,
  StudentProfileRouter,
});
