## Install

### NPM

```txt
npm install --save-dev @flixpress/angular-teleprompter ngx-page-scroll
```

### Yarn

```txt
yarn add @flixpress/angular-teleprompter ngx-page-scroll
```

### Add to Modules

```typsecript
// app.module.ts

// --- snip ---
@NgModule({
  imports: [
    // --- snip ---
    NgxPageScrollModule,
    FlixpressTeleprompterModule,
  ],
  // --- snip ---
})
// --- snip ---
```

### Use in components

```html
<flix-teleprompter
  [copy]="copy"
  [scrollDuration]="duration"
  [mirror]="isFlipped"
></flix-teleprompter>
```

```typescript
// some component.ts

import { FlixpressTeleprompterComponent } from '@flixpress/angular-teleprompter';

```

# Changelog

## v0.3.0

* Adds changelog
* Package properly