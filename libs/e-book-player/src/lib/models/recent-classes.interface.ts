/**
 * Interface definition for items related to class selection
 *
 * @export
 * @interface IUpdateRecent
 */
export interface IUpdateRecent {
    accessCount: number;
    subjectId: string;
    subjectTitle: string;
    lastAccessedOn: Date;
    gradeName: string;
    gradeId: string;
    className: string;
    classId: string;
    chapterId: string;
    topicId: string;
  }
  
  export interface IGetRecent {
    data: IGetRecentData[];
    userId: string;
    type: string;
    organizationId: string;
    sessionKeys: ISessionKeys;
  }
  
  export interface ISessionKeys {
    keyHex: string;
    ivHex: string;
  }
  
  export interface IGetRecentData {
    accessCount: number;
    subjectId: string;
    subjectTitle: string;
    division: string;
    lastAccessedOn: Date;
    gradeName: string;
    gradeId: string;
    className: string;
    classId: string;
    chapterId: string;
    topicId: string;
    tpName: string;
    chpNo: number;
    tpNo: number;
    bookId: string;
    vtpCode: IGetRecentVtp;
  }
  
  export interface IGetRecentVtp {
    label: boolean;
    type: string;
  }
  
  export interface IRecentViewState {
    accessCount: number;
    subjectId: string;
    subjectTitle: string;
    division: string;
    lastAccessedOn: Date;
    gradeName: string;
    gradeId: string;
    className: string;
    classId: string;
    chapterId: string;
    topicId: string;
  }
  