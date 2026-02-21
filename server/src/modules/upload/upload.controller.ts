import type { Request, Response } from 'express';

import cloudinary from '../../config/cloudinary.js';
import config from '../../config/index.js';

const getSignature = async (req: Request, res: Response) => {
  try {
    const { folder = 'thumbnails', resource_type = 'image' } = req.query as {
      folder?: string;
      resource_type?: string;
    };

    const timestamp = Math.round(new Date().getTime() / 1000);

    // Base params for signature
    const paramsToSign: any = {
      timestamp: timestamp,
      folder: folder,
    };

    // If video, add HLS transformation parameters
    if (resource_type === 'video') {
      // eager transformation: sp_auto/m3u8 is a Cloudinary standard for adaptive HLS
      paramsToSign.eager = 'sp_auto/m3u8';
      paramsToSign.eager_async = 'true';
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      config.cloudinary_api_secret as string
    );

    res.status(200).json({
      success: true,
      data: {
        signature,
        timestamp,
        cloudName: config.cloudinary_cloud_name,
        apiKey: config.cloudinary_api_key,
        eager: paramsToSign.eager,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate signature',
    });
  }
};

export const UploadController = {
  getSignature,
};
