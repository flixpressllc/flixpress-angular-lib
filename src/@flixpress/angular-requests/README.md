# Requests Module

## Installation

```typescript
// app.module.ts

import { RequestsModule } from '@flixpress/angular-requests';
import { HttpClientModule } from '@angular/common/http';
// . . .
@NgModule({
  declarations: [
    // . . .
  ],
  imports: [
    // . . .
    HttpClientModule,
    RequestsModule.forRoot({
      apiRoot: 'http://yourapi.com/api',
      tokenEndpoint: 'http://yourapi.com/api/token',
    }),
    // . . .
  ],
  providers: [
    // . . .
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Optionally, set a local storage service provider:

```typescript
// app.module.ts

import { RequestsModule, LocalStorageService as RMLocalStorageService } from '@flixpress/angular-requests';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from './wherever/local-storage.service';
// . . .
@NgModule({
  declarations: [
    // . . .
  ],
  imports: [
    // . . .
    HttpClientModule,
    RequestsModule.forRoot({
      apiRoot: 'http://yourapi.com/api',
      tokenEndpoint: 'http://yourapi.com/api/token',
      localStorageKeys: {accessToken: 'access_token_key_you_want'},
    }),
    // . . .
  ],
  providers: [
    // . . .
    LocalStorageService,
    {provide: RMLocalStorageService, useExisting: LocalStorageService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Public Api

### Importing the service
```javascript
import { RequestsService } from '@flixpress/angular-requests';
```

### Public Methods

Docs in progress... In the meantime, here are the method signatures

```typescript
interface {
  setCredentials(input: {username: string, password: string}): void;

  clearCredentials(): void;

  setBaseHeaders(input?: { label: string, value: string }[]): void;

  clearLocalToken(): void;

  makePublicApiCall(callType: CallType, fullUrl: string, requestData?: any): Promise<ServerResponse>;

  makeFormApiCall(callType: CallType, fullUrl: string, requestData?: any): Promise<ServerResponse>;

  makeAuthorizedApiCall(callType: CallType, urlRoute: string, requestData?: any): Promise<ServerResponse>;

  multipartApiCall(settings: {urlRoute: string, requestData: FormData, apiRoot?: string}): Promise<ServerResponse>;
}

type CallType = 'post' | 'put' | 'get';
```

## Change Log

### 1.0.0-beta.5

* add `setBaseHeaders()`
