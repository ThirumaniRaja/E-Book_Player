import { GradeLevelType } from '../enums/grade-level-type';
import {
  ApiSubject,
  ApiDivision,
  ApiGrade,
  ApiLevel,
  ApiCurriculum,
  ApiTopic,
  ApiNode,
  ApiChapter,
  ApiResource,
  ApiEbook
} from '../models/curriculum.api.interface';
import { ResourceType } from '../enums/resource-type.enum';
import { ResourceRequestType } from '../enums/resource-request-type.enum';
import { TopicStatus } from '../enums/topic-status.enum';
import { ComponentRef } from '@angular/core';
import { CurriculumUtils } from '../utils/curriculum.utils';
import { FilterResourceType } from '../enums/filter-resource-type.enum';
import { IRecentViewState } from './recent-classes.interface';
var myCustomData: any;
export function CustomEbookData(data) {
  myCustomData = data;
}
export class Curriculum {
  curriculumId: string;
  gradeLevels: GradeLevel[] = [];

  constructor(curriculum: ApiCurriculum) {
    this.curriculumId = curriculum.curriculumId;
    curriculum.grades.sort(
      (a, b) => parseInt(a.orderNo, 10) - parseInt(b.orderNo, 10)
    );
    for (const grade of curriculum.grades) {
      if (grade.subjects && grade.subjects.length > 0) {
        this.gradeLevels.push(new GradeLevel(grade));
      }
    }
    for (const level of curriculum.levels) {
      if (level.subjects && level.subjects.length > 0) {
        this.gradeLevels.push(new GradeLevel(level));
      }
    }
  }
}

export class GradeLevel {
  id: string;
  title: string;
  type: GradeLevelType;
  subjects: ApiSubject[];
  divisions?: ApiDivision[];

  constructor(gradeLevel: ApiLevel | ApiGrade) {
    if ('levelId' in gradeLevel) {
      this.type = GradeLevelType.LEVEL;
      this.id = gradeLevel.levelId;
      this.title = gradeLevel.levelTitle;
    } else if ('gradeId' in gradeLevel) {
      this.type = GradeLevelType.GRADE;
      this.title = gradeLevel.gradeTitle;
      this.divisions = gradeLevel.divisions;
      this.id = gradeLevel.gradeId;
    }

    this.subjects = gradeLevel.subjects;
  }
}

export interface FullClassSelection {
  subject: ApiSubject;
  gradeLevel: GradeLevel;
  division?: ApiDivision;
}

export class Ebook {
  bookId: string;
  thumbnail: string;
  title: string;
  author = '';
  chapters: Chapter[] = [];
  resources?: Resource[];
  resourceRepresentation: Resource;
  tempChapterData?: any[];
  eBookBasePath: string;

  constructor(apiEbookData: ApiEbook) {
    const ebookJson = JSON.parse(apiEbookData.json);
    //console.log("TCL: Ebook -> constructor -> ebookJson", ebookJson)
    this.bookId = apiEbookData.bookId;
    this.title = apiEbookData.title;
    this.eBookBasePath = apiEbookData.eBookBasePath;
    this.thumbnail =
      ebookJson && ebookJson.node[0] && ebookJson.node[0].type === 'thumbnail'
        ? ebookJson.node[0].label
        : '';

    this.constructChapterData(ebookJson);
  }

  convertToResource?(): Resource {
    if (!this.resourceRepresentation) {
      this.resourceRepresentation = new Resource({
        title: this.title,
        subType: 'ebook',
        mimeType: 'pdf',
        assetType: 'ebook',
        encryptedFilePath: '',
        assetId: this.bookId,
        fileName: '',
        thumbFileName: this.thumbnail,
        tpId: '',
        metaData: {
          eBookObject: this
        }
      });
    }
    return this.resourceRepresentation;
  }

