# Progress Bar

The `z-progress-bar` is a customizable Angular component for displaying progress, supporting various styles and configurations through CVA.

## Usage

### **Importing**

```ts
import { ZardProgressBarComponent } from '@zard/progress-bar';
```

### **Basic Example**

```html
<z-progress-bar [progress]="50" />
```

### **Custom Styles**

```html
<z-progress-bar [progress]="75" [class]="'border border-gray-500'" [barClass]="'shadow-lg bg-green-500'" />
```

The `z-progress-bar` provides a flexible and consistent way to display progress indicators in Angular applications.
