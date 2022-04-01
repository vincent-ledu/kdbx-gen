import * as kdbxweb from 'kdbxweb'
import * as argon2 from './utils/argon2'

function searchGroupByName(db: kdbxweb.Kdbx, groupName: string) {
  const root = db.getDefaultGroup();
  for (const group of root.allGroups()) { 
    if (group.name === groupName) {
      return group;
    }
  }
  return undefined;
}

export async function createKDBX(jsonObj: any[], password: kdbxweb.ProtectedValue, name: string ) {
  kdbxweb.CryptoEngine.setArgon2Impl(argon2.argon2);
  const credentials = new kdbxweb.KdbxCredentials(password);
  let db = kdbxweb.Kdbx.create(credentials, name);
  jsonObj.forEach((row) => {
    let groupKeys = Object.keys(row).filter(key => ['GROUP', 'GROUPE', 'GRP', 'ADABO'].includes(key.toUpperCase()));
    let group = db.getDefaultGroup();
    let entry
    if (groupKeys.length > 0) {
      for (let i = 0; i < groupKeys.length; i += 1) {
        let groupFound = searchGroupByName(db, row[groupKeys[i]])
        if (!groupFound) {
          group = db.createGroup(group, row[groupKeys[i]]);
        } else {
          group = groupFound;
        }
        if (i === groupKeys.length - 1) {
          entry = db.createEntry(group);
        }
      }
    } else {
      entry = db.createEntry(group);
    }
    for (let [key, value] of Object.entries(row)) {
      if (['PASSWORD', 'MOT DE PASSE', 'PASSE', 'PASS', 'PWD', 'MDP'].includes(key.toUpperCase())) {
        entry.fields.set('Password', kdbxweb.ProtectedValue.fromString(String(value)))
      } else if (['GROUP', 'GROUPE', 'GRP', 'ADABO'].includes(key.toUpperCase())) {
        // do nothing
      } else if (['TITLE', 'TITRE', 'LIBELLE', 'DESCRIPTION'].includes(key.toUpperCase())) {
        entry.fields.set('Title', String(value))
      } else if (['LOGIN', 'USERNAME', 'USER', 'UTILISATEUR'].includes(key.toUpperCase())) {
        entry.fields.set('Username', String(value))
      } else {
        entry.fields.set(key, String(value))
      }
    }
  });
  return db
}