  private constructChapterData(ebookJson) {
    //console.log("constructChapterData--->ebookJson")
    const returnChapterData = [];
    this.tempChapterData = [];
    this.traverse(ebookJson.node);
    this.removetraverseArray(this.tempChapterData);
    const relevantChapterDetails = this.tempChapterData.filter(
      res => res.label !== ''
    );
    relevantChapterDetails.forEach(
      (currentChapter: ApiChapter, currentChapterIndex) => {
        this.chapters.push(
          new Chapter({
            ...currentChapter,
            assetId: this.bookId,
            chapterNumber: currentChapterIndex + 1,
            isComplete: false,
            encryptedFilePath: this.eBookBasePath
          })
        );
      }
    );
    //console.log("TCL: Ebook -> constructChapterData -> relevantChapterDetails", relevantChapterDetails)
    delete this.tempChapterData;
  }

  private removetraverseArray(arr) {
    arr.forEach((chapter, chapterIndex) => {
      if (!this.isArray(chapter.node)) {
        if (chapter.node.node.label === 'false') {
          this.tempChapterData[chapterIndex] = { label: '', type: '' };
        }
      } else {
        chapter.node.forEach((tp, tpIndex) => {
          if (tp.type === 'teaching point' && tp.id.startsWith('DUMMYID')) {
            this.tempChapterData[chapterIndex].node[tpIndex] = {
              label: '',
              type: ''
            };
            //delete this.tempChapterData[chapterIndex].node[tpIndex];
          }
          if (tp.type === 'teaching point' && tp.id.startsWith('tp')) {
            let counter;
            if (this.isArray(tp.node)) {
              counter = tp.node.findIndex(res => res.label === 'false');
            } else {
              if (tp.node.label === 'false') {
                counter = -1;
              }
            }
            if (counter >= 0) {
              this.tempChapterData[chapterIndex].node[tpIndex] = {
                label: '',
                type: ''
              };
              //delete this.tempChapterData[chapterIndex].node[tpIndex];
            }
          }
          if (tp.type === 'teaching point' && tp.id.startsWith('vtp')) {
            tp.node.forEach((vtp, vtpIndex) => {
              if (
                vtp.node &&
                vtp.node.findIndex(res => res.label === 'false') > 0
              ) {
                this.tempChapterData[chapterIndex].node[tpIndex].node[
                  vtpIndex
                ] = {
                  label: '',
                  type: '',
                  id: ''
                };
              }
            });
          }
        });
      }
      if (!this.isArray(chapter.node)) {
        if (chapter.node.type === 'teaching point') {
          this.tempChapterData[chapterIndex] = {
            label: '',
            type: '',
            node: ''
          };
        }
      } else {
        const counters = chapter.node.findIndex(
          res => res.type === 'teaching point'
        );
        if (counters < 0) {
          this.tempChapterData[chapterIndex] = {
            label: '',
            type: '',
            node: ''
          };
        }
      }
    });
  }

  private traverse(x) {
    // console.log("TCL: Ebook -> traverse -> x")
    if (this.isArray(x)) {
      if (x.type === 'chapter') {
        this.tempChapterData.push(x);
      }
      this.traverseArray(x);
    } else if (typeof x === 'object' && x !== null) {
      if (x.type === 'chapter') {
        this.tempChapterData.push(x);
      }
      this.traverseObject(x);
    } else {
    }
    // console.log("TCL: Ebook -> traverse -> this.tempChapterData", this.tempChapterData)
  }

  private traverseArray(arr) {
    arr.forEach(x => {
      this.traverse(x);
    });
  }

  private traverseObject(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        this.traverse(obj[key]);
      }
    }
  }

  private isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  }
}

export class Chapter {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  isComplete: boolean;
  encryptedFilePath: string;
  assetId: string;
  fileName: string;
  sequence?: number;
  visible?: boolean;
  custom?: boolean;
  isShare?: boolean;
  topics: Topic[] = [];

