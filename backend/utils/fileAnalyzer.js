const crypto = require('crypto');

// 1. Cálculo de Entropía de Shannon (0.0 a 8.0)
function calculateEntropy(buffer) {
  if (!buffer || buffer.length === 0) return 0;
  const frequencies = new Array(256).fill(0);
  for (let i = 0; i < buffer.length; i++) {
    frequencies[buffer[i]]++;
  }
  let entropy = 0;
  for (let i = 0; i < 256; i++) {
    if (frequencies[i] > 0) {
      const p = frequencies[i] / buffer.length;
      entropy -= p * Math.log2(p);
    }
  }
  return parseFloat(entropy.toFixed(3));
}

// 2. Detección de Magic Bytes y tipo MIME real
function detectFileType(buffer) {
  if (buffer.length >= 2 && buffer[0] === 0x4D && buffer[1] === 0x5A) {
    return { ext: 'exe', mime: 'application/x-dosexec', type: 'Windows Executable / Dynamic Link Library (PE)' };
  }
  if (buffer.length >= 4 && buffer[0] === 0x7F && buffer[1] === 0x45 && buffer[2] === 0x4C && buffer[3] === 0x46) {
    return { ext: 'elf', mime: 'application/x-elf', type: 'Linux ELF Executable' };
  }
  if (buffer.length >= 4 && buffer.toString('utf8', 0, 4) === '%PDF') {
    return { ext: 'pdf', mime: 'application/pdf', type: 'Adobe Portable Document Format (PDF)' };
  }
  if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04) {
    return { ext: 'zip', mime: 'application/zip', type: 'ZIP Archive / Office OpenXML Document' };
  }
  if (buffer.length >= 8 && buffer[0] === 0xD0 && buffer[1] === 0xCF && buffer[2] === 0x11 && buffer[3] === 0xE0) {
    return { ext: 'doc', mime: 'application/msword', type: 'Microsoft Compound Binary File (Legacy Office / OLE)' };
  }
  if (buffer.length >= 2 && buffer[0] === 0x1F && buffer[1] === 0x8B) {
    return { ext: 'gz', mime: 'application/gzip', type: 'GZIP Compressed Archive' };
  }
  if (buffer.length >= 6 && buffer.toString('utf8', 0, 6).startsWith('7z')) {
    return { ext: '7z', mime: 'application/x-7z-compressed', type: '7-Zip Archive' };
  }
  if (buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return { ext: 'png', mime: 'image/png', type: 'PNG Image' };
  }
  if (buffer.length >= 3 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return { ext: 'jpg', mime: 'image/jpeg', type: 'JPEG Image' };
  }

  // Verificación de Scripts de texto plano
  const textSample = buffer.toString('utf8', 0, Math.min(buffer.length, 2048)).toLowerCase();
  if (textSample.includes('#!/bin/bash') || textSample.includes('#!/bin/sh')) {
    return { ext: 'sh', mime: 'application/x-sh', type: 'Shell Script' };
  }
  if (textSample.includes('powershell') || textSample.includes('invoke-expression') || textSample.includes('param(')) {
    return { ext: 'ps1', mime: 'text/x-powershell', type: 'PowerShell Script' };
  }
  if (textSample.includes('@echo off') || textSample.includes('setlocal')) {
    return { ext: 'bat', mime: 'application/x-bat', type: 'Windows Batch Script' };
  }

  return { ext: 'bin', mime: 'application/octet-stream', type: 'Generic Binary / Data File' };
}

