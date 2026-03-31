import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import arrowheadLogo from '../assets/arrowhead-logo.png';

type Role = 'Staff' | 'Owner';

type LoginStep = 'select-role' | 'enter-credentials';

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginStep>('select-role');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setIsDropdownOpen(false);
    setStep('enter-credentials');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    navigate('/dashboard/members');
  };

  const handleBack = () => {
    setStep('select-role');
    setSelectedRole(null);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* ── Background gradient matching wireframe ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-300 via-primary to-primary-dark" />
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />

      {/* ── Login Card ── */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-surface-alt rounded-2xl shadow-modal p-8 sm:p-10">
          {/* ── Brand Header ── */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <img
              src={arrowheadLogo}
              alt="Arrowhead Logo"
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-primary text-4xl font-semibold tracking-tight">
              Arrowhead
            </h1>
          </div>

          {/* ── Step: Select Role ── */}
          {step === 'select-role' && (
            <div className="space-y-6">
              <p className="text-center text-secondary text-lg font-medium">
                Log in as:
              </p>

              <div className="flex flex-col items-center gap-3">
                {/* Staff button */}
                <button
                  onClick={() => handleRoleSelect('Staff')}
                  className="
                    w-48 px-5 py-3 bg-surface border border-neutral-300
                    rounded-lg text-secondary text-sm font-medium text-center
                    hover:border-neutral-400 hover:shadow-sm
                    transition-all duration-200 cursor-pointer
                  "
                >
                  Staff
                </button>

                {/* Owner button */}
                <button
                  onClick={() => handleRoleSelect('Owner')}
                  className="
                    w-48 px-5 py-3 bg-surface border border-neutral-300
                    rounded-lg text-secondary text-sm font-medium text-center
                    hover:border-neutral-400 hover:shadow-sm
                    transition-all duration-200 cursor-pointer
                  "
                >
                  Owner
                </button>
              </div>
            </div>
          )}

          {/* ── Step: Enter Credentials ── */}
          {step === 'enter-credentials' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <p className="text-center text-secondary text-lg font-medium">
                Enter Username and Password:
              </p>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="
                    w-full px-4 py-3 bg-surface border border-neutral-300
                    rounded-lg text-sm text-secondary placeholder:text-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200
                  "
                  autoFocus
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full px-4 py-3 bg-surface border border-neutral-300
                    rounded-lg text-sm text-secondary placeholder:text-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200
                  "
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="
                    flex-1 px-4 py-3 border border-neutral-300 rounded-lg
                    text-sm font-medium text-secondary
                    hover:bg-neutral-100 active:scale-[0.98]
                    transition-all duration-150 cursor-pointer
                  "
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="
                    flex-1 px-4 py-3 bg-primary text-text-light rounded-lg
                    text-sm font-medium
                    hover:bg-primary-dark active:scale-[0.98]
                    transition-all duration-150 cursor-pointer
                    shadow-md shadow-primary/25
                  "
                >
                  Log In
                </button>
              </div>

              {selectedRole && (
                <p className="text-center text-xs text-neutral-400 mt-2">
                  Logging in as <span className="font-semibold text-primary">{selectedRole}</span>
                </p>
              )}
            </form>
          )}
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-white/60 mt-6">
          Arrowhead Gym Management System
        </p>
      </div>
    </div>
  );
}
