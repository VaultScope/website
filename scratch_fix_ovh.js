import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const excludeFiles = ['Aup.tsx', 'Dpa.tsx', 'HostingTerms.tsx'];

walkDir('D:\\Projects\\Pegasus\\VaultScope\\src', function(filePath) {
  if (excludeFiles.some(exc => filePath.endsWith(exc))) {
    return;
  }
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Replacements
  // En
  content = content.replace(/OVH SAS/g, 'Enterprise Hardware');
  content = content.replace(/EU datacentres\. VaultScope is an OVH reseller\./g, 'Premium EU datacentres.');
  content = content.replace(/All servers hosted in EU-based OVH datacentres\./g, 'All servers hosted in premium EU-based datacentres across NL, DE, FR, IT, and UK.');
  content = content.replace(/EU-based OVH datacentres/g, 'EU-based datacentres');
  content = content.replace(/EU-based OVH infrastructure/g, 'EU-based infrastructure');
  content = content.replace(/EU datacentres via OVH/g, 'EU datacentres');
  content = content.replace(/Physical hardware from OVH\./g, 'Premium physical hardware.');
  content = content.replace(/operated on OVH hardware/g, 'operated on premium hardware');
  content = content.replace(/VaultScope is an OVH reseller\./g, '');
  
  // De
  content = content.replace(/EU-Rechenzentren\. VaultScope ist OVH-Reseller\./g, 'Premium EU-Rechenzentren.');
  content = content.replace(/Alle Server in EU-basierten OVH-Rechenzentren\./g, 'Alle Server in erstklassigen EU-Rechenzentren (NL, DE, FR, IT, UK).');
  content = content.replace(/EU-basierte OVH-Rechenzentren/g, 'EU-basierte Rechenzentren');
  content = content.replace(/EU-basierte OVH-Infrastruktur/g, 'EU-basierte Infrastruktur');
  content = content.replace(/EU-Rechenzentren via OVH/g, 'EU-Rechenzentren');
  content = content.replace(/Physische Hardware von OVH\./g, 'Premium physische Hardware.');
  content = content.replace(/betrieben auf OVH-Hardware/g, 'betrieben auf Premium-Hardware');
  content = content.replace(/VaultScope ist OVH-Reseller\./g, '');
  
  if (original !== content) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', filePath);
  }
});
