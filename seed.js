require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Tag = require('./models/Tag');
const Blog = require('./models/Blog');

const connectDB = require('./config/database');

const categories = [
  { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Latest cybersecurity news and threats', color: '#dc2626', icon: '🛡️' },
  { name: 'Malware', slug: 'malware', description: 'Malware analysis and reports', color: '#7c3aed', icon: '🦠' },
  { name: 'Ransomware', slug: 'ransomware', description: 'Ransomware attacks and defenses', color: '#d97706', icon: '💀' },
  { name: 'Data Breach', slug: 'data-breach', description: 'Data breach incidents and analysis', color: '#059669', icon: '🔓' },
  { name: 'Vulnerabilities', slug: 'vulnerabilities', description: 'CVE and vulnerability disclosures', color: '#2563eb', icon: '⚠️' },
  { name: 'Nation State', slug: 'nation-state', description: 'State-sponsored cyber attacks', color: '#dc2626', icon: '🏛️' },
  { name: 'Threat Intelligence', slug: 'threat-intelligence', description: 'Threat intelligence and analysis', color: '#0891b2', icon: '🔍' },
  { name: 'Zero Day', slug: 'zero-day', description: 'Zero-day exploits and patches', color: '#9333ea', icon: '🔥' }
];

const tags = [
  { name: 'apt', slug: 'apt', color: '#dc2626' },
  { name: 'phishing', slug: 'phishing', color: '#d97706' },
  { name: 'exploit', slug: 'exploit', color: '#7c3aed' },
  { name: 'patch', slug: 'patch', color: '#059669' },
  { name: 'russia', slug: 'russia', color: '#dc2626' },
  { name: 'china', slug: 'china', color: '#d97706' },
  { name: 'iran', slug: 'iran', color: '#059669' },
  { name: 'critical infrastructure', slug: 'critical-infrastructure', color: '#2563eb' },
  { name: 'healthcare', slug: 'healthcare', color: '#0891b2' },
  { name: 'finance', slug: 'finance', color: '#9333ea' },
  { name: 'iot', slug: 'iot', color: '#6b7280' },
  { name: 'zero-trust', slug: 'zero-trust', color: '#374151' }
];

const sampleBlogs = [
  {
    title: 'Russian APT Group Targets NATO Infrastructure with New Malware Campaign',
    excerpt: 'A sophisticated Russian advanced persistent threat (APT) group has been identified conducting a large-scale campaign targeting NATO member countries\' critical infrastructure.',
    content: `<p>Security researchers have uncovered a sophisticated campaign by a Russian-linked advanced persistent threat (APT) group targeting critical infrastructure across multiple NATO member countries. The campaign, which has been active for several months, employs previously undocumented malware and novel persistence mechanisms.</p>
    
    <h2>Campaign Overview</h2>
    <p>The threat actor, tracked as SANDSTORM-7, has been observed deploying a multi-stage malware framework that begins with spear-phishing emails targeting government and defense contractors. The initial payload is a dropper that establishes persistence before downloading additional modules.</p>
    
    <h2>Technical Analysis</h2>
    <p>The malware uses encrypted command-and-control communications and employs living-off-the-land techniques to evade detection. Security teams have identified the use of legitimate Windows tools including PowerShell, WMI, and Scheduled Tasks for lateral movement.</p>
    
    <h2>Indicators of Compromise</h2>
    <ul>
      <li>SHA256: a1b2c3d4e5f6789012345678901234567890abcd</li>
      <li>C2 Domain: update-security[.]net</li>
      <li>IP: 185.220.xxx.xxx</li>
    </ul>
    
    <h2>Mitigation</h2>
    <p>Organizations are advised to update all systems, implement multi-factor authentication, and monitor for the listed indicators of compromise. Network segmentation and zero-trust architectures are recommended.</p>`,
    status: 'published',
    isFeatured: true,
    isBreaking: true,
    isTrending: true,
    viewCount: 15420
  },
  {
    title: 'Critical Zero-Day Vulnerability Found in Microsoft Exchange Server',
    excerpt: 'Microsoft has issued an emergency patch for a critical zero-day vulnerability in Exchange Server that is being actively exploited in the wild by multiple threat actors.',
    content: `<p>Microsoft has released an emergency out-of-band security update to address a critical zero-day vulnerability in Exchange Server. The flaw, tracked as CVE-2024-XXXXX, has been actively exploited by multiple threat actors since before the patch was available.</p>
    
    <h2>Vulnerability Details</h2>
    <p>The vulnerability exists in the Exchange Server NTLM authentication mechanism and allows unauthenticated remote code execution. An attacker could exploit this flaw by sending a specially crafted HTTP request to a vulnerable Exchange server.</p>
    
    <h2>CVSS Score: 9.8 (Critical)</h2>
    <p>The vulnerability has been assigned a CVSS score of 9.8, reflecting its critical severity. All versions of Exchange Server 2016, 2019, and Exchange Online configurations are affected.</p>
    
    <h2>Exploitation in the Wild</h2>
    <p>Microsoft's Threat Intelligence team has observed multiple threat actor groups exploiting this vulnerability, including nation-state actors and ransomware groups. The exploitation attempts have targeted organizations in the financial, healthcare, and government sectors.</p>
    
    <h2>Remediation Steps</h2>
    <ol>
      <li>Apply the emergency patch immediately</li>
      <li>Review Exchange Server logs for exploitation attempts</li>
      <li>Implement temporary mitigations if patching is not immediately possible</li>
      <li>Monitor for post-exploitation activity</li>
    </ol>`,
    status: 'published',
    isFeatured: true,
    isBreaking: true,
    viewCount: 12890
  },
  {
    title: 'Major US Healthcare Provider Hit by LockBit Ransomware Attack',
    excerpt: 'One of America\'s largest healthcare networks has been struck by a LockBit ransomware attack, compromising patient data and disrupting operations across 50+ hospitals.',
    content: `<p>MediCare National Health Systems, one of the United States' largest healthcare networks, has disclosed a significant ransomware attack carried out by the LockBit 3.0 group. The attack has affected operations across more than 50 hospitals and medical facilities.</p>
    
    <h2>Attack Timeline</h2>
    <p>The attack began with a phishing email sent to an administrative employee on January 15th. Within 48 hours, the threat actors had moved laterally through the network and deployed ransomware across multiple systems.</p>
    
    <h2>Data Compromised</h2>
    <p>The attackers claim to have exfiltrated approximately 4.7 million patient records, including:</p>
    <ul>
      <li>Personal identification information</li>
      <li>Medical records and treatment histories</li>
      <li>Insurance information</li>
      <li>Financial records</li>
    </ul>
    
    <h2>Operational Impact</h2>
    <p>Emergency departments at several facilities have been forced to divert patients to other hospitals. Electronic health record systems remain offline, forcing staff to revert to paper-based processes.</p>`,
    status: 'published',
    isFeatured: true,
    viewCount: 9870
  },
  {
    title: 'North Korean Hackers Steal $1.5 Billion in Cryptocurrency Exchange Heist',
    excerpt: 'The Lazarus Group, linked to North Korea, has been attributed to the largest cryptocurrency theft in history, stealing $1.5 billion from a major exchange.',
    content: `<p>Blockchain analytics firm Chainalysis has attributed the theft of $1.5 billion in cryptocurrency from ByteChain Exchange to the Lazarus Group, a North Korean state-sponsored hacking collective. The theft, which occurred over a 72-hour period, represents the largest single cryptocurrency heist on record.</p>
    
    <h2>Attack Method</h2>
    <p>The Lazarus Group employed a sophisticated multi-vector attack that began with social engineering of exchange employees through fake LinkedIn job offers. Once an employee's system was compromised, the attackers moved to access the exchange's hot wallet infrastructure.</p>
    
    <h2>Fund Movement</h2>
    <p>The stolen funds have been traced through multiple mixing services and cross-chain bridges in an attempt to launder the proceeds. OFAC has already sanctioned several crypto addresses associated with the theft.</p>`,
    status: 'published',
    isTrending: true,
    viewCount: 8540
  },
  {
    title: 'New Phishing Campaign Exploits AI-Generated Content to Bypass Email Filters',
    excerpt: 'Security researchers have identified a sophisticated phishing campaign using AI-generated content that successfully bypasses traditional email security filters.',
    content: `<p>A new phishing campaign has been discovered that leverages artificial intelligence to generate highly convincing, contextually relevant email content that bypasses traditional spam and phishing filters. The campaign, dubbed "PhishGPT" by researchers, has targeted over 10,000 organizations globally.</p>
    
    <h2>How It Works</h2>
    <p>The attackers use large language models to generate personalized phishing emails that reference real current events, use natural language, and avoid common phishing indicators. Each email is uniquely generated, making signature-based detection nearly impossible.</p>
    
    <h2>Key Characteristics</h2>
    <ul>
      <li>No grammar or spelling errors</li>
      <li>References to real-world events and company news</li>
      <li>Personalized content based on public OSINT data</li>
      <li>Legitimate-looking sender addresses</li>
    </ul>`,
    status: 'published',
    isTrending: true,
    viewCount: 7230
  },
  {
    title: 'CISA Issues Emergency Directive on Critical Infrastructure Vulnerabilities',
    excerpt: 'The US Cybersecurity and Infrastructure Security Agency has issued an emergency directive requiring federal agencies to patch critical vulnerabilities within 48 hours.',
    content: `<p>The Cybersecurity and Infrastructure Security Agency (CISA) has issued Emergency Directive 24-XX, requiring all federal civilian executive branch agencies to immediately apply patches for three critical vulnerabilities being actively exploited by threat actors targeting US critical infrastructure.</p>
    
    <h2>Required Patches</h2>
    <p>The directive mandates patching of vulnerabilities in:</p>
    <ul>
      <li>Cisco IOS XE (CVE-2024-20399) - CVSS 9.8</li>
      <li>Palo Alto Networks PAN-OS (CVE-2024-3400) - CVSS 10.0</li>
      <li>Fortinet FortiOS (CVE-2024-21762) - CVSS 9.6</li>
    </ul>`,
    status: 'published',
    isFeatured: true,
    viewCount: 6890
  },
  {
    title: 'Chinese APT40 Targets South China Sea Military Communications',
    excerpt: 'APT40, a Chinese state-sponsored group, has been observed conducting a targeted espionage campaign against military communications infrastructure in the South China Sea region.',
    content: `<p>Government cybersecurity agencies from Australia, the United States, the United Kingdom, Canada, New Zealand, Germany, South Korea, and Japan have jointly attributed a sophisticated espionage campaign to APT40, a Chinese Ministry of State Security-linked threat group.</p>
    
    <h2>Campaign Details</h2>
    <p>The campaign has targeted naval communications, air traffic control systems, and government networks across Southeast Asian countries with strategic interest in the South China Sea. The threat actors have been observed maintaining long-term persistent access to compromised networks.</p>`,
    status: 'published',
    viewCount: 5670
  },
  {
    title: 'Critical Vulnerability in Popular VPN Software Affects Millions of Devices',
    excerpt: 'A critical buffer overflow vulnerability in widely-deployed VPN software could allow unauthenticated remote attackers to execute arbitrary code on vulnerable systems.',
    content: `<p>Security researchers at CyberLabs have disclosed a critical buffer overflow vulnerability (CVE-2024-YYYYY) in OpenVPN that affects hundreds of millions of installations worldwide. The flaw can be exploited by unauthenticated attackers to achieve remote code execution.</p>
    
    <h2>Technical Details</h2>
    <p>The vulnerability exists in the OpenVPN packet processing routine and can be triggered by sending malformed packets to any OpenVPN server. The overflow occurs in the SSL/TLS handshake phase, before authentication takes place.</p>
    
    <h2>Affected Versions</h2>
    <p>OpenVPN versions 2.5.x through 2.6.7 are affected. Users should update to version 2.6.8 or later immediately.</p>`,
    status: 'published',
    viewCount: 4560
  }
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Tag.deleteMany({}),
      Blog.deleteMany({})
    ]);
    console.log('✅ Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'CyberWar Admin',
      email: process.env.ADMIN_EMAIL || 'admin@cyberwar.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
      bio: 'Chief Security Editor at CyberWar Intelligence'
    });
    console.log('✅ Admin user created:', adminUser.email);

    // Create editor
    const editor = await User.create({
      name: 'Sarah Mitchell',
      email: 'sarah@cyberwar.com',
      password: 'Editor@123456',
      role: 'editor',
      bio: 'Senior Cybersecurity Analyst and Editor'
    });

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create tags
    const createdTags = await Tag.insertMany(tags);
    console.log(`✅ Created ${createdTags.length} tags`);

    // Create blogs
    const categoryMap = {};
    createdCategories.forEach(c => categoryMap[c.slug] = c._id);

    const blogCategoryAssignments = ['cybersecurity', 'vulnerabilities', 'ransomware', 'cybersecurity', 'cybersecurity', 'vulnerabilities', 'nation-state', 'vulnerabilities'];
    const enrichedBlogs = sampleBlogs.map((blog, index) => ({
      ...blog,
      author: index % 2 === 0 ? adminUser._id : editor._id,
      category: categoryMap[blogCategoryAssignments[index]] || createdCategories[0]._id,
      tags: [createdTags[index % createdTags.length]._id, createdTags[(index + 1) % createdTags.length]._id],
      publishedAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000))
    }));

    // Create blogs one by one to trigger slug generation
    const createdBlogs = []
    for (const blogData of enrichedBlogs) {
      const blog = await Blog.create(blogData)
      createdBlogs.push(blog)
    }
    console.log(`✅ Created ${createdBlogs.length} blog posts`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin Email:', adminUser.email);
    console.log('   Admin Password:', process.env.ADMIN_PASSWORD || 'Admin@123456');
    console.log('\n🌐 API Endpoint: http://localhost:5000/api');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seed();
