import React, { useState } from 'react';
import { GitPullRequest, CheckCircle2, ArrowRight, ShieldCheck, Cpu, Cloud, ChevronDown, ChevronUp, Code2 } from 'lucide-react';

export default function PipelineStatusBadge() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pipeline-banner">
      <div className="pipeline-banner-header" onClick={() => setIsOpen(!isOpen)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}>
        <div className="pipeline-banner-left">
          <div className="pipeline-badge-pill">
            <span className="pulse-circle"></span>
            CI/CD Pipeline Architecture
          </div>
          <span className="pipeline-summary-text">
            GitHub Actions automated workflow: <strong>Test</strong> &rarr; <strong>Build</strong> &rarr; <strong>Deploy to GitHub Pages</strong>
          </span>
        </div>
        <div className="pipeline-banner-right">
          <span className="pipeline-view-details">
            {isOpen ? 'Hide Architecture' : 'View Pipeline Flow'}
          </span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {isOpen && (
        <div className="pipeline-flow-container">
          <div className="pipeline-stages">
            {/* Stage 1: Trigger */}
            <div className="stage-card">
              <div className="stage-header">
                <GitPullRequest className="stage-icon text-indigo" size={18} />
                <span className="stage-title">1. Triggers</span>
              </div>
              <ul className="stage-items">
                <li><code>push</code> to <code>main</code> branch</li>
                <li><code>pull_request</code> to <code>main</code></li>
                <li>Manual <code>workflow_dispatch</code></li>
              </ul>
              <span className="stage-tag bg-indigo-subtle">Event Driven</span>
            </div>

            <div className="pipeline-arrow"><ArrowRight size={18} /></div>

            {/* Stage 2: Test */}
            <div className="stage-card">
              <div className="stage-header">
                <ShieldCheck className="stage-icon text-emerald" size={18} />
                <span className="stage-title">2. Automated Tests</span>
              </div>
              <ul className="stage-items">
                <li>Setup Node.js 20 LTS</li>
                <li><code>npm ci</code> clean install</li>
                <li>Run <strong>Vitest</strong> suite</li>
              </ul>
              <span className="stage-tag bg-emerald-subtle">Quality Gate</span>
            </div>

            <div className="pipeline-arrow"><ArrowRight size={18} /></div>

            {/* Stage 3: Build */}
            <div className="stage-card">
              <div className="stage-header">
                <Cpu className="stage-icon text-amber" size={18} />
                <span className="stage-title">3. Production Build</span>
              </div>
              <ul className="stage-items">
                <li>Vite React compilation</li>
                <li>Relative asset base path</li>
                <li>Upload artifact (<code>./dist</code>)</li>
              </ul>
              <span className="stage-tag bg-amber-subtle">Dist Bundler</span>
            </div>

            <div className="pipeline-arrow"><ArrowRight size={18} /></div>

            {/* Stage 4: Deploy */}
            <div className="stage-card">
              <div className="stage-header">
                <Cloud className="stage-icon text-sky" size={18} />
                <span className="stage-title">4. Deploy (CD)</span>
              </div>
              <ul className="stage-items">
                <li>Condition: <code>refs/heads/main</code></li>
                <li>OIDC auth (<code>id-token: write</code>)</li>
                <li>Deploy to <strong>GitHub Pages</strong></li>
              </ul>
              <span className="stage-tag bg-sky-subtle">Live Production</span>
            </div>
          </div>

          <div className="pipeline-config-note">
            <Code2 size={16} />
            <span>
              Configured in <code>.github/workflows/ci-cd.yml</code> using least-privilege permissions and supported actions (<code>actions/checkout@v4</code>, <code>actions/setup-node@v4</code>, <code>actions/deploy-pages@v4</code>).
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
