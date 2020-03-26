import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { LicenseManager } from "ag-grid-enterprise";

if (environment.production) {
  enableProdMode();
}

LicenseManager.setLicenseKey("[TRIAL]_19_May_2020_[v2]_MTU4OTg0NjQwMDAwMA==d1c6b5b83d825b730415f17032aea8c0");

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