  constructor(apiChapterData: ApiChapter) {
    //console.log('myCustomData', myCustomData);
    let newFilterChapter: any;
    this.chapterId = apiChapterData.id;
    this.assetId = apiChapterData.assetId;
    this.chapterTitle = apiChapterData.label;
    this.chapterNumber = apiChapterData.chapterNumber;
    this.isComplete = apiChapterData.isComplete;
    this.encryptedFilePath = apiChapterData.encryptedFilePath;
    if (this.encryptedFilePath) {
      this.fileName = this.chapterId + '.pdf';
    }
    if (this.chapterId) {
      if (myCustomData && myCustomData.sequence) {
        newFilterChapter = myCustomData.sequence.node.filter(
          ctr => this.chapterId === ctr.id
        );
      }
      if (newFilterChapter && newFilterChapter.length > 0) {
        // console.log("Chapter -> constructor -> newFilterChapter", newFilterChapter)
        this.sequence = newFilterChapter[0].sequence;
        this.visible = newFilterChapter[0].visible;
        this.custom = newFilterChapter[0].custom;
        this.isShare = newFilterChapter[0].isShare;
        this.constructTopicData(apiChapterData, newFilterChapter[0].node);
      } else {
        this.constructTopicData(apiChapterData, null);
      }
    }
  }
  private constructTopicData(apiChapterData, customTopic) {
    if (apiChapterData.node) {
      const topicNodes = (<ApiNode[]>apiChapterData.node).filter(
        subNode => subNode.type === 'teaching point'
      );
      topicNodes.forEach((currentTopic, currentTopicIndex, alltopic) => {
        if (customTopic != null && customTopic.length > 0) {
          let newCustomTopic = customTopic.filter(
            ct => currentTopic.id === ct.id
          );
          //console.log('newCustomTopic', newCustomTopic);
          if (newCustomTopic && newCustomTopic.length > 0) {
            currentTopic.sequence = newCustomTopic[0].sequence;
            currentTopic.visible = newCustomTopic[0].visible;
            currentTopic.isShare = newCustomTopic[0].isShare;
          }
          //console.log("Chapter -> constructTopicData -> customTopic", customTopic)
          //console.log(  'Chapter -> constructTopicData -> currentTopic', currentTopic);
        }

        this.topics.push(
          new Topic(
            {
              ...currentTopic,
              chapterName: this.chapterTitle,
              topicNumber: currentTopicIndex + 1,
              status: TopicStatus.NOT_STARTED
            },
            45,
            26
          )
        );
      });
    }
  }
}

export class Topic {
  topicId: string;
  topicNumber: number;
  topicTitle: string;
  resources: Resource[] = [];
  timeToComplete: number;
  status: TopicStatus;
  numberOfResources: number;
  chapterName: string;
  resourceRequestType: ResourceRequestType;
  resourceRequestIds: string[];
  assetsQuestion: any[];
  hasLessonPlan = true;
  defaultQuizList = false;
  editPlaylistQuiz = false;
  editPlaylistGallery = false;
  defaultGallery = false;
  sequence?: boolean;
  visible?: boolean;
  custom?: boolean;
  isShare?: boolean;
  constructor(
    apiTopicData: ApiTopic,
    timeToComplete: number,
    numberOfResources: number
  ) {
    //console.log("apiTopicData",apiTopicData)
    if (apiTopicData.sequence) {
      this.sequence = apiTopicData.sequence;
    }
    this.visible = apiTopicData.visible;
    this.custom = apiTopicData.custom;
    this.isShare = apiTopicData.isShare;
    this.topicId = apiTopicData.id;

    this.topicTitle = apiTopicData.label;
    this.chapterName = apiTopicData.chapterName;
    this.topicNumber = apiTopicData.topicNumber;

    if (this.topicId.startsWith('vtp')) {
      const topicSubnodes = <ApiNode[]>apiTopicData.node;

      let subNodeIds: any[] = topicSubnodes.map(node => node.id);
      subNodeIds = subNodeIds.filter(id => id);
      this.resourceRequestIds = subNodeIds;
      this.hasLessonPlan = false;

      if (subNodeIds && subNodeIds[0].startsWith('tq')) {
        this.resourceRequestType = ResourceRequestType.TQ;
      } else {
        this.assetsQuestion = topicSubnodes.filter(
          assest => assest.type.toLowerCase() === 'question'
        );
        this.resourceRequestType = ResourceRequestType.ASSETS;
      }
    } else {
      this.resourceRequestType = ResourceRequestType.TP;
      this.resourceRequestIds = [this.topicId];
      this.hasLessonPlan = true;
    }

    this.numberOfResources = numberOfResources;
    this.timeToComplete = timeToComplete;
  }

