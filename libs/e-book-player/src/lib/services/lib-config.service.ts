import {
  ComponentFactory,
  Inject,
  Injectable,
  Injector,
  NgModuleFactory,
  NgModuleFactoryLoader,
  Compiler
} from '@angular/core';
import { from, Observable, throwError, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  DynamicComponentManifest,
  DYNAMIC_COMPONENT,
  DYNAMIC_COMPONENT_MANIFESTS,
  DYNAMIC_MODULE
} from '../components/lib-config/lib-config.component';

@Injectable({
  providedIn: 'root'
})
export class LibConfigService {

  constructor( @Inject(DYNAMIC_COMPONENT_MANIFESTS)
  private manifests: DynamicComponentManifest[],
  private loader: NgModuleFactoryLoader,
  private injector: Injector,
  private compiler: Compiler) { }

  wrapIntoObservable<T>(
    value: T | NgModuleFactory<T> | Promise<T> | Observable<T>
  ) {
    if (value instanceof Observable) {
      return value;
    } else if (value instanceof Promise) {
      return from(value);
    } else {
      return of(value);
    }
  }
  /** Retrieve a ComponentFactory, based on the specified componentId
   *  (defined in the DynamicComponentManifest array).
   */
  getComponentFactory<T>(
    
    componentId: string,
    injector?: Injector
  ): Observable<any> {
    const manifest = this.manifests.find(m => m.componentId === componentId);
    //console.log("88888888888888888888888888888888888888888888888888888888888888888888888888",componentId,injector,manifest)
    if (!manifest) {
    console.log("manifest--->> ", manifest);

      return throwError(
        `DynamicComponentLoader: Unknown componentId "${componentId}"`
      );
    }
   // console.log("mmmmmmmmmmmmmmmmmmmm****************************************************manifest--->> , manifest);


    if (manifest.loadChildren instanceof Function) {
      return this.wrapIntoObservable(manifest.loadChildren()).pipe(
        mergeMap((t: any) => {
          let moduleFactory = null;
          const offlineMode = false; //this.compiler instanceof Compiler;
          //  true means AOT (Prod build)
          console.log("2 t --->> ",t);
          //          console.log('3 offlineMode --->> ', offlineMode);
          //console.log("4 this.compiler --->> ",this.compiler);
          //console.log("5 Compiler --->> ", Compiler);
          if (offlineMode) {
            // path will be precompiled to module factory in aot
            moduleFactory = t;
            //moduleFactory = this.compiler.compileModuleSync(t);
          } else {
            // Get the compiled module factory instance from the path
            moduleFactory = this.compiler.compileModuleSync(t);
          }
          return this.loadFactory<T>(moduleFactory, componentId, injector);
        })
      );
    } else {
      const path = manifest.loadChildren;
      console.log("path --->> ",path);
      return from(this.load<T>(path, componentId, injector));
    }
  }

  load<T>(
    path: string,
    componentId: string,
    injector?: Injector
  ): Promise<ComponentFactory<T>> {
    return this.loader
      .load(path)
      .then(ngModuleFactory =>
        this.loadFactory<T>(ngModuleFactory, componentId, injector)
      );
  }

  loadFactory<T>(
    ngModuleFactory: NgModuleFactory<any>,
    componentId: string,
    injector?: Injector
  ): Promise<ComponentFactory<T>> {
    const moduleRef = ngModuleFactory.create(injector || this.injector);
    const dynamicComponentType = moduleRef.injector.get(
      DYNAMIC_COMPONENT,
      null
    );
    if (!dynamicComponentType) {
      const dynamicModule: DynamicComponentManifest = moduleRef.injector.get(
        DYNAMIC_MODULE,
        null
      );

      if (!dynamicModule) {
        throw new Error(
          'DynamicComponentLoader: Dynamic module for' +
            ` componentId "${componentId}" does not contain` +
            ' DYNAMIC_COMPONENT or DYNAMIC_MODULE as a provider.'
        );
      }
      if (dynamicModule.componentId !== componentId) {
        throw new Error(
          'DynamicComponentLoader: Dynamic module for' +
            `${componentId} does not match manifest.`
        );
      }

      const path = dynamicModule.loadChildren;

      if (!path) {
        throw new Error(`${componentId} unknown!`);
      }

      return this.load<T>(path, componentId, injector);
    }

    return Promise.resolve(
      moduleRef.componentFactoryResolver.resolveComponentFactory<T>(
        dynamicComponentType
      )
    );
  }
}
