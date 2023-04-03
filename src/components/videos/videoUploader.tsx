import { UploadFile, UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import React, { useCallback, useEffect, useState } from 'react';

const videoUrl = 'https://app-benasstr.cloud.okteto.net/api/videos/trick-1.mp4';

interface VideoUploaderProps {
  onUplaod: (video: RcFile) => void;
}

const acceptedFileType = "video/mp4";

const VideoUploader: React.FunctionComponent<VideoUploaderProps> = 
({
  onUplaod
}) => {
  const [fileList, setFileList] = useState<UploadFile<RcFile>[]>([]);

  const handleOnChange : UploadProps["onChange"] = ({ fileList: newFileList }) => {
    if(newFileList.length <= 0) {
      setFileList([]);
      return;
    } 
    setFileList([newFileList[newFileList.length - 1]]);
  };

  const draggerProps: UploadProps = {
    name: "video",
    accept: acceptedFileType,
    beforeUpload: (file) => {
      onUplaod(file);
      return false;
    },
    listType: "picture-card",
    fileList: fileList, 
    multiple: false,
    onChange: handleOnChange
  };

  return (
    <Dragger {...draggerProps}>Please Upload Here</Dragger>
  );
};

export default VideoUploader;