  doesPlaylistJsonMatchRequestedResources(playlistJson: string): boolean {
    if (!playlistJson) {
      return false;
    }
    const playlist = JSON.parse(playlistJson);
    // console.log("playlist",playlist)
    const matchesResources = playlist.asset.every(resourceItem => {
      if (this.resourceRequestIds.includes(resourceItem.assetId)) {
        return true;
      } else {
        return false;
      }
    });
    return matchesResources;
  }

  setCustomResourcePlaylistJson(playlistJson, currenResource) {
    //console.log("Topic -> setCustomResourcePlaylistJson -> playlistJson", this.resources)
    if (playlistJson) {
      let resource: any[] = [];
      let allResource = [];
      const playlist = JSON.parse(playlistJson);
      if (playlist.asset && playlist.asset.length > 0) {
        playlist.asset.forEach(element => {
          let newmimeType: any;
          let selectedType: any;
          let assetType: any, subType: any, tcetype: any;
          if (element.mimeType) {
            newmimeType = element.mimeType;
            if (newmimeType === 'application/pdf') {
              tcetype = 'worksheet';
              selectedType = 'pdf';
              assetType = 'asset_print';
              subType = tcetype;
            }
            if (newmimeType !== 'application/pdf') {
              if (newmimeType.startsWith('image')) {
                selectedType = 'image';
              } else if (newmimeType.startsWith('video')) {
                selectedType = 'video';
              } else {
                selectedType = element.mimeType;
              }
              assetType = selectedType;
              subType = selectedType;
            }
          }
          const newdata1 = new Resource({
            assetId: element.assetId,
            tpId: element.tpId,
            title: element.title,
            mimeType: selectedType,
            assetType: assetType,
            thumbFileName: element.thumbFileName ? element.thumbFileName : '',
            fileName: element.fileName,
            subType: subType,
            encryptedFilePath: element.encryptedFilePath,
            isShared: element.isShared,
            isOwner: element.isOwner,
            visibility: 1,
            downloadFileExtension: element.downloadFileExtension,
            metaData: {
              assetId: element.assetId,
              tpId: element.tpId,
              lcmsSubjectId: element.lcmsSubjectId,
              lcmsGradeId: element.lcmsGradeId,
              title: element.title,
              mimeType: selectedType,
              assetType: assetType,
              thumbFileName: element.thumbFileName ? element.thumbFileName : '',
              fileName: element.fileName,
              ansKeyId: element.ansKeyId,
              copyright: element.copyright,
              subType: subType,
              description: element.description,
              keywords: element.keywords,
              encryptedFilePath: element.encryptedFilePath,
              filePath:
                element.encryptedFilePath +
                '/' +
                element.assetId +
                '/' +
                element.fileName,
              isShared: element.isShared,
              isOwner: element.isOwner,
              downloadFileExtension: element.downloadFileExtension
            }
          });
          resource.push(newdata1);
        });
        allResource = currenResource.concat(resource);
        //console.log("Topic -> setCustomResourcePlaylistJson -> allResource", allResource)
        for (let index = 0; index < allResource.length; index++) {
          for (let indexR = 0; indexR < resource.length; indexR++) {
            if (
              allResource[index] &&
              allResource[index].resourceId.startsWith('casset')
            ) {
              if (
                allResource[index].resourceId === resource[indexR].resourceId
              ) {
                allResource[index] = resource[indexR];
                allResource[index].visibility = 1;
              }
            }
            if (
              allResource[index] &&
              !allResource[index].resourceId.startsWith('casset')
            ) {
              allResource[index].visibility = 1;
            }
          }
        }
        allResource = CurriculumUtils.removeDuplicateResources(allResource);
        return allResource;
      }
    }
  }
  setResourcesFromPlaylistJson(playlistJson: string, isFromVtp = false) {
    //console.log('this.assetsQuestion', this.assetsQuestion);
    let resources: Resource[] = [];
    this.editPlaylistQuiz = false;
    this.defaultQuizList = false;
    this.editPlaylistGallery = false;
    this.defaultGallery = false;
    if (playlistJson) {
      //console.log('setResourcesFromPlaylistJson--->playlist', playlistJson);
      const playlist = JSON.parse(playlistJson);
      //console.log('setResourcesFromPlaylistJson--->playlist', playlist);
      //resources.push(this.getUnsupport());
      if (playlist.asset && playlist.asset.length > 0) {
        playlist.asset.forEach((resourceItem: ApiResource) => {
          if (resourceItem.assets_type === 'gallery') {
            this.editPlaylistGallery = true;
            this.defaultGallery = false;
            if (playlist.gallery && playlist.gallery.length > 0) {
              resources.push(this.getImageResource(playlist.gallery));
            }
          }
          if (resourceItem.assets_type === 'practice') {
            this.editPlaylistQuiz = true;
            this.defaultQuizList = false;
            if (playlist.practice && playlist.practice.length > 0) {
              resources.push(this.getQuizData(playlist.practice));
            }
          } else {
            if (
              (!isFromVtp ||
                this.resourceRequestIds.includes(resourceItem.assetId)) &&
              resourceItem.assets_type !== 'practice' &&
              resourceItem.assets_type !== 'gallery'
            ) {
              this.defaultGallery = true;
              this.defaultQuizList = true;
              const resource = new Resource(resourceItem);
              resources.push(resource);
            }
          }
        });
      } else {
        if (playlist.practice && playlist.practice.length > 0) {
          resources.push(this.getQuizData(playlist.practice));
        }
        if (playlist.gallery && playlist.gallery.length > 0) {
          resources.push(this.getImageResource(playlist.gallery));
        }
      }

      if (resources.length > 0) {
        resources = CurriculumUtils.removeDuplicateResources(resources);
        const resourceArrayTemp = [...resources];
        resources = resources.filter(item => {
          if (
            item.resourceType &&
            item.resourceType.toLowerCase() === 'worksheet' &&
            item.metaData.subType !== 'handout'
          ) {
            if (item.metaData.ansKeyId) {
              const matchingAnswerKeyResource = resourceArrayTemp.find(
                resource => resource.resourceId === item.metaData.ansKeyId
              );
              item.metaData.answerKeyResource = matchingAnswerKeyResource;
              return item;
            } else {
              return item;
            }
          } else {
            return item;
          }
        });
      }

      if (this.defaultQuizList && !this.editPlaylistQuiz) {
        if (playlist.practice && playlist.practice.length > 0) {
          resources.push(this.getQuizData(playlist.practice));
        }
      }
      if (!this.editPlaylistGallery && this.defaultGallery) {
        if (playlist.gallery && playlist.gallery.length > 0) {
          resources.push(this.getImageResource(playlist.gallery));
        }
      }

      // default append quiz at the last of playlist -------------------
      if (resources && resources.length > 0) {
        this.resources = resources;
      }

      //console.log('this.resources', this.resources);
      //console.log("TCL: Topic -> this.resources", this.resources)
    }
  }
  getImageResource(data) {
    //console.log('TCL: Topic -> getImageResource -> data', data);
    let currentImage: any;

    // data.map(item => {
    //   item['filePath'] = `${item.encryptedFilePath}/${item.fileName}`;
    // });

    currentImage = new Resource({
      title: data[0].title,
      assetType: 'gallery',
      subType: 'gallery',
      mimeType: 'gallery',
      assetId: data[0].assetId,
      tpId: data[0].tpId,
      metaData: data,
      fileName: '',
      thumbFileName: '',
      encryptedFilePath: ''
    });

    return currentImage;
  }
  getQuizData(data) {
    let currentQuiz: any;
    let quizQuestionIds = [];
    quizQuestionIds = quizQuestionIds.concat(data);
    if (this.resourceRequestType === ResourceRequestType.ASSETS) {
      if (this.assetsQuestion) {
        this.assetsQuestion.map(assetQuestion => {
          quizQuestionIds.push(assetQuestion.id);
        });
      }
    }
    if (quizQuestionIds && quizQuestionIds.length > 0) {
      const quizId = 'quiz-' + this.topicId;
      currentQuiz = new Resource({
        title: 'Play Quiz',
        assetType: 'quiz',
        subType: 'quiz',
        mimeType: 'quiz',
        assetId: quizId,
        tpId: quizId,
        metaData: { questionIds: quizQuestionIds },
        fileName: '',
        thumbFileName: '',
        encryptedFilePath: ''
      });
    }
    return currentQuiz;
  }
  setResourcesFromApiResponse(response) {
    if (!response || response.length < 1) {
      return false;
    }

    this.setResourcesFromPlaylistJson(response[0].playlistJson);
  }
}

