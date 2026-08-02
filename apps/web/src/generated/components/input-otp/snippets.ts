import type { CodeBlockData } from '@highlight/types';

export const INPUT_OTP_SNIPPET_PATTERN_ALPHANUMERIC: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line highlighted\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">import</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> { REGEXP_ONLY_DIGITS_AND_CHARS } </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">from</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> '@/shared/components/input-otp/input-otp.utils'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span>\n<span class=\"line\"></span>\n<span class=\"line highlighted\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">&#x3C;</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">z</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">-</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">input</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">-</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">otp [zMaxLength]</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"6\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> [zPattern]</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"REGEXP_ONLY_DIGITS_AND_CHARS\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> [zIntegerOnly]</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"false\"</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">  ...</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">&#x3C;/</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">z</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">-</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">input</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">-</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">otp</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">></span></span></code></pre>",
  "code": "import { REGEXP_ONLY_DIGITS_AND_CHARS } from '@/shared/components/input-otp/input-otp.utils';\n\n<z-input-otp [zMaxLength]=\"6\" [zPattern]=\"REGEXP_ONLY_DIGITS_AND_CHARS\" [zIntegerOnly]=\"false\">\n  ...\n</z-input-otp>",
  "language": "angular-ts",
  "showLineNumbers": true,
  "copyButton": true,
  "expandable": false,
  "highlightLines": [
    1,
    3
  ]
};

