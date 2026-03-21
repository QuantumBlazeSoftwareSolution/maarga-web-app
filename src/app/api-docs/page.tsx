import { redirect } from 'next/navigation';

export default function ApiDocsRoot() {
  // Automatically redirect to the latest version (v1)
  redirect('/api-docs/v1');
}
