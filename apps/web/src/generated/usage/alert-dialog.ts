import type { CodeBlockData } from '@highlight/types';

export const ALERT_DIALOG_USAGE_IMPORT: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">import</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> { ZardAlertDialogService } </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">from</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> '@/shared/components/alert-dialog/alert-dialog.service'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span></code></pre>",
  "code": "import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';",
  "language": "angular-ts",
  "showLineNumbers": true,
  "copyButton": true,
  "expandable": false
};

export const ALERT_DIALOG_USAGE_CODE: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">open</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">() {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">  this</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">.alertDialogService.</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">create</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">({</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">    zTitle: </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">'Are you absolutely sure?'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">    zDescription:</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">      'This action cannot be undone. This will permanently delete your account and remove your data from our servers.'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">    zOkText: </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">'Continue'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">    zCancelText: </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">'Cancel'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  });</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">}</span></span></code></pre>",
  "code": "open() {\n  this.alertDialogService.create({\n    zTitle: 'Are you absolutely sure?',\n    zDescription:\n      'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',\n    zOkText: 'Continue',\n    zCancelText: 'Cancel',\n  });\n}",
  "language": "angular-ts",
  "showLineNumbers": true,
  "copyButton": true,
  "expandable": false
};
