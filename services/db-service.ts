import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { QrContentItem } from './../models';

const tableName = 'qrContent';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({name: 'qr-content.db', location: 'default'});
};

export const createTable = async (db: SQLiteDatabase) => {
    // create table if not exists
    const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
          value TEXT NOT NULL
      );`;
  
    await db.executeSql(query);
  }; 
  
  export const getQrContentItems = async (db: SQLiteDatabase): Promise<QrContentItem[]> => {
    try {
      const qrContentItems: QrContentItem[] = [];
      const results = await db.executeSql(`SELECT rowid as id,value FROM ${tableName}`);
      results.forEach(result => {
        for (let index = 0; index < result.rows.length; index++) {
            qrContentItems.push(result.rows.item(index))
        }
      });
      return qrContentItems;
    } catch (error) {
      console.error(error);
      throw Error('Failed to get qrContent !!!');
    }
  };


  export const saveQrContentItems = async (db: SQLiteDatabase, qrContentItems: QrContentItem[]) => {
    const insertQuery =
      `INSERT OR REPLACE INTO ${tableName}(rowid, value) values` +
      qrContentItems.map(i => `(${i.id}, '${i.value}')`).join(',');
  
    return db.executeSql(insertQuery);
  };

  export const deleteQrContentItems = async (db: SQLiteDatabase, id: number) => {
    const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
    await db.executeSql(deleteQuery);
  };
  
  export const deleteTable = async (db: SQLiteDatabase) => {
    const query = `drop table ${tableName}`;
  
    await db.executeSql(query);
  };