import { Resource, Topic } from '../models/curriculum.interface';

export class CurriculumUtils {
  static removeDuplicateResources(resources: Resource[]) {
    return resources.filter((obj, pos, arr) => {
      return (
        arr.map(mapObj => mapObj.resourceId).indexOf(obj.resourceId) === pos
      );
    });
  }

  static doAllTopicsHaveResources(topics: Topic[]) {
    const allTopicsHaveResources = topics.every(topic => {
      if (!topic.resources || topic.resources.length < 1) {
        return false;
      } else {
        return true;
      }
    });

    return allTopicsHaveResources;
  }
}
