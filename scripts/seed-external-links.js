const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');
const ExternalLink = require('./models/ExternalLink');

const externalLinks = [
  {
    title: 'CISA Warns of Active Exploitation in Ivanti VPN vulnerabilities',
    description: 'US Cybersecurity agency adds three Ivanti Connect Secure VPN flaws to its KEV catalog amid active exploitation in the wild.',
    url: 'https://www.cisa.gov/news-events/cybersecurity-advisories',
    category: 'news',
    icon: '🔐',
    priority: 10
  },
  {
    title: 'Microsoft Patch Tuesday: 150+ Vulnerabilities Fixed',
    description: 'March 2025 security updates address critical remote code execution flaws in Windows, Office, and Edge.',
    url: 'https://msrc.microsoft.com/update-guide',
    category: 'news',
    icon: '🪟',
    priority: 9
  },
  {
    title: 'New APT Group Targeting Asian Governments Discovered',
    description: 'Researchers uncover sophisticated cyber espionage campaign using custom malware and zero-day exploits.',
    url: 'https://www.threatintel.com/apt-asia-2025',
    category: 'news',
    icon: '🎯',
    priority: 10
  },
  {
    title: 'Ransomware Gangs Shift Focus to Cloud Infrastructure',
    description: 'Analysis shows 60% increase in attacks targeting AWS, Azure, and Google Cloud environments.',
    url: 'https://www.ransomwaretracker.com/cloud-report',
    category: 'news',
    icon: '☁️',
    priority: 8
  },
  {
    title: 'Critical OpenSSL Vulnerability Allows Remote Code Execution',
    description: 'CVE-2025-XXXX enables attackers to execute arbitrary code on affected systems. Immediate patching advised.',
    url: 'https://www.openssl.org/news/vulnerabilities.html',
    category: 'news',
    icon: '🔒',
    priority: 10
  },
  {
    title: 'FBI Alerts on Deepfake-Enhanced Business Email Compromise',
    description: 'Cybercriminals using AI-generated audio and video to impersonate executives in sophisticated BEC attacks.',
    url: 'https://www.ic3.gov/Media/News',
    category: 'news',
    icon: '🎭',
    priority: 9
  },
  {
    title: 'Google Chrome Zero-Day Exploited in Wild',
    description: 'Emergency security update released for high-severity type confusion vulnerability affecting billions of users.',
    url: 'https://chromereleases.googleblog.com/',
    category: 'news',
    icon: '🌐',
    priority: 10
  },
  {
    title: 'Supply Chain Attack Compromises Popular NPM Packages',
    description: 'Malicious code injected into widely-used JavaScript libraries affecting thousands of applications.',
    url: 'https://www.npmjs.com/advisories',
    category: 'news',
    icon: '📦',
    priority: 8
  },
  {
    title: 'Critical Infrastructure Sectors Face Rising ICS Malware Threats',
    description: 'Dragos report highlights increase in industrial control system targeted malware in energy and water sectors.',
    url: 'https://www.dragos.com/threat-intelligence/',
    category: 'news',
    icon: '🏭',
    priority: 9
  },
  {
    title: 'T-Mobile Investigates Data Breach Affecting 37 Million Customers',
    description: 'Unauthorized API access exposed customer data including names, addresses, and account information.',
    url: 'https://www.t-mobile.com/responsibility/legal/privacy-center',
    category: 'news',
    icon: '📱',
    priority: 8
  },
  {
    title: 'New AI-Powered Phishing Campaign Targets Banking Customers',
    description: 'Machine learning used to create highly personalized phishing emails bypassing traditional filters.',
    url: 'https://www.phishing-labs.com/reports/2025',
    category: 'news',
    icon: '🎣',
    priority: 7
  },
  {
    title: 'GitHub Repository Secrets Exposed in Mass Scan',
    description: 'Security researchers find thousands of API keys, passwords, and tokens in public code repositories.',
    url: 'https://github.blog/security/',
    category: 'news',
    icon: '⚠️',
    priority: 8
  },
  {
    title: 'Apple Releases Emergency iOS Security Updates',
    description: 'Zero-click vulnerabilities in iMessage could allow device takeover without user interaction.',
    url: 'https://support.apple.com/en-us/HT201222',
    category: 'news',
    icon: '🍎',
    priority: 10
  },
  {
    title: 'Dark Web Marketplace Dismantled in International Operation',
    description: 'Law enforcement agencies seize servers and arrest administrators of major cybercrime marketplace.',
    url: 'https://www.europol.europa.eu/media-press/newsroom',
    category: 'news',
    icon: '🕵️',
    priority: 7
  },
  {
    title: 'Kubernetes Cluster Misconfigurations Lead to Cloud Breaches',
    description: 'Study reveals 80% of Kubernetes deployments have at least one critical security misconfiguration.',
    url: 'https://kubernetes.io/docs/concepts/security/',
    category: 'news',
    icon: '⚓',
    priority: 8
  },
  {
    title: 'Intel Processor Vulnerability Enables Data Theft',
    description: "New side-channel attack dubbed 'Downfall' can steal encryption keys from affected CPUs.",
    url: 'https://www.intel.com/content/www/us/en/security-center/',
    category: 'news',
    icon: '💻',
    priority: 9
  },
  {
    title: 'Healthcare Sector Under Siege from Ransomware Gangs',
    description: 'Hospitals and clinics face unprecedented wave of attacks disrupting patient care operations.',
    url: 'https://www.hhs.gov/about/news/cybersecurity/',
    category: 'news',
    icon: '🏥',
    priority: 10
  },
  {
    title: 'DDoS Attacks Reach Record-Breaking 3.8 Tbps',
    description: 'Akamai mitigates largest ever DDoS attack targeting European gaming company infrastructure.',
    url: 'https://www.akamai.com/newsroom/security-research',
    category: 'news',
    icon: '🌊',
    priority: 8
  },
  {
    title: 'New Android Malware Steals Banking Credentials',
    description: 'Trojan poses as legitimate banking app to intercept 2FA codes and drain victim accounts.',
    url: 'https://www.android.com/security/',
    category: 'news',
    icon: '🤖',
    priority: 9
  },
  {
    title: 'NIST Releases Updated Cybersecurity Framework 2.0',
    description: 'Major revision adds governance dimension and emphasizes supply chain security requirements.',
    url: 'https://www.nist.gov/cyberframework',
    category: 'news',
    icon: '📋',
    priority: 7
  }
];

async function seedExternalLinks() {
  try {
    await connectDB();
    
    // Clear existing news links
    await ExternalLink.deleteMany({ category: 'news' });
    console.log('Cleared existing news links');
    
    // Insert new links
    const result = await ExternalLink.insertMany(externalLinks);
    console.log(`✅ Added ${result.length} external links`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding external links:', error.message);
    process.exit(1);
  }
}

seedExternalLinks();
