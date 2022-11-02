import { ExceptionModule } from '@delon/abc/exception';
import { GlobalFooterModule } from '@delon/abc/global-footer';
import { NoticeIconModule } from '@delon/abc/notice-icon';
import { PageHeaderModule } from '@delon/abc/page-header';
import { ResultModule } from '@delon/abc/result';
import { ReuseTabModule } from '@delon/abc/reuse-tab';
import { SEModule } from '@delon/abc/se';
import { STModule } from '@delon/abc/st';
import { SVModule } from '@delon/abc/sv';
import { AlainConfig } from '@delon/util';

export const DELON_MODULES = [
  PageHeaderModule,
  ResultModule,
  ExceptionModule,
  NoticeIconModule,
  GlobalFooterModule,
  STModule,
  SEModule,
  SVModule,
  ReuseTabModule
];

export const alainConfig: AlainConfig = {
  st: {
    page: {
      show: true,
      front: false,
      showSize: true,
      total: true,
      showQuickJumper: true,
      pageSizes: [50, 100, 150]
    }
  },
  auth: {
    token_send_key: 'Authorization',
    ignores: [/assets\//, /\/passport\//, /\/login/, /\/app\//, /\/init\//, /\/unlock/, /\/ZKIDROnline\//, /check-mail-exist/, /\/realms/]
  },
  acl: {
    guard_url: '/exception/403'
  },
  cache: {
    expire: 60 * 60 * 8
  }
};
