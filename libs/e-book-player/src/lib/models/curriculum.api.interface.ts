import { GradeLevelType } from '../enums/grade-level-type';
import { TopicStatus } from '../enums/topic-status.enum';

/**
 * Interface definition for items related to class selection
 *
 * @export
 * @interface IClassSelection
 * @interface IGrade
 * @interface ILevel
 * @interface IDivision
 * @interface IBookDetails
 * @interface IBookLevelDetails
 */

export interface ApiCurriculum {
  curriculumId: string;
  grades: ApiGrade[];
  levels: ApiLevel[];
}

export interface ApiGrade {
  type: GradeLevelType.GRADE;
  gradeId: string;
  gradeTitle: string;
  orderNo: string;
  schoolGrdId: string;
  subjects: any[];
  divisions: ApiDivision[];
}

export interface ApiLevel {
  type: GradeLevelType.LEVEL;
  levelId: string;
  levelTitle: string;
  subjects: ApiSubject[];
}

export interface ApiDivision {
  divisionTitle: string;
  gradeTitle: string;
}

export interface ApiSubject {
  books: ApiBooks[];
  title: string;
  subjectId: string;
  status: string;
  mapping: string;
  hasGames: string;
}

export interface ApiBooks {
  bookId: string;
  title: string;
}

export interface ApiEbook {
  bookId: string;
  json: string;
  title: string;
  eBookBasePath?: string;
}

export interface ApiNode {
  id?: string;
  label?: string;
  sequence?: boolean;
  visible?: boolean;
  custom?: boolean;
  isShare?: boolean;
  node?: ApiNode | ApiNode[];
  type?: string;
}

export interface ApiTopic extends ApiNode {
  topicNumber: number;
  chapterName: string;
  status: TopicStatus;
}

export interface ApiChapter extends ApiNode {
  chapterNumber: number;
  isComplete: boolean;
  encryptedFilePath: string;
  assetId: string;
}

export interface ApiResource {
  assetId: string;
  tpId: string;
  title: string;
  mimeType: string;
  assetType: string;
  subType: string;
  thumbFileName: string;
  fileName: string;
  encryptedFilePath: string;
  assets_type?: string;
  ansKeyId?: string;
  metaData?: object;
  isShared?: any;
  isOwner?: any;
  visibility?: any;
  downloadFileExtension?: any;
}
