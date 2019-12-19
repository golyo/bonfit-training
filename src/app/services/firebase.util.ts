import {Action, DocumentChangeAction, DocumentSnapshot} from '@angular/fire/firestore';

export class Util {

  static resultsToObjects<T>(results: Array<DocumentChangeAction<T>>): Array<T> {
    return results.map(result => {
      const data: T = result.payload.doc.data();
      const id = result.payload.doc.id;
      return { id, ...data };
    });
  }

  static resultToObj<T>(result: Action<DocumentSnapshot<T>>): T {
    if (!result.payload.exists) {
      return null;
    }

    const data = result.payload.data();
    const id = result.payload.id;
    return {id, ...data};
  }

  static timestampsToDate(source: any, property: string): void {
    const timestamps: Array<any> = source[property];
    source[property] = timestamps.map(timeStamp => new Date(timeStamp.seconds * 1000));
  }

}
