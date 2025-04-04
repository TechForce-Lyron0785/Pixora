"use client"
import React, { useState } from 'react';
import {
  Bell,
  Shield,
  CreditCard,
  Globe,
  Smartphone,
  Users,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Check,
  X,
  Save,
  Edit,
  Camera,
  LogOut,
  Moon,
  Sun,
  Copy,
  RefreshCw,
  Trash,
  MessageSquare
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState('dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [userName, setUserName] = useState('Alex Johnson');
  const [userBio, setUserBio] = useState('Digital artist and photographer passionate about creating immersive visual experiences.');
  const [editingBio, setEditingBio] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState({
    likes: true,
    comments: true,
    followers: true,
    mentions: true,
    newsletter: false,
  });

  // Sample connected apps data
  const connectedApps = [
    { id: 1, name: 'Instagram', icon: "/api/placeholder/40/40", connectedDate: 'Jan 15, 2023' },
    { id: 2, name: 'Behance', icon: "/api/placeholder/40/40", connectedDate: 'Mar 24, 2023' },
    { id: 3, name: 'Pinterest', icon: "/api/placeholder/40/40", connectedDate: 'Jun 10, 2023' },
  ];

  // Sample subscription plans
  const plans = [
    { id: 'free', name: 'Free', price: '$0', storage: '10GB', features: ['Basic editing tools', 'Standard quality exports', 'Public collections'] },
    { id: 'pro', name: 'Pro', price: '$9.99/mo', storage: '100GB', features: ['Advanced editing tools', 'HD exports', 'Private collections', 'Analytics dashboard', 'No watermarks'] },
    { id: 'premium', name: 'Premium', price: '$19.99/mo', storage: 'Unlimited', features: ['All Pro features', '4K exports', 'Priority support', 'Commercial usage rights', 'Custom branding'] },
  ];
  const [currentPlan, setCurrentPlan] = useState('free');

  // Sample device sessions
  const sessions = [
    { id: 1, device: 'MacBook Pro', location: 'New York, USA', lastActive: 'Current session', browser: 'Chrome', ip: '192.168.1.XX' },
    { id: 2, device: 'iPhone 13', location: 'New York, USA', lastActive: '2 hours ago', browser: 'Safari', ip: '192.168.1.XX' },
    { id: 3, device: 'iPad Air', location: 'Boston, USA', lastActive: '3 days ago', browser: 'Safari', ip: '192.168.2.XX' },
  ];

  const copyToClipboard = () => {
    // Simulated copy to clipboard
    alert("API key copied to clipboard!");
  };

  const regenerateApiKey = () => {
    // Simulated regenerate API key
    alert("API key regenerated!");
  };

  return (
    <div className="p-6 bg-zinc-950 text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400">Manage your account, preferences, and security</p>
      </div>

      {/* Settings navigation */}
      <div className="mb-8 overflow-x-auto no-scrollbar">
        <div className="flex space-x-2">
          {[
            { id: 'profile', name: 'Profile', icon: <Users className="w-4 h-4" /> },
            { id: 'account', name: 'Account', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'notifications', name: 'Notifications', icon: <Bell className="w-4 h-4" /> },
            { id: 'privacy', name: 'Privacy', icon: <Lock className="w-4 h-4" /> },
            { id: 'connections', name: 'Connections', icon: <Globe className="w-4 h-4" /> },
            { id: 'security', name: 'Security', icon: <Shield className="w-4 h-4" /> },
            { id: 'devices', name: 'Devices', icon: <Smartphone className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              } transition-colors duration-200`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main settings area */}
        {activeTab === 'profile' && (
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Public Profile</h2>
              
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                      <img src="/api/placeholder/96/96" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white/20 rounded-full">
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <button className="text-xs text-violet-400 hover:text-violet-300">Change photo</button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                    {editingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="bg-zinc-800/50 border border-white/10 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <button 
                          onClick={() => setEditingName(false)}
                          className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEditingName(false)}
                          className="p-2 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/30"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">{userName}</h3>
                        <button 
                          onClick={() => setEditingName(true)}
                          className="p-2 bg-white/5 rounded-lg hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Bio</label>
                    {editingBio ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={userBio}
                          onChange={(e) => setUserBio(e.target.value)}
                          rows={3}
                          className="bg-zinc-800/50 border border-white/10 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setEditingBio(false)}
                            className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 text-sm flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingBio(false)}
                            className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <p className="text-gray-300 text-sm">{userBio}</p>
                        <button 
                          onClick={() => setEditingBio(true)}
                          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 flex-shrink-0 ml-2"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Username</label>
                  <div className="flex items-center">
                    <div className="text-white/30 bg-zinc-800/50 border border-white/10 rounded-l-lg py-2 px-3">
                      pixora.io/
                    </div>
                    <input
                      type="text"
                      defaultValue="alexjohnson"
                      className="bg-zinc-800/50 border border-white/10 border-l-0 rounded-r-lg py-2 px-3 flex-1 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue="alex.johnson@example.com"
                    className="bg-zinc-800/50 border border-white/10 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Website</label>
                  <input
                    type="url"
                    defaultValue="https://alexjohnson.design"
                    className="bg-zinc-800/50 border border-white/10 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    defaultValue="New York, USA"
                    className="bg-zinc-800/50 border border-white/10 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'account' && (
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Subscription</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`border rounded-xl p-4 transition-all ${
                      currentPlan === plan.id
                        ? 'border-violet-500 bg-violet-900/20'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{plan.name}</h3>
                      {currentPlan === plan.id && (
                        <span className="text-xs bg-violet-600 rounded-full px-2 py-0.5">Current</span>
                      )}
                    </div>
                    <p className="text-xl font-bold mb-2">{plan.price}</p>
                    <p className="text-sm text-gray-400 mb-3">{plan.storage} Storage</p>
                    
                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-xs flex items-start gap-2">
                          <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => setCurrentPlan(plan.id)}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                        currentPlan === plan.id
                          ? 'bg-white/20 text-white cursor-default'
                          : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white'
                      }`}
                      disabled={currentPlan === plan.id}
                    >
                      {currentPlan === plan.id ? 'Current Plan' : 'Upgrade'}
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Billing Information</h3>
                    <p className="text-sm text-gray-400">Next billing date: May 15, 2023</p>
                  </div>
                  <button className="text-violet-400 hover:text-violet-300 text-sm">Manage payment</button>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">API Access</h2>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-300">Use your API key to access Pixora services programmatically. Keep your API keys secure.</p>
                
                <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">API Key</h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={copyToClipboard}
                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={regenerateApiKey}
                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-800/50 border border-white/10 rounded-lg py-2 px-3 font-mono text-sm">
                    {showApiKey ? 'pix_5f7a8b9c3d2e1f0a4b6c8d9e' : '••••••••••••••••••••••••••'}
                  </div>
                </div>
                
                <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                  <h3 className="font-medium mb-2">Webhooks</h3>
                  <p className="text-sm text-gray-400 mb-3">Receive real-time notifications when events happen in your account.</p>
                  <button className="text-violet-400 hover:text-violet-300 text-sm">Configure webhooks</button>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Account Actions</h2>
              
              <div className="space-y-4">
                <div className="p-4 border border-white/10 rounded-lg bg-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Download Your Data</h3>
                    <p className="text-sm text-gray-400">Get a copy of your data, including images, collections, and profile information.</p>
                  </div>
                  <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Download</button>
                </div>
                
                <div className="p-4 border border-rose-500/20 rounded-lg bg-rose-950/10 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-rose-400">Delete Account</h3>
                    <p className="text-sm text-gray-400">Permanently delete your account and all associated data.</p>
                  </div>
                  <button className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg text-sm flex items-center gap-1">
                    <Trash className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Notification Settings</h2>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-400">All notifications</span>
                  <button 
                    className={`relative w-12 h-6 rounded-full transition-colors ${notificationsEnabled ? 'bg-violet-600' : 'bg-gray-600'}`}
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  >
                    <span 
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationsEnabled ? 'translate-x-6' : ''}`}
                    ></span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-sm text-gray-300 mb-3">Email Notifications</h3>
                  <div className="space-y-3">
                    {Object.entries(emailNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-white/5">
                        <div>
                          <p className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                          <p className="text-xs text-gray-400">
                            {key === 'likes' && 'When someone likes your content'}
                            {key === 'comments' && 'When someone comments on your content'}
                            {key === 'followers' && 'When someone follows you'}
                            {key === 'mentions' && 'When someone mentions you'}
                            {key === 'newsletter' && 'Weekly featured content and tips'}
                          </p>
                        </div>
                        <button 
                          className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-violet-600' : 'bg-gray-600'}`}
                          onClick={() => setEmailNotifications({...emailNotifications, [key]: !value})}
                        >
                          <span 
                            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${value ? 'translate-x-6' : ''}`}
                          ></span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-300 mb-3">Push Notifications</h3>
                  <div className="space-y-3">
                    {['Likes', 'Comments', 'New followers', 'Mentions', 'Direct messages'].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-white/5">
                        <p>{item}</p>
                        <button 
                          className="relative w-12 h-6 rounded-full bg-violet-600"
                        >
                          <span 
                            className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full translate-x-6"
                          ></span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'privacy' && (
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Privacy Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-sm text-gray-300 mb-3">Account Privacy</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'private_account', label: 'Private Account', description: 'Only approved followers can see your content' },
                      { id: 'show_activity', label: 'Activity Status', description: 'Let others see when you\'re active on Pixora' },
                      { id: 'discoverable', label: 'Profile Discoverability', description: 'Allow your profile to appear in search results' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs text-gray-400">{item.description}</p>
                        </div>
                        <button className="relative w-12 h-6 rounded-full bg-gray-600">
                          <span className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full"></span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h3 className="font-medium text-sm text-gray-300 mb-3">Data Usage</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'personalization', label: 'Personalization', description: 'Allow us to use your activity to personalize your experience' },
                      { id: 'analytics', label: 'Analytics Cookies', description: 'Allow us to collect usage data to improve our services' },
                      { id: 'ad_personalization', label: 'Ad Personalization', description: 'Allow us to show you personalized advertisements' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs text-gray-400">{item.description}</p>
                        </div>
                        <button className="relative w-12 h-6 rounded-full bg-violet-600">
                          <span className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full translate-x-6"></span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h3 className="font-medium text-sm text-gray-300 mb-3">Content Interactions</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'comments', label: 'Comments', description: 'Who can comment on your posts' },
                      { id: 'mentions', label: 'Mentions', description: 'Who can mention you in their posts' },
                      { id: 'messages', label: 'Direct Messages', description: 'Who can send you direct messages' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs text-gray-400">{item.description}</p>
                        </div>
                        <select className="bg-zinc-800 border border-white/10 rounded-lg py-1 px-2 text-sm">
                          <option>Everyone</option>
                          <option>Followers only</option>
                          <option>Nobody</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Blocked Accounts</h2>
              <p className="text-sm text-gray-400 mb-4">You haven&apos;t blocked any accounts yet. Blocked accounts won&apos;t be able to find your profile, posts, or contact you.</p>
              <button className="text-violet-400 hover:text-violet-300 text-sm">Manage blocked accounts</button>
            </div>
          </div>
        )}
        
        {activeTab === 'connections' && (
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Connected Apps</h2>
              
              <div className="space-y-4">
                {connectedApps.map((app) => (
                  <div key={app.id} className="flex items-center justify-between border border-white/10 rounded-lg p-4 bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden">
                        <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{app.name}</p>
                        <p className="text-xs text-gray-400">Connected {app.connectedDate}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
                      Disconnect
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 border border-dashed border-white/20 rounded-lg p-4 flex flex-col items-center justify-center py-8">
                <Globe className="w-8 h-8 text-gray-500 mb-2" />
                <h3 className="font-medium mb-1">Connect Another App</h3>
                <p className="text-sm text-gray-400 mb-3 text-center">Connect your account to other platforms to share and sync your content</p>
                <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium transition-colors">
                  Browse Integrations
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Password</h3>
                    <button className="text-violet-400 hover:text-violet-300 text-sm">Change password</button>
                  </div>
                  <div className="bg-zinc-800/50 border border-white/10 rounded-lg py-2 px-3">
                    <span className="text-gray-400">Last updated 3 months ago</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-xs text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    <button 
                      className={`relative w-12 h-6 rounded-full transition-colors ${twoFactorEnabled ? 'bg-violet-600' : 'bg-gray-600'}`}
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    >
                      <span 
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${twoFactorEnabled ? 'translate-x-6' : ''}`}
                      ></span>
                    </button>
                  </div>
                  
                  {twoFactorEnabled && (
                    <div className="bg-zinc-800/50 border border-white/10 rounded-lg p-4">
                      <p className="text-sm mb-3">Two-factor authentication is enabled. You&apos;ll receive a verification code via SMS when signing in.</p>
                      <button className="text-violet-400 hover:text-violet-300 text-sm">Change authentication method</button>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h3 className="font-medium mb-4">Login History</h3>
                  <div className="space-y-3">
                    {[
                      { date: 'Apr 4, 2023', device: 'MacBook Pro', location: 'New York, USA', ip: '192.168.1.XX' },
                      { date: 'Apr 2, 2023', device: 'iPhone 13', location: 'Chicago, USA', ip: '192.168.2.XX' },
                      { date: 'Mar 30, 2023', device: 'Firefox on Windows', location: 'Boston, USA', ip: '192.168.3.XX' },
                    ].map((login, index) => (
                      <div key={index} className="bg-zinc-800/50 border border-white/10 rounded-lg p-3">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{login.device}</span>
                          <span className="text-xs text-gray-400">{login.date}</span>
                        </div>
                        <div className="text-xs text-gray-400 flex items-center justify-between">
                          <span>{login.location}</span>
                          <span>IP: {login.ip}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Security Notifications</h3>
                      <p className="text-xs text-gray-400">Get alerted about suspicious activity</p>
                    </div>
                    <button className="relative w-12 h-6 rounded-full bg-violet-600">
                      <span className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full translate-x-6"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'devices' && (
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Active Sessions</h2>
              
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border border-white/10 rounded-lg p-4 bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          {session.device.includes('iPhone') || session.device.includes('iPad') ? (
                            <Smartphone className="w-5 h-5" />
                          ) : (
                            <Globe className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{session.device}</p>
                          <p className="text-xs text-gray-400">{session.browser} • {session.lastActive}</p>
                        </div>
                      </div>
                      {session.lastActive === 'Current session' ? (
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 rounded-full px-2 py-0.5">
                          Active now
                        </span>
                      ) : (
                        <button className="text-rose-400 hover:text-rose-300 text-sm">
                          Log out
                        </button>
                      )}
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                      <span>Location: {session.location}</span>
                      <span>IP: {session.ip}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <button className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Log out of all other sessions
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Right sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Theme</h2>
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 bg-white/5 rounded-full hover:bg-white/10"
              >
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {['dark', 'light', 'system'].map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className={`py-2 rounded-lg text-center text-sm capitalize transition-colors ${
                    theme === themeOption 
                      ? 'bg-violet-600 text-white' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {themeOption}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Need Help?</h2>
            <div className="space-y-3">
              {[
                { label: 'Documentation', icon: <Globe className="w-4 h-4" /> },
                { label: 'Contact Support', icon: <MessageSquare className="w-4 h-4" /> },
                { label: 'Privacy Policy', icon: <Lock className="w-4 h-4" /> },
                { label: 'Terms of Service', icon: <Shield className="w-4 h-4" /> },
              ].map((item, index) => (
                <button 
                  key={index}
                  className="flex items-center justify-between w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">App Info</h2>
              <span className="bg-white/10 text-xs rounded-full px-2 py-0.5">v2.3.1</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Release Date</span>
                <span>April 2, 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Updated</span>
                <span>April 4, 2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;