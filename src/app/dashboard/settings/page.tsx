import { SettingsForm } from './settings-form';
import { getCurrentUserData } from './actions';

export default async function SettingsPage() {
  const userData = await getCurrentUserData();

  return (
    <main className='p-6'>
      <div className='grid gap-6'>
        <h1 className='text-2xl font-bold text-white'>Settings</h1>
        <div className='rounded-lg border border-gray-800 bg-gray-900/50 p-6'>
          <SettingsForm
            initialEmail={userData?.managerEmail}
            initialLinearApiKey={userData?.linearApiKey}
          />
        </div>
      </div>
    </main>
  );
}
