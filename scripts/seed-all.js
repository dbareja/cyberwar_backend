const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../config/database');
const Blog = require('../models/Blog');
const Category = require('../models/Category');
const User = require('../models/User');

// Categories data
const categories = [
  {
    name: 'Malware',
    slug: 'malware',
    description: 'Latest malware threats, analysis, and removal techniques',
    color: '#dc2626',
    icon: '🦠',
    isActive: true
  },
  {
    name: 'Data Breach',
    slug: 'data-breach',
    description: 'Major data breaches, leaks, and incident reports',
    color: '#ea580c',
    icon: '🔓',
    isActive: true
  },
  {
    name: 'Network Security',
    slug: 'network-security',
    description: 'Network protection, firewalls, and infrastructure security',
    color: '#0891b2',
    icon: '🛡️',
    isActive: true
  },
  {
    name: 'Vulnerabilities',
    slug: 'vulnerabilities',
    description: 'CVEs, zero-days, and security patches',
    color: '#7c3aed',
    icon: '⚠️',
    isActive: true
  },
  {
    name: 'Threat Intelligence',
    slug: 'threat-intelligence',
    description: 'APT groups, cyber espionage, and threat actor analysis',
    color: '#059669',
    icon: '🎯',
    isActive: true
  }
];

// Working Pexels image URLs
const images = {
  malware: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1200',
  breach: 'https://images.pexels.com/photos/5380668/pexels-photo-5380668.jpeg?auto=compress&cs=tinysrgb&w=1200',
  network: 'https://images.pexels.com/photos/326501/pexels-photo-326501.jpeg?auto=compress&cs=tinysrgb&w=1200',
  vulnerability: 'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1200',
  threat: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1200'
};

