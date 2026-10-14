import React, { useState } from 'react';
import {
  X,
  Server,
  Database,
  FileCode,
  CheckCircle2,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  FolderGit2,
  Terminal,
  HelpCircle,
  Cpu,
} from 'lucide-react';

interface HostingerDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostingerDeployModal: React.FC<HostingerDeployModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'react_spa' | 'php_mysql' | 'checklist'>('react_spa');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const htaccessContent = `# SargodhaMart - Hostinger Production Apache Configuration
# Designed for Hostinger Shared & Cloud Hosting (public_html)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>`;

  const phpConfigContent = `<?php
// Hostinger Database Configuration (hPanel -> Databases -> MySQL Databases)
define('DB_HOST', 'localhost'); // Hostinger standard is localhost
define('DB_PORT', '3306');
define('DB_NAME', 'u123456789_sargodhamart'); // Replace with your Hostinger DB name
define('DB_USER', 'u123456789_dbuser');       // Replace with your Hostinger DB user
define('DB_PASS', 'Your_Strong_Password_Here'); // Your DB password
define('DB_CHARSET', 'utf8mb4');

// Production environment settings
define('APP_ENV', 'production');
define('APP_DEBUG', false);
?>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-cyan-200 rounded-3xl overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-cyan-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Server className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-3 h-3" /> 100% Hostinger Ready & Tested
              </div>
              <h3 className="text-xl font-black">
                Hostinger Deployment Guide (ہوسٹنگر پر اپلوڈ کرنے کا طریقہ)
              </h3>
              <p className="text-xs text-purple-200">
                Deploy SargodhaMart on Hostinger Shared, Cloud, or VPS Hosting in 5 simple minutes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('react_spa')}
            className={`pb-3 px-3 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'react_spa'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Option A: React Web App (Static / SPA)</span>
          </button>

          <button
            onClick={() => setActiveTab('php_mysql')}
            className={`pb-3 px-3 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'php_mysql'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Option B: PHP + MySQL Backend</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-3 px-3 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Deployment Checklist</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
          {activeTab === 'react_spa' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 space-y-2">
                <h4 className="font-black text-sm text-indigo-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>How to Host React SPA on Hostinger Shared/Cloud:</span>
                </h4>
                <p>
                  Hostinger Shared & Cloud plans support static React applications with instant loading via Apache / Nginx.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-900 text-xs">Build the Production Distribution</h5>
                    <p className="text-[11px] text-slate-600">
                      Run <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold text-slate-800">npm run build</code> in the project. This generates the production <code className="font-bold">dist/</code> folder.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-900 text-xs">Upload to Hostinger public_html</h5>
                    <p className="text-[11px] text-slate-600">
                      Open Hostinger <strong>hPanel → File Manager</strong>. Navigate to <code className="font-bold">public_html</code> and upload all files from inside your <code className="font-bold">dist/</code> folder.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-900 text-xs">Verify .htaccess is Present</h5>
                    <p className="text-[11px] text-slate-600">
                      The included <code className="font-bold">.htaccess</code> file handles client-side routing so refreshing pages does not show 404 errors.
                    </p>
                  </div>
                </div>
              </div>

              {/* .htaccess snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Hostinger .htaccess Configuration:</span>
                  <button
                    onClick={() => handleCopy(htaccessContent, 'htaccess')}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'htaccess' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'htaccess' ? 'Copied' : 'Copy .htaccess'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-36">
                  {htaccessContent}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'php_mysql' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-2">
                <h4 className="font-black text-sm text-purple-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-600" />
                  <span>How to Host PHP & MySQL on Hostinger:</span>
                </h4>
                <p>
                  SargodhaMart includes complete PHP scripts (<code className="font-bold">index.php</code>, <code className="font-bold">product.php</code>, <code className="font-bold">seller.php</code>, <code className="font-bold">categories.php</code>, <code className="font-bold">database.sql</code>) for standard Hostinger cPanel / hPanel PHP hosting.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-900 text-xs">Create MySQL Database in Hostinger hPanel</h5>
                    <p className="text-[11px] text-slate-600">
                      Go to <strong>hPanel → Databases → MySQL Databases</strong>. Create a new database name and username (e.g. <code className="font-bold">u123456789_sargodha</code>). Save your password safely.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-900 text-xs">Import database.sql in phpMyAdmin</h5>
                    <p className="text-[11px] text-slate-600">
                      Click <strong>Enter phpMyAdmin</strong> next to your new database. Click <strong>Import</strong> tab, select <code className="font-bold">database.sql</code> from this project, and click <strong>Go</strong>. All tables, food categories, reviews, and test data will be created!
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-900 text-xs">Configure config/config.php</h5>
                    <p className="text-[11px] text-slate-600">
                      Edit <code className="font-bold">config/config.php</code> in Hostinger File Manager to insert your DB Name, DB User, and Password.
                    </p>
                  </div>
                </div>
              </div>

              {/* PHP config snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Hostinger config/config.php Snippet:</span>
                  <button
                    onClick={() => handleCopy(phpConfigContent, 'phpconfig')}
                    className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'phpconfig' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'phpconfig' ? 'Copied' : 'Copy Config'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-36">
                  {phpConfigContent}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <h4 className="font-black text-slate-900 text-sm">
                Pre-Flight Hostinger Deployment Checklist:
              </h4>

              <div className="space-y-2.5">
                {[
                  { title: 'Apache mod_rewrite Enabled', desc: 'Included .htaccess handles all clean URLs without 404s.' },
                  { title: 'Customer Ratings & Reviews Active', desc: 'Customers can rate products, restaurants and sellers 1-5 stars with feedback.' },
                  { title: 'Food & Dining Marketplace Added', desc: 'Restaurants, menu items, hot deals, and WhatsApp orders are fully functional.' },
                  { title: 'PHP 8.1 / 8.2 / 8.3 Compatibility', desc: 'Strict typing, PDO connection, prepared statements, and CSRF protection.' },
                  { title: 'Mobile Responsive & PWA Ready', desc: 'Manifest, offline service worker, and mobile bottom navigation are configured.' },
                  { title: 'SSL / HTTPS Ready', desc: 'Security headers X-Frame-Options, X-Content-Type-Options, and Referrer-Policy active.' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">{item.title}</h5>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            SargodhaMart · 100% Hostinger Ready
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black cursor-pointer transition-colors"
          >
            Got It, Close
          </button>
        </div>
      </div>
    </div>
  );
};
