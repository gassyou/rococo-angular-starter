import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';

import { FormComponent } from '../core/form-component';

export function modalCreator(
  nzModal: NzModalService,
  title: string,
  cancelText: string | null,
  okText: string | null,
  content: FormComponent | any,
  contentParams?: any | null,
  width?: string | null,
  top?: string | null,
  okCallbak?: Function,
  nzMaskClosable: boolean = false
) {
  const cancelButton = {
    label: cancelText,
    type: 'default',
    onClick(): void {
      const instance: FormComponent | any = modal.getContentComponent();
      instance.cancel();
      modal.destroy();
    }
  };

  const okButton = {
    label: okText,
    type: 'primary',
    loading: false,
    onClick(): void {
      this.loading = true;
      const instance: FormComponent | any = modal.getContentComponent();
      const submit: Observable<any> = instance.submit();
      if (submit) {
        submit.subscribe(result => {
          this.loading = false;
          if (okCallbak) {
            okCallbak();
          }
          if (result) {
            modal.destroy();
          }
        });
      } else {
        this.loading = false;
      }
    }
  };

  const modalOptions: ModalOptions = {
    nzTitle: title,
    nzContent: content,
    nzComponentParams: {
      value: contentParams
    },
    nzStyle: top ? { top: top } : {},
    nzFooter: null,
    nzWidth: width || '500px',
    nzMaskClosable: nzMaskClosable
  };

  if (cancelText) {
    if (!modalOptions.nzFooter) {
      modalOptions.nzFooter = [];
    }
    (modalOptions.nzFooter as any[]).push(cancelButton);
  }

  if (okText) {
    if (!modalOptions.nzFooter) {
      modalOptions.nzFooter = [];
    }
    (modalOptions.nzFooter as any[]).push(okButton);
  }

  const modal = nzModal.create(modalOptions);

  return modal;
}