// Latest articles data
const latestArticles = [
  {
    title: 'CISA Adds 5 New Vulnerabilities to KEV Catalog Including Critical Windows Bug',
    slug: 'cisa-adds-5-new-vulnerabilities-kev',
    excerpt: 'The U.S. Cybersecurity and Infrastructure Security Agency has added five new vulnerabilities to its Known Exploited Vulnerabilities catalog, including a critical Windows privilege escalation flaw actively exploited in the wild.',
    content: `The U.S. Cybersecurity and Infrastructure Security Agency (CISA) has expanded its Known Exploited Vulnerabilities (KEV) catalog with five new entries, urging federal agencies and organizations to patch these critical security flaws immediately.

Among the newly added vulnerabilities is a critical Windows privilege escalation flaw (CVE-2024-XXXX) that has been actively exploited by threat actors to gain elevated system privileges. The vulnerability affects multiple Windows versions and allows attackers to execute arbitrary code with SYSTEM-level permissions.

CISA has mandated that Federal Civilian Executive Branch (FCEB) agencies apply patches for these vulnerabilities within the next three weeks, by April 15, 2025. The requirement is part of Binding Operational Directive 22-01, which establishes a catalog of known exploited vulnerabilities and requires remediation within specific timeframes.

Security researchers have noted that threat actors are increasingly targeting these known vulnerabilities because many organizations fail to apply patches promptly. The KEV catalog serves as a prioritized list of vulnerabilities that require immediate attention due to active exploitation.

Organizations are advised to:
- Review the updated KEV catalog
- Identify affected systems in their environment
- Apply available patches immediately
- Implement compensating controls where patches cannot be immediately applied
- Monitor for indicators of compromise related to these vulnerabilities`,
    featuredImage: images.vulnerability,
    category: null, // Will be set to Vulnerabilities
    author: { name: 'CyberWar Admin', email: 'admin@cyberwar.com' },
    status: 'published',
    isFeatured: false,
    isTrending: false,
    isBreaking: true,
    viewCount: 1250,
    readTime: '5 min read',
    tags: ['CISA', 'Windows', 'Privilege Escalation', 'KEV']
  },
  {
    title: 'Major Healthcare Provider Hit by Ransomware, 2.3M Patient Records Exposed',
    slug: 'healthcare-ransomware-2-3m-records-exposed',
    excerpt: 'A major U.S. healthcare provider has disclosed a ransomware attack that compromised the personal and medical information of approximately 2.3 million patients.',
    content: `In one of the largest healthcare data breaches of 2025, a major U.S. healthcare provider has confirmed that a sophisticated ransomware attack has compromised the sensitive personal and medical information of approximately 2.3 million patients.

The attack, which occurred in late February 2025, remained undetected for nearly two weeks, allowing threat actors to exfiltrate substantial amounts of data including names, dates of birth, Social Security numbers, medical records, insurance information, and treatment details.

The healthcare provider, which operates 15 hospitals and over 100 clinics across the Midwest, has notified affected patients and is offering complimentary credit monitoring and identity theft protection services. The company has also engaged leading cybersecurity firms to investigate the incident and strengthen its security posture.

The ransomware gang responsible, identified as "MediCrypt" by threat intelligence analysts, has demanded a $15 million ransom payment. The healthcare provider has stated it will not pay the ransom, citing FBI recommendations and the risk that payment does not guarantee data deletion.

This incident highlights the continued targeting of healthcare organizations by ransomware operators, who view them as high-value targets due to the sensitive nature of medical data and the critical need for operational uptime. Healthcare entities are urged to implement robust backup strategies, network segmentation, and employee security training to mitigate such risks.`,
    featuredImage: images.breach,
    category: null, // Will be set to Data Breach
    author: { name: 'CyberWar Admin', email: 'admin@cyberwar.com' },
    status: 'published',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    viewCount: 3400,
    readTime: '6 min read',
    tags: ['Ransomware', 'Healthcare', 'Data Breach', 'Patient Records']
  },
  {
    title: "New 'ShadowGate' APT Group Targets Critical Infrastructure with Custom Malware",
    slug: 'shadowgate-apt-critical-infrastructure',
    excerpt: 'Cybersecurity researchers have uncovered a previously unknown APT group, dubbed ShadowGate, targeting energy and water utilities with sophisticated custom malware.',
    content: `A newly discovered advanced persistent threat (APT) group, dubbed "ShadowGate" by researchers at SecureWorks, has been conducting a multi-year campaign targeting critical infrastructure organizations across North America and Europe.

The threat actor employs sophisticated custom malware specifically designed to target industrial control systems (ICS) used in energy generation facilities and water treatment plants. The malware, named "FlowControl," is capable of manipulating process control parameters and disabling safety systems.

Analysis of the group's tactics, techniques, and procedures (TTPs) suggests possible nation-state sponsorship, with indicators pointing to Eastern European origins. The attackers demonstrate advanced capabilities including zero-day exploitation, supply chain compromises, and long-term persistence in victim networks.

ShadowGate has successfully compromised at least 12 critical infrastructure organizations since 2022, maintaining access for an average of 8 months before detection. The group primarily gains initial access through spear-phishing emails targeting engineers and technicians with industry-specific lure documents.

The discovery has prompted alerts from CISA, the FBI, and Europol, warning critical infrastructure operators to enhance monitoring for the identified indicators of compromise and review network segmentation between IT and OT environments.

Organizations are advised to:
- Implement strict network segmentation between IT and OT networks
- Deploy continuous monitoring for ICS-specific threats
- Conduct regular tabletop exercises for cyber-physical incidents
- Review and update incident response plans for ICS environments`,
    featuredImage: images.threat,
    category: null, // Will be set to Threat Intelligence
    author: { name: 'CyberWar Admin', email: 'admin@cyberwar.com' },
    status: 'published',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    viewCount: 2800,
    readTime: '7 min read',
    tags: ['APT', 'Critical Infrastructure', 'ICS', 'Malware', 'ShadowGate']
  },
  {
    title: "Critical OpenSSH Vulnerability Allows Remote Code Execution on Linux Servers",
    slug: 'openssh-rce-vulnerability-linux-servers',
    excerpt: 'A newly disclosed vulnerability in OpenSSH could allow unauthenticated remote attackers to execute arbitrary code with root privileges on affected Linux systems.',
    content: `A critical vulnerability (CVE-2025-XXXX) in OpenSSH, the widely-used secure shell implementation, has been disclosed that enables unauthenticated remote attackers to execute arbitrary code with root privileges on vulnerable Linux and Unix systems.

The vulnerability, present in OpenSSH versions 8.5 through 9.6, is caused by a race condition in the server's signal handler. Successful exploitation does not require user interaction or authentication, making it particularly dangerous for internet-exposed systems.

Security researchers have developed a working proof-of-concept exploit that demonstrates reliable code execution within minutes of targeting a vulnerable system. While mass exploitation has not yet been observed, threat actors are expected to rapidly incorporate this vulnerability into their attack arsenals.

Major Linux distributions including Red Hat, Ubuntu, and Debian have released emergency security updates. Administrators are urged to immediately apply patches or implement temporary workarounds, which include disabling the vulnerable authentication mechanism or restricting SSH access to trusted networks.

CISA has added this vulnerability to its Known Exploited Vulnerabilities catalog and requires federal agencies to remediate within 24 hours. The agency has also published detection signatures to help organizations identify exploitation attempts.

Organizations should:
- Immediately inventory all OpenSSH installations
- Apply vendor patches as soon as possible
- Implement network segmentation for SSH access
- Monitor for suspicious SSH connection patterns
- Consider disabling password authentication in favor of key-based auth`,
    featuredImage: images.vulnerability,
    category: null, // Will be set to Vulnerabilities
    author: { name: 'CyberWar Admin', email: 'admin@cyberwar.com' },
    status: 'published',
    isFeatured: false,
    isTrending: false,
    isBreaking: true,
    viewCount: 5200,
    readTime: '4 min read',
    tags: ['OpenSSH', 'RCE', 'Linux', 'Privilege Escalation', 'CVE']
  },
  {
    title: "Banking Trojan 'GoldDigger' Steals Millions Through Mobile App Hijacking",
    slug: 'golddigger-banking-trojan-mobile-apps',
    excerpt: 'A sophisticated Android banking trojan has stolen over $12 million from victims by hijacking legitimate banking apps and intercepting 2FA codes.',
    content: `Cybersecurity firm ThreatFabric has uncovered a highly sophisticated Android banking trojan, dubbed "GoldDigger," that has successfully stolen over $12 million from victims across Europe and Asia since mid-2024.

The malware employs advanced techniques including overlay attacks, screen recording, and SMS interception to harvest banking credentials and bypass two-factor authentication protections. GoldDigger specifically targets 65 different banking and cryptocurrency applications.

Once installed, typically through malicious apps on third-party app stores or SMS phishing campaigns, GoldDigger requests extensive permissions including accessibility services access. It then monitors for the launch of targeted banking apps, overlaying fake login screens to capture credentials.

The malware's most concerning feature is its ability to intercept and forward SMS-based 2FA codes to attacker-controlled infrastructure in real-time, allowing fraudsters to complete unauthorized transactions even on accounts with strong authentication protections.

Victims typically remain unaware of the compromise until fraudulent transactions appear on their statements. The average loss per victim is approximately $4,500, with some business accounts seeing losses exceeding $100,000.

Android users are advised to:
- Install apps only from the official Google Play Store
- Review app permissions carefully before granting access
- Use authenticator apps instead of SMS for 2FA
- Monitor bank statements regularly for unauthorized transactions
- Keep devices updated with the latest security patches`,
    featuredImage: images.malware,
    category: null, // Will be set to Malware
    author: { name: 'CyberWar Admin', email: 'admin@cyberwar.com' },
    status: 'published',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    viewCount: 4100,
    readTime: '5 min read',
    tags: ['Banking Trojan', 'Android', 'Mobile Malware', '2FA Bypass', 'GoldDigger']
  }
];

