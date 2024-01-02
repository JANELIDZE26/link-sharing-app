import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiService } from '../services/api/api.service';
import { map } from 'rxjs';

export const previewGuard: CanActivateFn = () => {
  const api = inject(ApiService);
  const hotToast = inject(HotToastService);
  const router = inject(Router);

  return api.getPreviewDetails().pipe(
    map(([[image, profileDetails], links]) => {
      console.log(image, profileDetails, links);
      if (!image || !profileDetails) {
        router.navigateByUrl('customize/profile-details').then(() => {
          hotToast.show('Please add profile details!', {
            position: 'bottom-center',
            className: 'toastrClass warning',
          });
        });
        return false;
      }

      if (!links.size) {
        router.navigateByUrl('customize/links').then(() => {
          hotToast.show('Please add links!', {
            position: 'bottom-center',
            className: 'toastrClass warning',
          });
        });
        return false;
      }

      return true;
    })
  );

  return true;
};