// 3. Reglas Heurísticas y Detección de Patrones
function runHeuristicAnalysis(buffer, filename, declaredMime) {
  const findings = [];
  let threatScore = 0;
  const detectedType = detectFileType(buffer);
  const fileExt = filename.split('.').pop().toLowerCase();
  const rawString = buffer.toString('latin1');
  const lowerStr = rawString.toLowerCase();

  // A. Discrepancia de extensión / Spoofing de archivo
  const executableTypes = ['exe', 'elf', 'ps1', 'bat', 'sh'];
  const safeDocTypes = ['png', 'jpg', 'jpeg', 'pdf', 'txt', 'docx', 'xlsx'];

  if (safeDocTypes.includes(fileExt) && executableTypes.includes(detectedType.ext)) {
    findings.push({
      severity: 'CRITICAL',
      rule: 'Extension_MIME_Spoofing',
      description: `File extension is .${fileExt}, but true magic bytes identify it as a ${detectedType.type}. This is a deceptive attack vector designed to bypass user caution.`
    });
    threatScore += 45;
  }

  // B. Detección de doble extensión (e.g., invoice.pdf.exe)
  const doubleExtRegex = /\.(pdf|docx|xlsx|jpg|png|txt)\.(exe|scr|vbs|bat|ps1|cmd|jar|hta)$/i;
  if (doubleExtRegex.test(filename)) {
    findings.push({
      severity: 'HIGH',
      rule: 'Double_Extension_Evasion',
      description: `Double extension filename pattern detected (${filename}). Threat actors use this technique to disguise executables as documents.`
    });
    threatScore += 30;
  }

  // C. Análisis de Entropía (Empaquetado / Cifrado)
  const entropy = calculateEntropy(buffer);
  if (entropy >= 7.2 && (detectedType.ext === 'exe' || detectedType.ext === 'elf' || fileExt === 'exe' || fileExt === 'dll')) {
    findings.push({
      severity: 'HIGH',
      rule: 'High_Entropy_Packed_Payload',
      description: `Abnormally high entropy (${entropy} / 8.0). Indicates the binary is packed, obfuscated, or encrypted with a runtime protector (e.g. UPX, Themida, CobaltStrike beacon).`
    });
    threatScore += 25;
  } else if (entropy >= 7.6) {
    findings.push({
      severity: 'MEDIUM',
      rule: 'High_Entropy_Data',
      description: `High entropy score (${entropy} / 8.0) detected. Suggests encrypted payload or high-density compressed payload.`
    });
    threatScore += 10;
  }

  // D. Heurística para Ejecutables Windows (PE / DLL)
  if (detectedType.ext === 'exe' || fileExt === 'exe' || fileExt === 'dll') {
    const suspiciousApis = [
      { name: 'VirtualAlloc', weight: 10, desc: 'Allocates executable memory regions (commonly used in shellcode injection).' },
      { name: 'WriteProcessMemory', weight: 15, desc: 'Writes data into target processes for process hollowing or injection.' },
      { name: 'CreateRemoteThread', weight: 20, desc: 'Creates execution thread in a remote process (classic stealth injection).' },
      { name: 'URLDownloadToFile', weight: 15, desc: 'Silently downloads secondary payloads from the internet.' },
      { name: 'IsDebuggerPresent', weight: 5, desc: 'Anti-analysis mechanism to detect security debuggers and sandbox environments.' },
      { name: 'SetWindowsHookEx', weight: 10, desc: 'Hooks keyboard/mouse input (potential keylogger or monitoring agent).' },
      { name: 'AdjustTokenPrivileges', weight: 10, desc: 'Attempts to escalate Windows user rights to SeDebugPrivilege.' }
    ];

    suspiciousApis.forEach((api) => {
      if (rawString.includes(api.name)) {
        findings.push({
          severity: api.weight >= 15 ? 'HIGH' : 'MEDIUM',
          rule: `Suspicious_API_${api.name}`,
          description: `Suspicious Windows API reference detected: ${api.name}. ${api.desc}`
        });
        threatScore += api.weight;
      }
    });
  }

  // E. Heurística para Documentos PDF
  if (detectedType.ext === 'pdf' || fileExt === 'pdf') {
    if (lowerStr.includes('/javascript') || lowerStr.includes('/js')) {
      findings.push({
        severity: 'HIGH',
        rule: 'PDF_Embedded_JavaScript',
        description: 'PDF contains active JavaScript execution streams (/JavaScript or /JS). Legitimate PDFs rarely require automated scripts.'
      });
      threatScore += 30;
    }
    if (lowerStr.includes('/launch') || lowerStr.includes('/openaction')) {
      findings.push({
        severity: 'CRITICAL',
        rule: 'PDF_Auto_Execute_Action',
        description: 'PDF is configured to automatically launch commands or external executables upon opening (/OpenAction or /Launch).'
      });
      threatScore += 35;
    }
    if (lowerStr.includes('/embeddedfiles')) {
      findings.push({
        severity: 'MEDIUM',
        rule: 'PDF_Embedded_Binary_Files',
        description: 'PDF contains hidden embedded attachments (/EmbeddedFiles) that may execute payload droppers.'
      });
      threatScore += 15;
    }
  }

  // F. Heurística para Office (VBA Macros / OLE)
  if (detectedType.ext === 'doc' || fileExt === 'doc' || fileExt === 'docm' || fileExt === 'xlsm' || lowerStr.includes('vbaproject.bin')) {
    const macroTriggers = ['autoopen', 'workbook_open', 'document_open', 'autoexec'];
    const hasMacroTrigger = macroTriggers.some((trig) => lowerStr.includes(trig));

    if (hasMacroTrigger) {
      findings.push({
        severity: 'HIGH',
        rule: 'Office_Automated_VBA_Macro',
        description: 'Automated macro execution triggers detected (AutoOpen/Workbook_Open). Frequently used in malicious phishing attachments.'
      });
      threatScore += 30;
    }

    if (lowerStr.includes('wscript.shell') || lowerStr.includes('shell.application') || lowerStr.includes('powershell')) {
      findings.push({
        severity: 'CRITICAL',
        rule: 'Office_Macro_Shell_Execution',
        description: 'Office payload invokes system shell / PowerShell commands to download and execute secondary malware.'
      });
      threatScore += 40;
    }
  }

  // G. Heurística para Scripts (PowerShell / Batch / VBS)
  if (lowerStr.includes('-enc ') || lowerStr.includes('frombase64string')) {
    findings.push({
      severity: 'HIGH',
      rule: 'PowerShell_Base64_Obfuscation',
      description: 'Obfuscated Base64-encoded command execution detected. Used to bypass signature-based endpoint scanners.'
    });
    threatScore += 30;
  }
  if (lowerStr.includes('downloadstring') || lowerStr.includes('downloadfile') || lowerStr.includes('certutil -urlcache')) {
    findings.push({
      severity: 'HIGH',
      rule: 'Network_Stager_Dropper',
      description: 'Script contains remote stager command to retrieve remote payloads (DownloadString / certutil).'
    });
    threatScore += 30;
  }

  // H. Extracción de URLs e IPs sospechosas
  const urlRegex = /https?:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{6,}/g;
  const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;

  const foundUrls = Array.from(new Set(rawString.match(urlRegex) || [])).slice(0, 10);
  const foundIps = Array.from(new Set(rawString.match(ipRegex) || []))
    .filter((ip) => !ip.startsWith('127.') && !ip.startsWith('0.') && !ip.startsWith('255.'))
    .slice(0, 10);

  if (foundUrls.some((u) => u.includes('.xyz') || u.includes('.top') || u.includes('.ru') || u.includes('.cc'))) {
    findings.push({
      severity: 'MEDIUM',
      rule: 'Suspicious_TLD_Network_Artifact',
      description: 'Extracted embedded network links pointing to high-risk Top Level Domains (.xyz, .top, .ru).'
    });
    threatScore += 15;
  }

  // Normalización del Score
  const normalizedScore = Math.min(threatScore, 100);
  let verdict = 'Clean';
  if (normalizedScore >= 60) verdict = 'Malicious';
  else if (normalizedScore >= 20) verdict = 'Suspicious';

  return {
    verdict,
    threatScore: normalizedScore,
    entropy,
    detectedType,
    findings,
    networkIoCs: {
      urls: foundUrls,
      ips: foundIps
    }
  };
}