export class FullContentSelection {
  chapter: Chapter;
  topic: Topic;
  ebook: Ebook;

  constructor(chapter: Chapter, topic: Topic, ebook: Ebook) {
    this.chapter = chapter;
    this.topic = topic;
    this.ebook = ebook;
  }
}

export class Resource {
  title: string;
  resourceType: ResourceType;
  resourceId: string;
  thumbnailParams: string;
  playerCapsuleRef?: ComponentRef<any>;
  playerResourceRef?: ComponentRef<any>;
  encryptedFilePath?: string;
  fileName?: string;
  metaData: any;
  tpId: string;
  tcetype: string;
  show: boolean;
  filterStatus: boolean;
  isShared?: any;
  isOwner?: any;
  visibility?: any;
  downloadFileExtension?: any;
  constructor(apiResourceData: ApiResource) {
    //console.log('apiResourceData', apiResourceData);
    this.show = true;
    this.filterStatus = false;
    this.title = apiResourceData.title;
    this.resourceId = apiResourceData.assetId;
    this.tpId = apiResourceData.tpId;
    this.tcetype = apiResourceData.subType;
    this.downloadFileExtension = apiResourceData.downloadFileExtension;
    this.thumbnailParams = '';
    //this.visibility = 0;
    if (apiResourceData.isShared !== undefined) {
      this.isShared = apiResourceData.isShared;
    }
    if (apiResourceData.isOwner !== undefined) {
      this.isOwner = apiResourceData.isOwner;
    }
    if (this.resourceId.startsWith('casset')) {
      this.visibility = 0;
    } else {
      this.visibility = 1;
    }
    if (apiResourceData.thumbFileName && apiResourceData.encryptedFilePath) {
      //this.thumbnailParams = '?encryptedPath=' + apiResourceData.encryptedFilePath + '&fileName=' + this.resourceId + '/' + apiResourceData.thumbFileName;
      this.thumbnailParams =
        '/' +
        apiResourceData.encryptedFilePath +
        '/' +
        this.resourceId +
        '/' +
        apiResourceData.thumbFileName;
    }
    if (apiResourceData.encryptedFilePath) {
      this.encryptedFilePath = apiResourceData.encryptedFilePath;
    }
    if (apiResourceData.fileName) {
      this.fileName = apiResourceData.fileName;
    }

    // if(apiResourceData.isShared){
    //   this.isShared = apiResourceData.isShared
    // }
    // if(apiResourceData.isOwner){
    //   this.isOwner = apiResourceData.isOwner
    // }
    /* TODO: Figure out what to do with swf resources */

    //console.log("SUBTYPE-->> ", apiResourceData.subType)
    if (apiResourceData.subType && apiResourceData.mimeType) {
      if (
        apiResourceData.subType.toLowerCase() === 'worksheet' ||
        apiResourceData.subType.toLowerCase() === 'handout'
      ) {
        this.resourceType = ResourceType.WORKSHEET;
      } else if (
        apiResourceData.subType.toLowerCase() === 'tce-html' ||
        apiResourceData.mimeType.toLowerCase() === 'tce-html' ||
        apiResourceData.subType.toLowerCase() === 'lecturenote' ||
        apiResourceData.mimeType.toLowerCase() === 'tce-shell' ||
        apiResourceData.subType.toLowerCase() === 'tool' ||
        apiResourceData.mimeType.toLowerCase() === 'tool' ||
        apiResourceData.mimeType.toLowerCase() === 'tce-link'
      ) {
        this.resourceType = ResourceType.TCEVIDEO;
      } else if (
        apiResourceData.subType.toLowerCase() === 'game' ||
        apiResourceData.mimeType.toLowerCase() === 'game'
      ) {
        //console.log('BABLOO---MIMETYPE-->> ', apiResourceData.mimeType);
        this.resourceType = ResourceType.GAME;
      } else if (apiResourceData.subType.toLowerCase() === 'quiz') {
        this.resourceType = ResourceType.QUIZ;
      } else if (apiResourceData.subType.toLowerCase() === 'ebook') {
        this.resourceType = ResourceType.EBOOK;
      } else if (apiResourceData.subType.toLowerCase() === 'interactivity') {
        this.resourceType = ResourceType.INTERACTIVITY;
      } else if (
        apiResourceData.mimeType.toLowerCase() === 'gallery' ||
        apiResourceData.subType.toLowerCase() === 'gallery' ||
        apiResourceData.mimeType.toLowerCase() === 'image' ||
        apiResourceData.subType.toLowerCase() === 'image'
      ) {
        this.resourceType = ResourceType.GALLERY;
      } else if (
        apiResourceData.mimeType.toLowerCase() === 'application/unknown' ||
        apiResourceData.subType.toLowerCase() === 'custom_unknown'
      ) {
        this.resourceType = ResourceType.UNSUPPORT;
      } else if (
        apiResourceData.subType.toLocaleLowerCase() === 'video' ||
        apiResourceData.mimeType.toLocaleLowerCase() === 'video'
      ) {
        this.resourceType = ResourceType.VIDEO;
      }
    }

    if (apiResourceData.metaData) {
      this.metaData = apiResourceData.metaData;
    } else {
      this.metaData = apiResourceData;
    }
  }

