import { redirect } from 'next/navigation';

export default function RootPage() {
  // In a real app, you'd check for an active session here.
  // For this example, we'll always redirect to the login page.
  redirect('/login');
}
