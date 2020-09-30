import { CommonModule } from '@angular/common';
import {
  ANALYZE_FOR_ENTRY_COMPONENTS,
  ModuleWithProviders,
  NgModule,
  NgModuleFactoryLoader,
  SystemJsNgModuleLoader,
  Type
} from '@angular/core';
import { ROUTES } from '@angular/router';

import { LibConfigService } from '../services/lib-config.service';
import {
  DYNAMIC_COMPONENT,
  DYNAMIC_COMPONENT_MANIFESTS,
  DYNAMIC_MODULE,
  DynamicComponentManifest
} from './lib-config.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class LibConfigModule {
  static forRoot(manifests: DynamicComponentManifest[]): ModuleWithProviders<LibConfigModule> {
    return {
      ngModule: LibConfigModule,
      providers: [
        LibConfigService,
        { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
        // provider for Angular CLI to analyze
        { provide: ROUTES, useValue: manifests, multi: true },
        // provider for DynamicComponentLoader to analyze
        { provide: DYNAMIC_COMPONENT_MANIFESTS, useValue: manifests }
      ]
    };
  }
  static forModule(manifest: DynamicComponentManifest): ModuleWithProviders<LibConfigModule> {
    return {
      ngModule: LibConfigModule,
      providers: [
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          useValue: manifest,
          multi: true
        },
        // provider for @angular/router to parse
        { provide: ROUTES, useValue: manifest, multi: true },
        // provider for DynamicComponentLoader to analyze
        { provide: DYNAMIC_MODULE, useValue: manifest }
      ]
    };
  }
  static forChild(component: Type<any>): ModuleWithProviders<LibConfigModule> {
    return {
      ngModule: LibConfigModule,
      providers: [
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          useValue: component,
          multi: true
        },
        // provider for @angular/router to parse
        { provide: ROUTES, useValue: [], multi: true },
        // provider for DynamicComponentLoader to analyze
        { provide: DYNAMIC_COMPONENT, useValue: component }
      ]
    };
  }
 }
 export { DynamicComponentManifest } from './lib-config.component';