  setPlayerCapsuleRef(ref: ComponentRef<any>) {
    //console.log('setPlayerCapsuleRef');
    this.playerCapsuleRef = ref;
  }

  setPlayerResourceRef(ref: ComponentRef<any>) {
    //console.log('setPlayerResourceRef');
    this.playerResourceRef = ref;
  }
}

export class LessonPlanResource {
  topicId: string;
  chapterName: string;
  topicName: string;
  constructor(apiLessonPlanData) {
    this.topicId = apiLessonPlanData.topicId;
    this.chapterName = apiLessonPlanData.chapterName;
    this.topicName = apiLessonPlanData.topicName;
  }
}

export class RecentViewState {
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
  constructor(apiRecentData: IRecentViewState) {
    if (apiRecentData) {
      this.accessCount = apiRecentData.accessCount;
      this.subjectId = apiRecentData.subjectId;
      this.subjectTitle = apiRecentData.subjectTitle;
      this.division = apiRecentData.division;
      this.lastAccessedOn = apiRecentData.lastAccessedOn;
      this.gradeName = apiRecentData.gradeName;
      this.gradeId = apiRecentData.gradeId;
      this.className = apiRecentData.className;
      this.classId = apiRecentData.classId;
      this.chapterId = apiRecentData.chapterId;
      this.topicId = apiRecentData.topicId;
    }
  }
}

export class FilterMenu {
  name: FilterResourceType;
  image: string;
  resourceCount: number;
  selected: boolean;
  type: ResourceType[];
  state: string;
}
