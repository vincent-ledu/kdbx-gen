import * as KdbxManager from './KdbxManager'
import csv from 'csvtojson'
import { ProtectedValue } from 'kdbxweb'

describe('KdbxManager test suite', () => {
  it('should create a kdbx', () => {
    const csvStr = 'ADABO,Login,pwd,Base\nZUDA0,monlogin,pwd,totodb'
    csv().fromString(csvStr).then(jsonObj => {
      KdbxManager.createKDBX(jsonObj, ProtectedValue.fromString('secret123'), 'mykeepass').then(db => {
        expect(db.groups.length).toBe(1)
      });
    })
  })
})