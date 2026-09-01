import React, { useState, useRef } from 'react';
import Menu from '../components/Menu';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AnalyzeFile.css';

export default function AnalyzeFile({ user, onNavigate }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size exceeds the 25 MB limit.');
      return;
    }
    setSelectedFile(file);
    setReport(null);
  };

  const handleScan = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/api/analyze-file', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setReport(data.report);
      } else {
        toast.error(data.error || 'Failed to inspect file');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error to file inspection engine');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="analyzer-page-layout">
      <Menu activeItem="analyze-file" onNavigate={onNavigate} user={user} />

      <main className="analyzer-content-area">
        <div className="analyzer-header">
          <h1 className="analyzer-title">Static File & Malware Inspector</h1>
          <p className="analyzer-desc">
            Deep heuristic inspection, true MIME detection, Shannon entropy measurement, and threat signature analysis.
          </p>
        </div>

        {!report ? (
          <div className="analyzer-upload-card">
            <div
              className={`drop-zone ${dragActive ? 'active' : ''} ${selectedFile ? 'has-file' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])}
              />

              <div className="drop-zone-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>

              {selectedFile ? (
                <div className="selected-file-details">
                  <span className="file-name-text">{selectedFile.name}</span>
                  <span className="file-size-text">{formatBytes(selectedFile.size)}</span>
                </div>
              ) : (
                <div className="drop-zone-instructions">
                  <p className="primary-instruction">Drag & Drop any suspicious file here, or click to browse</p>
                  <p className="secondary-instruction">Supports Executables (.exe, .elf), Office docs (.doc, .xls), PDFs, Archives, and Scripts (up to 25 MB)</p>
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="upload-action-row">
                <button
                  className="start-scan-btn"
                  onClick={handleScan}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <span className="loading-spinner-row">
                      <span className="spinner-dot"></span> Analyzing file heuristics...
                    </span>
                  ) : (
                    'Run Security Inspection'
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="inspection-results-wrapper">
            {/* 1. Verdict Banner */}
            <div className={`verdict-banner-card ${report.verdict.toLowerCase()}`}>
              <div className="verdict-gauge-box">
                <div className="verdict-score-ring">
                  <span>{report.threatScore}</span>
                  <small>/100</small>
                </div>
              </div>
              <div className="verdict-info-block">
                <span className="verdict-status-tag">{report.verdict.toUpperCase()}</span>
                <h2 className="verdict-heading">
                  {report.verdict === 'Clean'
                    ? 'No malicious patterns or high-risk IoCs identified'
                    : report.verdict === 'Suspicious'
                    ? 'Suspicious structural anomalies or capabilities detected'
                    : 'Critical threat signatures or exploit indicators identified'}
                </h2>
                <p className="verdict-meta-line">
                  Analyzed: <strong>{report.filename}</strong> ({formatBytes(report.fileSize)}) — {new Date(report.analyzedAt).toLocaleTimeString()}
                </p>
              </div>
              <button className="reset-scan-btn" onClick={() => { setSelectedFile(null); setReport(null); }}>
                Inspect Another File
              </button>
            </div>

            {/* 2. Grid de detalles */}
            <div className="report-grid-container">
              {/* Findings & Rule Violations */}
              <div className="report-section-card findings-card">
                <h3 className="section-card-title">Threat Indicators & Heuristics ({report.findings.length})</h3>
                {report.findings.length === 0 ? (
                  <div className="clean-findings-msg">✓ No malicious shellcode, dangerous APIs, or evasion techniques detected.</div>
                ) : (
                  <div className="findings-list">
                    {report.findings.map((f, i) => (
                      <div key={i} className={`finding-item-row ${f.severity.toLowerCase()}`}>
                        <div className="finding-header">
                          <span className={`finding-badge ${f.severity.toLowerCase()}`}>{f.severity}</span>
                          <span className="finding-rule-name">{f.rule}</span>
                        </div>
                        <p className="finding-desc">{f.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* File Identity & Hashes */}
              <div className="report-section-card identity-card">
                <h3 className="section-card-title">File Structure & Cryptographic Hashes</h3>
                
                <div className="meta-prop-row">
                  <span className="meta-label">Detected Format:</span>
                  <span className="meta-value">{report.detectedType.type}</span>
                </div>
                <div className="meta-prop-row">
                  <span className="meta-label">MIME Signature:</span>
                  <span className="meta-value"><code>{report.detectedType.mime}</code></span>
                </div>

                <div className="meta-prop-row entropy-row">
                  <span className="meta-label">Shannon Entropy:</span>
                  <span className="meta-value">
                    <strong>{report.entropy}</strong> / 8.0 
                    <span className="entropy-tag">
                      {report.entropy >= 7.2 ? 'Packed / Encrypted' : 'Normal Uniformity'}
                    </span>
                  </span>
                </div>

                <div className="hash-block-wrapper">
                  <div className="hash-row">
                    <span className="hash-label">MD5</span>
                    <code className="hash-value">{report.hashes.md5}</code>
                    <button className="hash-copy-btn" onClick={() => copyToClipboard(report.hashes.md5, 'MD5')}>Copy</button>
                  </div>
                  <div className="hash-row">
                    <span className="hash-label">SHA-1</span>
                    <code className="hash-value">{report.hashes.sha1}</code>
                    <button className="hash-copy-btn" onClick={() => copyToClipboard(report.hashes.sha1, 'SHA-1')}>Copy</button>
                  </div>
                  <div className="hash-row">
                    <span className="hash-label">SHA-256</span>
                    <code className="hash-value">{report.hashes.sha256}</code>
                    <button className="hash-copy-btn" onClick={() => copyToClipboard(report.hashes.sha256, 'SHA-256')}>Copy</button>
                  </div>
                </div>

                {/* Network IoCs if any */}
                {report.networkIoCs && (report.networkIoCs.urls.length > 0 || report.networkIoCs.ips.length > 0) && (
                  <div className="network-iocs-block">
                    <h4 className="sub-section-title">Embedded Network Artifacts</h4>
                    {report.networkIoCs.urls.map((u, i) => (
                      <div key={i} className="ioc-tag url">URL: {u}</div>
                    ))}
                    {report.networkIoCs.ips.map((ip, i) => (
                      <div key={i} className="ioc-tag ip">IP: {ip}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={2000} theme="dark" />
      </main>
    </div>
  );
}