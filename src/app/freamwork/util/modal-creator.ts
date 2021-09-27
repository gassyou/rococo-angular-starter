import { ModalButtonOptions, ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';

import { FormComponent } from '../core/form-component';

export function modalCreator(
  nzModal: NzModalService,
  title: string,
  cancelText: string,
  okText: string,
  content: FormComponent | any,
  contentParams?: any,
  nzMaskClosable = false
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
          modal.destroy();
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
    nzFooter: null,
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