// 4. Verificación rápida de inteligencia de amenazas gratuita (Abuse.ch MalwareBazaar)
async function checkMalwareBazaar(sha256Hash) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch('https://mb-api.abuse.ch/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `query=get_info&hash=${sha256Hash}`,
      signal: controller.signal
    });
    clearTimeout(timeout);

    const data = await res.json();
    if (data.query_status === 'ok') {
      return {
        isKnownMalware: true,
        signature: data.data[0]?.signature || 'Known Malware Family',
        tags: data.data[0]?.tags || [],
        reporter: data.data[0]?.reporter || 'Threat Community'
      };
    }
  } catch (err) {
    // Si falla o se excede el timeout, continúa con el motor heurístico offline
  }
  return { isKnownMalware: false };
}

// 5. Orquestador de análisis completo
async function inspectFile(buffer, filename, declaredMime) {
  const md5 = crypto.createHash('md5').update(buffer).digest('hex');
  const sha1 = crypto.createHash('sha1').update(buffer).digest('hex');
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

  const heuristicResult = runHeuristicAnalysis(buffer, filename, declaredMime);
  const threatIntel = await checkMalwareBazaar(sha256);

  if (threatIntel.isKnownMalware) {
    heuristicResult.verdict = 'Malicious';
    heuristicResult.threatScore = 100;
    heuristicResult.findings.unshift({
      severity: 'CRITICAL',
      rule: 'Threat_Intel_Signature_Match',
      description: `Exact SHA-256 hash matched on Global Malware Database (Abuse.ch). Identified Malware Family: ${threatIntel.signature}`
    });
  }

  return {
    filename,
    fileSize: buffer.length,
    hashes: { md5, sha1, sha256 },
    entropy: heuristicResult.entropy,
    detectedType: heuristicResult.detectedType,
    verdict: heuristicResult.verdict,
    threatScore: heuristicResult.threatScore,
    threatIntel,
    findings: heuristicResult.findings,
    networkIoCs: heuristicResult.networkIoCs,
    analyzedAt: new Date().toISOString()
  };
}

module.exports = {
  inspectFile
};