// Trending articles (subset of latest with higher view counts)
const trendingArticles = [
  {
    title: "Zero-Day Exploit for Chrome Sells for $2.5 Million on Dark Web",
    slug: 'chrome-zero-day-2-5-million-dark-web',
    excerpt: 'A fully functional zero-day exploit targeting Google Chrome has been listed for sale on an underground forum, representing one of the highest prices ever seen for a browser vulnerability.',
    content: `A threat actor has listed a zero-day exploit targeting Google Chrome on a prominent underground forum, asking $2.5 million for the exclusive rights to the vulnerability. If legitimate, this represents one of the highest prices ever observed for a browser exploit on the criminal market.

The seller claims the exploit achieves remote code execution on fully patched Chrome versions running on Windows, macOS, and Linux. The vulnerability is described as a type confusion bug in Chrome's JavaScript engine that bypasses all current sandbox protections.

Threat intelligence analysts are treating the listing as credible based on the seller's reputation and provided proof-of-concept demonstrations. The high price point suggests the vulnerability may also affect other Chromium-based browsers including Microsoft Edge, Brave, and Opera.

Google's Threat Analysis Group has been notified and is investigating the claims. The company has not yet confirmed the vulnerability or issued an emergency patch.

If the exploit is purchased by a cybercriminal group, it could enable widespread malware distribution through malicious websites and drive-by downloads. Users are advised to enable Chrome's enhanced safe browsing protection and avoid downloading files from untrusted sources.

The incident highlights the lucrative market for zero-day exploits, where nation-states, criminal groups, and private surveillance companies compete for exclusive access to unpatched vulnerabilities.`,
    featuredImage: images.network,
    category: null,
    author: { name: 'CyberWar Admin', email: 'admin@cyberwar.com' },
    status: 'published',
    isFeatured: false,
    isTrending: true,
    isBreaking: true,
    viewCount: 8900,
    readTime: '4 min read',
    tags: ['Zero-Day', 'Chrome', 'Exploit', 'Dark Web', 'RCE']
  },
  {
    title: "Fortune 500 Company Loses $45M in Deepfake-Enabled CEO Fraud",
    slug: 'fortune-500-deepfake-ceo-fraud-45m',
    excerpt: 'Attackers used AI-generated video of a CEO to authorize fraudulent wire transfers, resulting in the largest known deepfake-enabled business email compromise.',
    content: `A multinational Fortune 500 corporation has disclosed that it lost $45 million to a sophisticated business email compromise (BEC) scheme that employed AI-generated deepfake video of the company's CEO to authorize fraudulent wire transfers.

The attack began with traditional email compromise of the company's finance department. Attackers then escalated the scheme by creating a convincing deepfake video of the CEO during a fabricated "emergency video call" with the CFO, requesting urgent transfers for a supposed confidential acquisition.

The deepfake technology replicated the CEO's voice, facial expressions, and mannerisms with sufficient fidelity to convince the CFO and multiple finance team members during a 15-minute video conference. Three wire transfers totaling $45 million were executed to accounts in Hong Kong before the fraud was discovered.

This incident represents the first publicly confirmed case of deepfake video being used in a successful BEC attack at this scale. Law enforcement agencies and cybersecurity firms are warning that such attacks are likely to become more common as generative AI tools become more accessible.

Organizations are urged to implement enhanced verification procedures for large financial transactions, including:
- Out-of-band verification through separate communication channels
- Multi-person approval requirements for wire transfers
- Video call authentication protocols including secret codes
- Regular employee training on emerging social engineering techniques
- AI-generated media detection tools`,
    featuredImage: images.breach,
    category: null,
    author: { name: 'CyberWar Admin', email: 'admin@cyberwar.com' },
    status: 'published',
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    viewCount: 7600,
    readTime: '6 min read',
    tags: ['Deepfake', 'BEC', 'CEO Fraud', 'AI', 'Social Engineering']
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    
    // Clear existing data
    await Category.deleteMany({});
    await Blog.deleteMany({});
    console.log('Cleared existing categories and articles');
    
    // Create admin user first
    let adminUser = await User.findOne({ email: 'admin@cyberwar.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'CyberWar Admin',
        email: 'admin@cyberwar.com',
        password: 'Admin@123456',
        role: 'admin',
        isActive: true
      });
      console.log('✅ Created admin user');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
    
    // Seed categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Added ${createdCategories.length} categories`);
    
    // Create category map
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });
    
    // Assign categories and proper author to latest articles
    // Categories: vulnerabilities, data-breach, threat-intelligence, malware, network-security
    const latestWithCategories = latestArticles.map((article, index) => ({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featuredImage: article.featuredImage,
      category: categoryMap[['vulnerabilities', 'data-breach', 'threat-intelligence', 'malware', 'network-security'][index]],
      author: adminUser._id,
      status: article.status,
      isFeatured: article.isFeatured,
      isTrending: article.isTrending,
      isBreaking: article.isBreaking,
      viewCount: article.viewCount,
      tags: [],
      publishedAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000))
    }));
    
    // Seed latest articles
    const createdLatest = await Blog.insertMany(latestWithCategories);
    console.log(`✅ Added ${createdLatest.length} latest articles`);
    
    // Assign categories and proper author to trending articles
    // All 5 categories get trending articles too
    const trendingWithCategories = trendingArticles.map((article, index) => ({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featuredImage: article.featuredImage,
      category: categoryMap[['vulnerabilities', 'threat-intelligence'][index]],
      author: adminUser._id,
      status: article.status,
      isFeatured: article.isFeatured,
      isTrending: article.isTrending,
      isBreaking: article.isBreaking,
      viewCount: article.viewCount,
      tags: [],
      publishedAt: new Date(Date.now() - ((index + 5) * 24 * 60 * 60 * 1000))
    }));
    
    // Seed trending articles
    const createdTrending = await Blog.insertMany(trendingWithCategories);
    console.log(`✅ Added ${createdTrending.length} trending articles`);
    
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Latest Articles: ${createdLatest.length}`);
    console.log(`   Trending Articles: ${createdTrending.length}`);
    console.log(`   Total Articles: ${createdLatest.length + createdTrending.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seedDatabase();
