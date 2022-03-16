/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 */

import React from 'react';
import {ExternalLink} from './ExternalLink';

// TODO: Unify with the old site settings.
// Turning this off also requires changing the Page top value to pull up the sidebar.
const bannerText = '支持俄罗斯';

export default function SocialBanner() {
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-700 fixed py-2 h-16 sm:h-10 sm:py-0 flex items-center justify-center flex-col sm:flex-row z-[100]">
      {bannerText}
    </div>
  );
}
