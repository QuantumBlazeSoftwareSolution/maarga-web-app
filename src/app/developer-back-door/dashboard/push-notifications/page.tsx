'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { getUsersWithFcmTokens, sendTestNotification } from '@/src/lib/actions/fcm';

// ─── Neumorphism design tokens ───────────────────────────────────────────────
const nmOuter = '6px 6px 14px #c0c3c8, -6px -6px 14px #ffffff';
const nmPressed = 'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff';
const nmSubtle = '3px 3px 8px #c0c3c8, -3px -3px 8px #ffffff';

function NmCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      style={{ boxShadow: nmOuter, background: '#E1E4E9' }}
      className={`rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}

function NmButton({
  children,
  onClick,
  className = '',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        boxShadow: disabled ? nmPressed : nmSubtle,
        background: '#E1E4E9',
      }}
      className={`rounded-xl px-4 py-2 font-medium text-[#4A5568] transition-all duration-150 
        ${!disabled ? 'active:scale-95 hover:text-[#2D3748]' : 'opacity-70 cursor-not-allowed'} 
        ${className}`}
    >
      {children}
    </button>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function PushNotificationsTestPage() {
  const router = useRouter();
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const [selectedAuthIds, setSelectedAuthIds] = useState<string[]>([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await getUsersWithFcmTokens();
    setUsers(result);
    setLoading(false);
  };

  const toggleUserSelection = (authId: string) => {
    setSelectedAuthIds(prev => 
      prev.includes(authId) 
        ? prev.filter(id => id !== authId) 
        : [...prev, authId]
    );
  };

  const toggleAll = () => {
    if (selectedAuthIds.length === users.length) {
      setSelectedAuthIds([]);
    } else {
      setSelectedAuthIds(users.map(u => u.authId));
    }
  };

  const handleSend = async () => {
    if (selectedAuthIds.length === 0) return toast.error('Select at least one user');
    if (!title.trim() || !body.trim()) return toast.error('Title and body are required');

    setSending(true);
    const result = await sendTestNotification(selectedAuthIds, title, body, imageUrl);
    setSending(false);

    if (result.success && result.data) {
      toast.success(
        `Sent! Success: ${result.data.results.successCount}, Failures: ${result.data.results.failureCount}`
      );
      if (result.data.results.cleanedUpTokens > 0) {
        toast.info(`Cleaned up ${result.data.results.cleanedUpTokens} dead tokens.`);
      }
      // Clear form
      setTitle('');
      setBody('');
      setImageUrl('');
      setSelectedAuthIds([]);
      // Refresh to see if ghosts dropped off
      fetchUsers();
    } else {
      toast.error('Failed: ' + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#E1E4E9] p-6 lg:p-12 text-[#4A5568] font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center space-x-6">
          <NmButton onClick={() => router.push('/developer-back-door/dashboard')} className="p-3">
            <ArrowLeft className="w-5 h-5 text-[#4A5568]" />
          </NmButton>
          <div>
            <h1 className="text-3xl font-extrabold text-[#2D3748] tracking-tight">FCM Playground</h1>
            <p className="text-[#718096] mt-1 font-medium">Test Push Notifications natively across registered devices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Target Selection */}
          <NmCard className="p-6 h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#2D3748]">Target Audience</h2>
              <NmButton onClick={toggleAll} className="text-xs px-3 py-1">
                {selectedAuthIds.length === users.length && users.length > 0 ? 'Deselect All' : 'Select All'}
              </NmButton>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {loading ? (
                <div className="flex justify-center mt-10">
                  <span className="animate-pulse text-[#718096]">Scanning DB for FCM Tokens...</span>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center mt-10 text-[#718096] p-6 rounded-xl" style={{ boxShadow: nmPressed }}>
                  No users with active device tokens found.
                  <br/><br/>
                  <span className="text-xs">Log into the flutter app to auto-register a token.</span>
                </div>
              ) : (
                users.map(user => (
                  <div 
                    key={user.authId}
                    onClick={() => toggleUserSelection(user.authId)}
                    className="flex items-center justify-between p-4 cursor-pointer rounded-xl transition-all"
                    style={{
                      boxShadow: selectedAuthIds.includes(user.authId) ? nmPressed : nmSubtle,
                      border: selectedAuthIds.includes(user.authId) ? '1px solid rgba(56, 178, 172, 0.3)' : '1px solid transparent'
                    }}
                  >
                    <div>
                      <p className="font-semibold text-[#2D3748]">{user.name}</p>
                      <p className="text-xs text-[#718096]">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-bold bg-[#CBD5E0] px-2 py-1 rounded-full text-[#4A5568]">
                        {user.tokens} Device{user.tokens > 1 ? 's' : ''}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                        ${selectedAuthIds.includes(user.authId) ? 'border-teal-500 bg-teal-500' : 'border-[#A0AEC0]'}`}>
                        {selectedAuthIds.includes(user.authId) && (
                          <div className="w-2 h-2 bg-[#E1E4E9] rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </NmCard>

          {/* Right Column: Payload Writer */}
          <div className="space-y-6">
            <NmCard className="p-6">
              <h2 className="text-xl font-bold text-[#2D3748] mb-6">Notification Payload</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#4A5568] mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., Petrol Update!"
                    className="w-full p-3 rounded-xl bg-[#E1E4E9] text-[#2D3748] placeholder-[#A0AEC0] outline-none"
                    style={{ boxShadow: nmPressed }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#4A5568] mb-2">Message Body</label>
                  <textarea
                    rows={4}
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    placeholder="e.g., Octane 92 is now available at IOC Kandy..."
                    className="w-full p-3 rounded-xl bg-[#E1E4E9] text-[#2D3748] placeholder-[#A0AEC0] outline-none resize-none"
                    style={{ boxShadow: nmPressed }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#4A5568] mb-2">Banner Image URL (Optional)</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://example.com/premium-image.png"
                    className="w-full p-3 rounded-xl bg-[#E1E4E9] text-[#2D3748] placeholder-[#A0AEC0] outline-none"
                    style={{ boxShadow: nmPressed }}
                  />
                  <p className="text-[10px] text-[#718096] mt-2 ml-1">
                    Direct image link. Highly recommended for premium Android BigPicture alerts.
                  </p>
                </div>
              </div>
            </NmCard>

            <NmButton 
              onClick={handleSend} 
              disabled={sending || selectedAuthIds.length === 0}
              className="w-full py-4 text-lg font-bold text-teal-600 tracking-wide"
            >
              {sending ? 'Sending Multicast Payload...' : `Fire Notification to ${selectedAuthIds.length} Target${selectedAuthIds.length === 1 ? '' : 's'}`}
            </NmButton>
          </div>
          
        </div>
      </div>
    </div>
  );
}
